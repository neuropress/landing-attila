<?php
/**
 * Meta Conversions API helper. Framework-free, PHP 7.0+, needs curl.
 *
 * Upload to the cPanel host, outside the public web root if possible
 * (e.g. ~/api/general/meta.php), and require_once it from the endpoint.
 *
 * Config order: meta.config.php next to this file > getenv() > default.
 * Put the token in meta.config.php - do NOT edit secrets into this file.
 *   META_PIXEL_ID        - the pixel (dataset) ID
 *   META_CAPI_TOKEN      - Events Manager > Settings > Conversions API token
 *   META_API_VERSION     - Graph API version (default v21.0)
 *   META_TEST_EVENT_CODE - optional, for Events Manager > Test Events
 *
 * Self-test:  php meta.php --selftest
 */

if (file_exists(__DIR__ . '/meta.config.php')) {
    require_once __DIR__ . '/meta.config.php';
}

defined('META_PIXEL_ID') || define('META_PIXEL_ID', getenv('META_PIXEL_ID') ?: '');
defined('META_CAPI_TOKEN') || define('META_CAPI_TOKEN', getenv('META_CAPI_TOKEN') ?: '');
defined('META_API_VERSION') || define('META_API_VERSION', getenv('META_API_VERSION') ?: 'v21.0');
defined('META_TEST_EVENT_CODE') || define('META_TEST_EVENT_CODE', getenv('META_TEST_EVENT_CODE') ?: '');
defined('META_PHONE_DEFAULT_PREFIX') || define('META_PHONE_DEFAULT_PREFIX', getenv('META_PHONE_DEFAULT_PREFIX') ?: '40');

/**
 * SHA256 with the normalization Meta expects (trim + lowercase, UTF-8).
 * Returns null for an empty value, so we never send an empty hash.
 */
function meta_hash($value)
{
    $value = trim((string) $value);
    if ($value === '') {
        return null;
    }
    $value = function_exists('mb_strtolower') ? mb_strtolower($value, 'UTF-8') : strtolower($value);

    return hash('sha256', $value);
}

/**
 * Phone to E.164 without the plus sign - Meta wants digits only (e.g. 40740123456).
 *
 * This is a length heuristic calibrated for RO (0xxxxxxxxx) and HU (06xxxxxxxxx).
 * Other countries: either send E.164 from the form, or add a trunk-prefix table here.
 * Set META_PHONE_DEFAULT_PREFIX to the country code of your main market.
 */
function meta_normalize_phone($phone)
{
    $digits = preg_replace('/\D+/', '', (string) $phone);
    if ($digits === '') {
        return '';
    }

    // 0040... international prefix
    if (strpos($digits, '00') === 0) {
        $digits = substr($digits, 2);
    }

    // national trunk prefix (0)
    if (strpos($digits, '0') === 0) {
        $national = ltrim($digits, '0');
        if (strlen($digits) === 11 && strpos($digits, '06') === 0) {
            $digits = '36' . substr($national, 1); // HU: the 6 is part of the trunk prefix
        } else {
            $digits = META_PHONE_DEFAULT_PREFIX . $national;
        }
    } elseif (strlen($digits) <= 9) {
        // given without a country code
        $digits = META_PHONE_DEFAULT_PREFIX . $digits;
    }

    return $digits;
}

/**
 * Sends one event to the Conversions API.
 *
 * IMPORTANT: checking marketing consent is the CALLER's job - this function sends
 * everything it is handed.
 *
 * @param string $eventName  e.g. 'Lead', 'Purchase', 'CompleteRegistration'
 * @param array  $userData   already-hashed PII (em, ph, fn, ln, external_id)
 * @param array  $customData non-hashed custom fields (value, currency, content_category)
 * @param mixed  $meta       object/array coming from the client side:
 *                           event_id, event_source_url, fbc, fbp,
 *                           client_ip_address, client_user_agent
 * @return bool true on a 200 from Graph API
 */
