// Cookie-consent reader, usable on the client AND on the server (route handler,
// middleware), because both sides can see the CMP cookie.
//
// Written for CookieScript. The cookie value is URL-encoded JSON in which
// `categories` is itself a STRING-encoded array:
//   {"action":"accept","categories":"[\"targeting\",\"functionality\"]", ...}
//
// Using a different CMP? Only `hasMarketingConsent` changes - accept marketing once
// in the browser, look at the cookie in DevTools > Application > Cookies, and parse
// that shape. Everything else in this setup stays the same.

export const CONSENT_COOKIE = 'CookieScriptConsent'

export function hasMarketingConsent(cookieValue) {
  if (!cookieValue) return false
  try {
    // Parse, then inspect only `categories`. A plain substring check on the raw
    // cookie is a false positive: CookieScript's `googleconsentmap` contains the
    // word "targeting" even when marketing was rejected.
    const { categories } = JSON.parse(decodeURIComponent(cookieValue))
    return String(categories).includes('"targeting"')
  } catch {
    return false
  }
}

export function readConsentCookie() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)`)
  )
  return match ? match[1] : null
}
