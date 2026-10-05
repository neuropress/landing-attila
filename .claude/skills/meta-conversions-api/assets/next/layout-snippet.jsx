// Root layout (src/app/layout.jsx). Only the MetaPixel lines matter here.
//
// Put it in <head>. It renders null until consent, so it costs nothing before that.
// NEXT_PUBLIC_META_PIXEL_ID is inlined at build time -> changing it requires a redeploy.

import MetaPixel from '@/components/MetaPixel'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ...existing head content, GTM, fonts... */}
        <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} />
      </head>
      <body>{children}</body>
    </html>
  )
}
