# Project Specs — NiteNexo Solutions Website

## What the app does and who uses it
Marketing website for **NiteNexo Solutions** (Stefan Trendafilov, Wien) — a small digital
workshop building **WhatsApp chatbots, websites and custom digital assistants** for hospitality,
bars and clubs. Visitors are venue owners — little time, non-technical, high WhatsApp/Instagram
volume. Public, read-only site with a demo contact form. German copy, informal "Du".

Visual language: the **Botwerk Design System** (violet-midnight + lime, two-polarity surfaces).
The layout is the "Hostire" landing structure rebuilt in that style. NiteNexo is the brand; Botwerk
is only the underlying component library.

## Tech stack
- TypeScript, Next.js (App Router), Tailwind CSS + Botwerk design tokens (CSS custom properties).
- Fonts: `next/font/google` — Space Grotesk (display), Rubik (UI); Monaco for code.
- Animation: **GSAP + ScrollTrigger** via `@gsap/react` for the showpiece motion (scroll progress
  bar, scroll reveals, parallax, kinetic word-rise headlines, count-up stats). Ambient loops
  (aurora drift, marquee, sticker float, chat pulse/typing) stay as lightweight CSS keyframes.
- Hosting: Vercel. No backend / Supabase / auth — contact form is a client-only demo (no data sent).

## Pages and user flows (all public)
- `/` **Start** (dark): hero (aurora bg, kinetic headline w/ lime keyword, animated WhatsApp chat
  mockup, count-up stat strip) → marquee → About (code block + plug sticker) → industries pills →
  services grid (6, one spotlight) → pricing tiers → "Warum NiteNexo" accordion + code block →
  testimonials → blog teasers → big kinetic CTA → footer.
- `/leistungen` **Leistungen** (dark): hero + 5 alternating detail rows (text ↔ checklist card) + CTA.
- `/preise` **Preise** (light): 3 pricing tiers (Pro featured/inverted) + Kleinunternehmer note + FAQ.
- `/kontakt` **Kontakt** (light): 2-col form (with DSGVO consent checkbox + demo notice) + contact column.
- `/impressum` **Impressum** (light): § 5 ECG / § 25 MedienG disclosure.
- `/datenschutz` **Datenschutz** (light): DSGVO privacy policy.

Chrome on every page: sticky polarity-aware **NavBar** (blurs + shrinks on scroll, hides on scroll
down / shows on scroll up, mobile burger), **Footer** (lime squiggle + 3 link columns + contact +
legal row), and a persistent **CookieBanner** (localStorage consent).

Real contact details: stef.tren@gmail.com · +43 660 9390787 · Schumanngasse 9/13, 1180 Wien.

## Data / storage / third parties
None. Contact form does not transmit or store data (clearly labelled as a demo). No Stripe/Supabase.

## Animations (GSAP-led, brand-restrained, respects reduced motion)
Scroll progress bar; staggered scroll reveals (fade + rise) on cards/headings; hero entrance
choreography; kinetic word-rise headlines (masked words rotate up) on hero + CTA; count-up stats;
gentle parallax on hero art; route-change fade. CSS ambient: aurora blobs, marquee, sticker float,
chat bubble pop / typing dots / online pulse. No bounces, no infinite loops on content text.

## What "done" looks like
`npm run build` passes clean; `npm run dev` runs error-free; all 6 routes render + navigate;
visuals match the Botwerk tokens and the NiteNexo content; animations smooth and degrade gracefully.

## File structure (within allowed folders)
```
/app        layout, globals.css, template (route fade), page.tsx, leistungen/, preise/, kontakt/,
            impressum/, datenschutz/
/components ui/ (Button, Badge, Eyebrow, KeywordHighlight, Card, CodeBlock)
            forms/ (Field, Input, Select, Textarea)
            marketing/ (Logo, NavBar, Footer, CookieBanner, SquiggleDivider, PricingCard,
                        PricingTiers, Sticker, Marquee, IndustryPills)
            screens/ (HomeScreen + home sub-parts: ChatPreview, StatStrip, WhyAccordion)
            motion/ (MotionRoot, KineticHeading, Reveal helpers, gsap setup)
/lib        site nav config + pricing/content data
/public/assets  logo, stickers, squiggle, starfield.png
```
