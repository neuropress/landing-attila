// Client-side form submit. Three additions to an existing handler, marked below.
//
// The whole point: ONE event_id is used by both the browser event and the server
// event, so Meta merges them into a single conversion instead of counting two.

'use client'

async function handleSubmit(event) {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)
  const payload = Object.fromEntries(formData)
  payload.service = formData.getAll('service') // multi-checkbox example

  // --- 1. one id for both transports -------------------------------------------
  const eventId = crypto.randomUUID()

  // --- 2. browser event (silently skipped if the pixel is blocked or unconsented)
  if (window.fbq) {
    window.fbq(
      'track',
      'Lead',
      { content_category: payload.service.join(', ') },
      { eventID: eventId } // note the capital D - fbq is case-sensitive here
    )
  }

  // --- 3. same id + entry URL travel to our own server -------------------------
  payload.event_id = eventId
  payload.event_source_url = window.location.href

  await fetch('/api/emails', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Do NOT read _fbc/_fbp here and put them in the body: the fetch is same-origin, so
// the cookies are already on the request and the route handler reads them server-side.
//
// Do NOT gate this block on consent in the form: window.fbq only exists if the pixel
// loaded, which already required consent, and the route handler re-checks anyway.
