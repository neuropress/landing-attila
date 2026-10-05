'use client'

import { hasMarketingConsent, readConsentCookie } from '@/lib/consent'
import Script from 'next/script'
import { useEffect, useState } from 'react'

// The Meta pixel only enters the DOM after marketing (targeting) consent.
// We listen for the CMP's events, so the pixel starts right after acceptance with no
// page reload, and the root layout never has to read a cookie (which would force the
// whole app into dynamic rendering).
//
// Revoked consent: an already-loaded pixel stays on the page until the next page load.
// The server-side gates (route handler, PHP) close immediately, so nothing reaches the
// Conversions API.
export default function MetaPixel({ pixelId }) {
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    const check = () => setGranted(hasMarketingConsent(readConsentCookie()))
    check()

    // CookieScript event names. Cookiebot: 'CookiebotOnAccept' / 'CookiebotOnLoad'.
    const events = [
      'CookieScriptLoaded',
      'CookieScriptAccept',
      'CookieScriptAcceptAll',
    ]
    events.forEach((event) => window.addEventListener(event, check))
    return () =>
      events.forEach((event) => window.removeEventListener(event, check))
  }, [])

  // Store the click id at the moment of acceptance: `fbclid` is still in the URL,
  // permission now exists, and - unlike the pixel - this code is not blocked by
  // adblockers, because it is part of our own page.
  //
  // A JS-written cookie is capped at 7 days in Safari. The Meta pixel writes it the
  // same way and the click attribution window is 7 days too, so this does not narrow
  // anything.
  useEffect(() => {
    if (!granted) return
    const fbclid = new URLSearchParams(window.location.search).get('fbclid')
    if (!fbclid || /(?:^|;\s*)_fbc=/.test(document.cookie)) return
    document.cookie = `_fbc=fb.1.${Date.now()}.${fbclid}; path=/; max-age=${
      90 * 24 * 60 * 60
    }; samesite=lax`
  }, [granted])

  if (!pixelId || !granted) return null

  return (
    <Script id="meta-pixel" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixelId}');fbq('track','PageView');
    `}</Script>
  )
}
