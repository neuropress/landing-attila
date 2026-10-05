---
name: meta-conversions-api
description: Use when a Next.js site needs Meta/Facebook server-side tracking - Conversions API (CAPI) Lead or Purchase events, pixel behind cookie consent, fbclid/_fbc/_fbp click-id handling, browser+server event deduplication - or when form conversions are missing from Events Manager, Event Match Quality is low, or an adblocker kills the pixel. Assumes a cPanel/PHP host is available for the server-side sender.
---

# Meta Conversions API (server-side tracking) for Next.js + cPanel PHP

## Overview

The browser pixel alone loses conversions: adblock, tracking protection, Safari ITP.
The Conversions API sends the **same** conversion from a server with hashed PII, so a
lead that reached the CRM can still be attributed to an ad even if `fbevents.js` never
ran. Both copies carry the **same `event_id`**, so Meta dedupes them into one conversion.

**Core principle: one conversion, two transports, one `event_id`, four consent gates.**

Hashing happens only on the copy sent to Meta. The database keeps raw data, unchanged.

## When to Use

- "Set up Meta Pixel / Conversions API / server-side tracking on this Next.js site"
- Form submits fine but Events Manager shows no `Lead`, or only a Browser event
- Leads arrive with no ad attribution; Event Match Quality is low
- The marketing agency asks for "CAPI", "server-side events", or a "dataset token"
- Pixel must be gated behind a cookie banner (GDPR/ePrivacy)
- Deduplication is broken - one submit counted twice in Events Manager

**Do NOT use when:** the project has no PHP host (put `meta.php`'s logic in a Next.js
route handler and call Graph API directly - the consent and `event_id` design below
still applies unchanged), or when there is no conversion worth tracking.

## Architecture

```
Browser                     Next.js server              PHP on cPanel        Meta
-------                     --------------              -------------        ----
ad click ?fbclid=ABC
  |
consent banner --reject--> nothing is sent to Meta, lead still saved + emailed
  | accept (targeting)
MetaPixel.js
  - loads pixel (PageView)
  - writes _fbc cookie
  |
form submit
  event_id = randomUUID()
  fbq('track','Lead',...,{eventID})  ------------------------------> Browser Lead
  |
  POST /api/... {event_id, event_source_url}
                              |
                       consent gate -> metaFields
                       reads _fbc/_fbp cookies,
                       x-forwarded-for IP, user-agent
                              |
                              +--------------> capi-lead.php
                                               consent gate
                                               SHA256 em/ph/fn/ln
                                               meta_send_event() ---> Server Lead
                                                                          |
                                               dedup on event_id -> ONE conversion
```

## The four consent gates (never remove one)

Server-side tracking does **not** exempt you from consent. Reading a cookie is already
access to information on the user's device (ePrivacy), and a hashed email is still
personal data (pseudonymous, not anonymous). So:

| # | Where | What it blocks |
|---|---|---|
| 1 | `MetaPixel.js` | no consent -> pixel never enters the DOM |
| 2 | `MetaPixel.js` | no consent -> `_fbc` cookie is not written |
| 3 | Next route handler | no consent -> `metaFields = null`, nothing leaves Next |
| 4 | `capi-lead.php` | no `meta.consent` -> no CAPI call at all |

`meta_send_event()` itself checks nothing - that is deliberate, the caller owns consent.

There is no "consentless event": CAPI requires at least one identifier per event, and
everything sendable (IP, UA, hash) is personal data. Without consent the lead lives in
the project's own system only.

**What never depends on consent:** saving the lead and sending the sales email. Their
legal basis is the form submission, not the cookie banner.

## Files to create

| File | Role | Asset to copy |
|---|---|---|
| `src/lib/consent.js` | read CMP consent (client + server) | `assets/next/consent.js` |
| `src/components/MetaPixel.js` | client: load pixel after consent, write `_fbc` | `assets/next/MetaPixel.js` |
| root `layout.jsx` | render `<MetaPixel pixelId={...} />` | `assets/next/layout-snippet.jsx` |
| form component | `event_id`, browser `Lead`, id into the POST body | `assets/next/form-snippet.js` |
| route handler | consent gate, build `metaFields`, forward | `assets/next/route-snippet.js` |
| `meta.php` (cPanel) | hashing, phone normalize, `meta_send_event`, CLI selftest | `assets/php/meta.php` |
| `meta.config.php` (cPanel, secret, not in git) | pixel ID + CAPI token | `assets/php/meta.config.example.php` |
| `capi-lead.php` (cPanel) | public endpoint: secret check, consent gate, hash, send | `assets/php/capi-lead.php` |

Two integration shapes - pick one:

- **A. Standalone endpoint** (default, portable): the Next route POSTs to
  `capi-lead.php`. Copy `assets/php/capi-lead.php` as-is.
- **B. Existing PHP API**: the project already has a PHP endpoint that stores the lead.
  Drop `meta.php` next to it and call `meta_send_event()` after the DB commit - see
  `references/runbook.md`, "B variant". Do not add `capi-lead.php` in that case.

## Implementation order (do not reorder)

1. **Get the two secrets first** - `META_PIXEL_ID` (dataset ID) and `META_CAPI_TOKEN`.
   Nothing is verifiable without them. Who supplies them: roles table in
   `references/runbook.md`.
2. **Identify the CMP and read its actual cookie in the browser** before writing
   `hasMarketingConsent`. Guessing the cookie shape is the most common failure here.
