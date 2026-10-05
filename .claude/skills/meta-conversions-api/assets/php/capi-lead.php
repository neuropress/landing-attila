<?php
/**
 * Standalone Conversions API endpoint (variant A).
 *
 * Server-to-server only: the Next.js route handler POSTs here, never a browser.
 * Deliberately sends no CORS headers, so a page cannot call it via fetch.
 *
 * Place it in the public web root (it needs a URL), with meta.php and
 * meta.config.php beside it - or better, one directory above the web root:
 *   require_once __DIR__ . '/../general/meta.php';
 *
 * Expected body:
 * {
 *   "event_name": "Lead",
 *   "name": "Jane Doe", "email": "...", "phone": "...",
 *   "content_category": "web-development, digital-marketing",
 *   "value": 0, "currency": "EUR",
 *   "meta": { "consent": true, "event_id": "...", "event_source_url": "...",
 *             "fbc": "...", "fbp": "...",
 *             "client_ip_address": "...", "client_user_agent": "..." }
 * }
 *
 * Already have a PHP endpoint that stores the lead? Do not use this file - see
 * variant B in the runbook, and call meta_send_event() there after the commit.
 */

require_once __DIR__ . '/meta.php';

header('Content-Type: application/json');

function capi_out($code, $status)
{
    http_response_code($code);
    echo json_encode(['status' => $status]);
    exit;
}

// --- trust boundary: do not simplify anything below -------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    capi_out(405, 'method not allowed');
}

$secret = defined('CAPI_SHARED_SECRET') ? CAPI_SHARED_SECRET : (getenv('CAPI_SHARED_SECRET') ?: '');
$given = $_SERVER['HTTP_X_CAPI_SECRET'] ?? '';
if ($secret === '' || !hash_equals($secret, $given)) {
    // Deliberately vague - do not tell a prober which half was wrong.
    error_log('CAPI endpoint: rejected request from ' . ($_SERVER['REMOTE_ADDR'] ?? '?'), 0);
    capi_out(401, 'unauthorized');
}

$raw = file_get_contents('php://input');
if (strlen($raw) > 20000) {
    capi_out(413, 'payload too large');
}
$body = json_decode($raw);
if (!is_object($body)) {
    capi_out(400, 'invalid json');
}

// --- consent gate #4 ---------------------------------------------------------------
// No consent -> no call. A hashed email is still personal data; sending it from a
// server is not an exemption from the cookie banner.
if (empty($body->meta) || empty($body->meta->consent)) {
    capi_out(202, 'skipped: no consent');
}

$email = isset($body->email) ? (string) $body->email : '';
$phone = isset($body->phone) ? (string) $body->phone : '';
$name = trim(isset($body->name) ? (string) $body->name : '');

// Meta needs at least one identifier per event.
if ($email === '' && $phone === '') {
    capi_out(400, 'no identifier');
}

$nameParts = $name === '' ? [] : preg_split('/\s+/', $name, 2);
$firstName = isset($nameParts[0]) ? $nameParts[0] : '';
$lastName = isset($nameParts[1]) ? $nameParts[1] : '';

// Allow-list the event name instead of forwarding whatever arrives.
$allowedEvents = ['Lead', 'CompleteRegistration', 'Subscribe', 'Purchase', 'Contact'];
$eventName = isset($body->event_name) && in_array($body->event_name, $allowedEvents, true)
    ? $body->event_name
    : 'Lead';

$customData = [];
if (!empty($body->content_category)) {
    $customData['content_category'] = (string) $body->content_category;
}
if (isset($body->value) && is_numeric($body->value)) {
    $customData['value'] = (float) $body->value;
    $customData['currency'] = !empty($body->currency) ? (string) $body->currency : 'EUR';
}

// A failure here must never look like a broken form to the caller - the lead is
// already saved and emailed on the Next side. Log it and move on.
try {
    $ok = meta_send_event(
        $eventName,
        [
            'em' => meta_hash($email),
            'ph' => meta_hash(meta_normalize_phone($phone)),
            'fn' => meta_hash($firstName),
            'ln' => meta_hash($lastName),
            'external_id' => meta_hash($email), // stable key, matches the CRM's id
        ],
        $customData,
        $body->meta
    );
} catch (Throwable $ex) {
    error_log('CAPI endpoint error: ' . $ex, 0);
    $ok = false;
}

capi_out($ok ? 200 : 502, $ok ? 'sent' : 'meta call failed');

// Not implemented on purpose: rate limiting, replay protection, retry queue.
// The shared secret is the gate; the endpoint stores nothing and is idempotent at
// Meta's end thanks to event_id. Add a token bucket only if the secret leaks.
