# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Hungarian single-page landing site for Neuropress Terápia, therapist **Vargha Attila** (repo `neuropress/landing-attila`, domain `neuropress.hu`). A sibling repo, `../neuropress-landing-2` (`landing-zsolt`, therapist Vargha Zsolt), is a fork of this code with different locations and content. A fix in shared code (contact action, gsap components, layout) usually applies to both repos. Port it by hand: the repos share no packages.

All user-facing text is in Hungarian. Keep it in Hungarian.

## Commands

- `npm run dev`: start the dev server on http://localhost:3000.
- `npm run build`: production build. This is also the type check, because there is no separate `tsc` script.
- `npm run lint`: ESLint (flat config, `eslint-config-next` core-web-vitals + typescript).
- No test suite exists.

Stack: Next.js 16 (App Router), React 19, Tailwind CSS v4 (configured in `app/globals.css`, no `tailwind.config`), GSAP + `@gsap/react`, Swiper, Font Awesome, nodemailer. Path alias `@/*` maps to the repo root.

## Architecture

- `app/page.tsx` stacks the section components from `app/components/` in display order. Header, footer and `FooterSpacer` are in `app/layout/` (a folder, not a route group), and `app/layout.tsx` mounts them. Sections link to each other through hash anchors (`#about`, `#pricing`, `#contact`). `html { scroll-padding-top }` in `globals.css` offsets these anchors for the fixed header.
- `app/layout.tsx` holds all SEO: the `metadata` object, the JSON-LD `HealthAndBeautyBusiness` schema, GTM (`GTM-NBHLGKN7` via `@next/third-parties`) and the Font Awesome kit script. `app/sitemap.ts` and `app/robots.ts` hard-code `https://neuropress.hu`.
- `app/components/gsap/` contains reusable animation wrappers (`AnimatedContent`, `FadeContent`, `SplitText`, `ScrollStack`). Recent commits removed the scroll stack, smooth scroll and hero animation for performance. Do not add them back without a reason.
- Brand colors are CSS variables on `:root` in `globals.css` (`--primary-color: #199ba9` and others). Fonts: Montserrat through `next/font`; Gotham files are in `public/fonts/`.
- Legal pages: `adatvedelmi-tajekoztato` (privacy), `cookie-szabalyzat` (cookies), `aszf` (terms).

### Contact flow

1. `Prices.tsx` dispatches a `window` `CustomEvent("selectTherapy")`. `Contact.tsx` listens for it and pre-fills the therapy field.
2. `Contact.tsx` validates on the client, then calls the server action `sendContactEmail` in `app/actions/contact.ts`.
3. The server action validates again against two allow-lists: `THERAPY_OPTIONS` and the keys of `LOCATION_EMAILS`. Each location routes the operator email to a different inbox. The action then sends two emails through SMTP (operator + user confirmation).
4. After the emails are sent, the action POSTs the submission to an external PHP admin API (`${NEXT_PUBLIC_API_URL}/api/contact`, header `X-Api-Key`). A failure here is only logged and does not block the user. `FRONTEND_INTEGRATION.md` (gitignored) documents that API.
5. On success the client does a full redirect (`window.location.href`) to `/koszonjuk` (thank-you page, `noindex`). This page is the conversion URL for tracking. Keep the redirect.

When you add or rename a location or therapy, update `LOCATION_EMAILS`/`THERAPY_OPTIONS` in `contact.ts` **and** the option lists and default `location` in `Contact.tsx`. The strings must match exactly, or the server rejects the form.

Env vars (`.env` / `.env.local`, gitignored): `SMTP_HOST`, `SMTP_PORT` (465 means TLS), `SMTP_USER`, `SMTP_PASS`, optional `SMTP_FROM`, `NEXT_PUBLIC_API_URL`, `CONTACT_API_KEY` (server-only, never prefix it with `NEXT_PUBLIC_`).

## Project-local Claude config

`.claude/skills/meta-conversions-api/` is a project skill for adding Meta Pixel + Conversions API (server-side Lead events behind cookie consent, sent through a PHP sender). Use it for any Meta/Facebook tracking work on this site.
