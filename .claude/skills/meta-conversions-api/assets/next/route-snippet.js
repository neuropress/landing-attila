// Route handler (e.g. src/app/api/emails/route.js). Consent gate #3.
//
// Why the payload is assembled HERE and not in the browser:
//   - the form fetch is same-origin, so _fbc/_fbp are already on the request
//   - the visitor's real IP is only available server-side, from x-forwarded-for
//   - a client cannot tamper with what it never touches
//
// Without marketing consent metaFields is null and nothing leaves this server.
// A hashed email is still personal data; server-side sending is not an exemption.

import { CONSENT_COOKIE, hasMarketingConsent } from '@/lib/consent'

export async function POST(req) {
  const data = await req.json()

  // ... your existing work: validation, reCAPTCHA, transactional email, DB ...
  // None of it may depend on consent. Its legal basis is the form submission.

  const metaFields = hasMarketingConsent(req.cookies.get(CONSENT_COOKIE)?.value)
    ? {
        consent: true,
        event_id: data.event_id,
        event_source_url: data.event_source_url,
        fbc: req.cookies.get('_fbc')?.value,
        fbp: req.cookies.get('_fbp')?.value,
        client_user_agent: req.headers.get('user-agent'),
        // First entry only - the rest of the chain is proxies. Without this, PHP
        // would see the Next server's IP and match quality collapses.
        client_ip_address: req.headers
          .get('x-forwarded-for')
          ?.split(',')[0]
          .trim(),
      }
    : null

  await sendToCapi(data, metaFields)

  return Response.json({ success: true })
}

// Variant A: standalone capi-lead.php on the cPanel host.
// A failure here must never fail the form - the lead is already saved and emailed.
async function sendToCapi(data, meta) {
  if (!meta) return // no consent: nothing to send

  try {
    const res = await fetch(process.env.CAPI_ENDPOINT_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-capi-secret': process.env.CAPI_SHARED_SECRET,
      },
      body: JSON.stringify({
        event_name: 'Lead',
        name: data.name,
        email: data.email,
        phone: data.phone,
        content_category: Array.isArray(data.service)
          ? data.service.join(', ')
          : data.service,
        meta,
      }),
      // Tracking is not worth stalling a form response for.
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) console.error('CAPI endpoint failed:', res.status)
  } catch (error) {
    console.error('CAPI endpoint unreachable:', error)
  }
}

// Variant B: the project already POSTs the lead to its own PHP API. Then do NOT add
// capi-lead.php - just pass `meta` along in that existing request body:
//
//   body: JSON.stringify({ name, email, phone, message, services, ...(meta && { meta }) })
//
// and call meta_send_event() inside that PHP file after the DB commit.
// See references/runbook.md, "B variant".

// .env keys used above:
//   NEXT_PUBLIC_META_PIXEL_ID=1234567890      # build-time inlined, redeploy on change
//   CAPI_ENDPOINT_URL=https://api.example.com/capi-lead.php
//   CAPI_SHARED_SECRET=<long random string, same value in meta.config.php>