function meta_send_event($eventName, array $userData, array $customData = [], $meta = null)
{
    if (META_PIXEL_ID === '' || META_CAPI_TOKEN === '') {
        return false; // not configured, skip silently
    }

    $meta = is_object($meta) ? (array) $meta : (is_array($meta) ? $meta : []);
    $get = function ($key) use ($meta) {
        return isset($meta[$key]) && is_string($meta[$key]) ? trim($meta[$key]) : '';
    };

    // These fields ultimately originate from a client -> sanitize every one of them.
    $fbc = preg_match('/^fb\.\d\.\d+\..+$/', $get('fbc')) ? $get('fbc') : null;
    $fbp = preg_match('/^fb\.\d\.\d+\..+$/', $get('fbp')) ? $get('fbp') : null;
    $sourceUrl = filter_var($get('event_source_url'), FILTER_VALIDATE_URL) ?: null;
    $ip = filter_var($get('client_ip_address'), FILTER_VALIDATE_IP) ?: null;
    $userAgent = $get('client_user_agent') !== '' ? substr($get('client_user_agent'), 0, 500) : null;
    $eventId = $get('event_id') !== '' ? substr($get('event_id'), 0, 100) : null;

    $userData = array_filter(
        array_merge($userData, [
            'fbc' => $fbc,
            'fbp' => $fbp,
            'client_ip_address' => $ip,
            'client_user_agent' => $userAgent,
        ]),
        function ($v) {
            return $v !== null && $v !== '';
        }
    );

    $event = array_filter([
        'event_name' => $eventName,
        'event_time' => time(),
        'event_id' => $eventId,
        'action_source' => 'website',
        'event_source_url' => $sourceUrl,
        'user_data' => $userData,
        'custom_data' => array_filter($customData, function ($v) {
            return $v !== null && $v !== '';
        }),
    ], function ($v) {
        return $v !== null && $v !== [];
    });

    $payload = ['data' => [$event], 'access_token' => META_CAPI_TOKEN];
    if (META_TEST_EVENT_CODE !== '') {
        $payload['test_event_code'] = META_TEST_EVENT_CODE;
    }

    $url = 'https://graph.facebook.com/' . META_API_VERSION . '/' . META_PIXEL_ID . '/events';
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 3,
        CURLOPT_CONNECTTIMEOUT => 2,
    ]);
    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($status !== 200) {
        error_log('Meta CAPI ' . $eventName . ' failed (HTTP ' . $status . '): ' . ($curlError ?: $body), 0);

        return false;
    }

    return true;
}

// php meta.php --selftest
if (PHP_SAPI === 'cli' && isset($argv) && in_array('--selftest', $argv, true)) {
    // Not assert(): zend.assertions=-1 on shared hosting would silently pass everything.
    $failed = 0;
    $check = function ($actual, $expected, $label) use (&$failed) {
        if ($actual !== $expected) {
            $failed++;
            echo "FAIL $label: got " . var_export($actual, true) . ", want " . var_export($expected, true) . "\n";
        }
    };
    $check(meta_normalize_phone('0740 123 456'), '40740123456', 'RO local');
    $check(meta_normalize_phone('+40740123456'), '40740123456', 'RO E.164');
    $check(meta_normalize_phone('0040-740-123-456'), '40740123456', 'RO 00 prefix');
    $check(meta_normalize_phone('06 30 123 4567'), '36301234567', 'HU local');
    $check(meta_normalize_phone('740123456'), '40740123456', 'no prefix');
    $check(meta_normalize_phone(''), '', 'empty phone');
    $check(meta_hash(' Test@Example.COM '), hash('sha256', 'test@example.com'), 'email hash');
    $check(meta_hash('   '), null, 'empty hash');
    echo $failed === 0 ? "meta.php selftest OK\n" : "meta.php selftest: $failed failed\n";
    exit($failed === 0 ? 0 : 1);
}