3. `consent.js` -> `MetaPixel.js` -> `layout.jsx`. Verify in the browser: no consent =
   no `connect.facebook.net` request. Do not continue until that holds.
4. Form: `event_id` + `fbq('track','Lead', ..., { eventID })` + id in the POST body.
5. Route handler: consent gate + `metaFields`.
6. PHP: upload `meta.php`, create `meta.config.php`, run `php meta.php --selftest`.
7. Point the route at the PHP endpoint; set the shared secret on both sides.
8. Hand `references/runbook.md` sections 6-8 to the developer for manual verification.

## Non-obvious decisions (keep these)

- **Write `_fbc` from client code, not middleware.** At page load there is no consent
  yet; acceptance comes after. The accept moment is the only correct place. Bonus: your
  own code is not adblocked, so `_fbc` survives even when the pixel does not.
- **Build the CAPI payload on the Next server from request cookies, not in the browser.**
  The form fetch is same-origin, so `_fbc`/`_fbp` are already on the request. This keeps
  the payload out of client reach.
- **Forward the first IP of `x-forwarded-for` explicitly.** Otherwise PHP sees the Next
  server's IP and match quality collapses.
- **`external_id` = hashed email.** Stable key; matches what a CRM typically keys on.
- **Do not send the free-text message field.** No purpose, more exposure.
- **Sanitize in PHP** - the fields ultimately come from a client: `fbc`/`fbp` must match
  `fb.<n>.<ts>.<value>`, `event_source_url` through `FILTER_VALIDATE_URL`, IP through
  `FILTER_VALIDATE_IP`, `event_id` truncated to 100 chars.
- **No synthetic `_fbp`.** Generating one when the pixel is blocked only adds noise -
  Meta never saw it, so it can never match.
- **A CAPI failure must never fail the form.** Wrap the call, log to `error_log`, still
  return 200. The lead matters more than the tracking.
- **The standalone `capi-lead.php` is public internet.** Keep its shared-secret check
  and `POST`-only guard. This is a trust boundary, not a place to simplify.

## Adapting to a different CMP

`assets/next/consent.js` is written for **CookieScript**, whose cookie value is
URL-encoded JSON where `categories` is a *string-encoded* array:

```json
{"action":"accept","categories":"[\"targeting\",\"functionality\"]"}
```

Only `hasMarketingConsent` changes for another CMP:

| CMP | Cookie | Marketing signal |
|---|---|---|
| CookieScript | `CookieScriptConsent` | `categories` contains `"targeting"` |
| Cookiebot | `CookieConsent` | `marketing:true` in the value |
| Other | varies | inspect DevTools -> Application -> Cookies, accept once, compare |

**Never substring-match the raw cookie for the category name** - CookieScript's
`googleconsentmap` contains the word `targeting` even when marketing was rejected.
Parse first, then check.

If the CMP is loaded through GTM, do not rely on its auto-blocking: read the cookie, as
`consent.js` does. Auto-blocking cannot see a pixel that your own React component
injects.

## Common mistakes

| Symptom | Cause |
|---|---|
| `_fbc`/`_fbp` appear then vanish on each page load | cookies not declared in the CMP cookie table, so the CMP deletes them. Add both under the marketing/targeting category. |
| One submit = two conversions | a second Meta Pixel tag exists in GTM. Remove it - the GTM event carries no `event_id`, so it cannot dedupe. |
| Only Browser event in Test Events | PHP side failed. Check `error_log` for `Meta CAPI Lead failed (HTTP ...)`. |
| Only Server event in Test Events | pixel never ran - no consent, or adblock. Often correct behavior. |
| Server event arrives but attribution is poor | `fbc` missing (no `fbclid` on the entry URL), or the Next server's IP is being sent instead of the visitor's. |
| Pixel ID changed, nothing happened | `NEXT_PUBLIC_*` is inlined at build time - redeploy. |
| Events stop counting for ad optimization | `META_TEST_EVENT_CODE` left in the config. Remove it after testing. |
| Phone never matches | wrong country trunk prefix - `meta_normalize_phone` is a length heuristic calibrated for RO/HU. |
| CAPI returns HTTP 400 `Invalid parameter` | usually an unhashed `em`/`ph`, or a phone with a leading `+`. Meta wants digits only. |

## Verification (required before claiming done)

1. `php meta.php --selftest` -> `meta.php selftest OK`
2. Incognito, reject everything: no `connect.facebook.net` request, no `#meta-pixel` in
   the DOM, no `_fbp`/`_fbc`.
3. Accept -> pixel loads without a reload, `_fbp` appears.
4. `?fbclid=TEST456` -> `_fbc = fb.1.<ts>.TEST456`, survives refresh and navigation.
5. Submit -> Events Manager **Test Events**: Browser Lead + Server Lead, same `event_id`.
6. Negative test: reject + submit -> the lead arrives, **no** Server event. This is the
   compliance proof.

Full click-by-click procedure including the adblocker case:
`references/runbook.md` section 7.

## Deliverables for humans

- `references/runbook.md` - step-by-step for the developer: roles and who supplies which
  secret, cPanel upload, GTM/CMP settings, the full manual test procedure, handover.
- `references/how-it-works-simple.md` - plain-language explanation for a non-technical
  stakeholder. Hand this over instead of explaining verbally.
