# Project Specs — NiteNexo Solutions Website

## What the app does and who uses it
Marketing website for **NiteNexo Solutions** (Stefan Trendafilov, Wien) — a small digital
workshop building **chatbots (specialised in WhatsApp), websites and custom digital assistants**
for hospitality, bars and clubs. Chatbots are the core product on any channel — WhatsApp is the
declared specialty, Instagram and on-site web widgets are offered too; copy must not narrow the
offering to WhatsApp alone. Visitors are venue owners — little time, non-technical, high
WhatsApp/Instagram volume. German copy, informal "Du".

In addition to the public marketing pages, registered users (prospective/existing clients) can
**log in and book a consultation appointment** with NiteNexo directly through the site — no more
emailing back and forth to find a slot. Payment (Stripe) is explicitly **out of scope for now** —
appointments are free to book; billing happens outside the app.

Visual language: the **Botwerk Design System** (violet-midnight + lime, two-polarity surfaces).
The layout is the "Hostire" landing structure rebuilt in that style. NiteNexo is the brand; Botwerk
is only the underlying component library.

## Tech stack
- TypeScript, Next.js (App Router), Tailwind CSS + Botwerk design tokens (CSS custom properties).
- Fonts: `next/font/google` — Space Grotesk (display), Rubik (UI); Monaco for code.
- Animation: **GSAP + ScrollTrigger** via `@gsap/react` for the showpiece motion (scroll progress
  bar, scroll reveals, parallax, kinetic word-rise headlines, count-up stats). Ambient loops
  (aurora drift, marquee, sticker float, chat pulse/typing) stay as lightweight CSS keyframes.
- Backend: **Supabase** (Postgres + Auth). Email/password login + registration via
  `@supabase/supabase-js` and `@supabase/ssr`. RLS enabled on every table.
- Appointments handled through Next.js API routes (`/app/api/appointments`) calling a server-side
  Supabase client — never the browser client for writes.
- Hosting: Vercel. Contact form posts to /api/contact and sends over SMTP —
  unrelated to the authenticated appointment booking flow.
- **No Stripe / payments in this phase.** Booking is free; flagged as a future addition.
- Transactional email: **plain SMTP** via `lib/mailer.ts` (nodemailer, currently Google Workspace).
  Deliberately no vendor API — the provider is swappable through env vars alone. Sends a booking
  confirmation with an `.ics` calendar attachment right after a slot is booked, so it lands directly
  in the user's Google/Apple calendar. Cancellation also sends a short confirmation email.
  Contact form enquiries go to a comma-separated distribution list (`CONTACT_TO`).

## Pages and user flows

### Public
- `/` **Start** (dark): hero (aurora bg, kinetic headline w/ lime keyword, animated WhatsApp chat
  mockup, count-up stat strip) → marquee → About (code block + plug sticker) → industries pills →
  services grid (6, one spotlight) → pricing tiers → "Warum NiteNexo" accordion + code block →
  testimonials → blog teasers → big kinetic CTA → footer.
- `/leistungen` **Leistungen** (dark): hero + 5 alternating detail rows (text ↔ checklist card) + CTA.
- `/preise` **Preise** (dark): 3 pricing tiers (Pro featured/inverted) + Kleinunternehmer note + FAQ.
- `/kontakt` **Kontakt** (dark): 2-col form (with DSGVO consent checkbox ) + contact column.
- `/impressum` **Impressum** (dark): § 5 ECG / § 25 MedienG disclosure.
- `/datenschutz` **Datenschutz** (dark): DSGVO privacy policy.
- `/login` **Login**: email + password, link to `/registrieren`, "Passwort vergessen" via Supabase
  magic link/reset.
- `/registrieren` **Registrieren**: name, email, password (Supabase Auth sign-up, email confirmation).

### Authenticated (requires login, redirect to `/login` if not signed in)
- `/termine` **Terminkalender**: calendar/slot picker showing NiteNexo's available consultation
  slots (defined by Stefan, see admin below); logged-in user picks a free slot → confirms → gets an
  appointment row (`status: confirmed`). Shows the user's own upcoming/past appointments below the
  picker, with a cancel action (sets `status: cancelled`, frees the slot).
- `/konto` **Konto**: basic profile (name, email, change password), sign-out.

### Admin (Stefan & Theodor — gated by an allow-listed set of emails, not a separate role table for now)
- `/admin/termine` **Terminverwaltung**: define which slots are open for booking (date + time +
  duration), see all bookings across users, mark a booking as done/no-show.

Chrome on every page: sticky polarity-aware **NavBar** (blurs + shrinks on scroll, hides on scroll
down / shows on scroll up, mobile burger), **Footer** (lime squiggle + 3 link columns + contact +
legal row), and a persistent **CookieBanner** (localStorage consent).

Real contact details: info@nitenexo.at · +43 660 9390787 · Schumanngasse 9, 1180 Wien.

## Data / storage / third parties
Public contact form posts to `/api/contact`, which sends the enquiry over SMTP to the `CONTACT_TO`
distribution list and a confirmation to the sender. Nothing is stored in the database.

**Supabase Postgres**, RLS on every table:
- `auth.users` — Supabase-managed (email, password hash, confirmed_at).
- `profiles` — `id` (FK → `auth.users.id`), `full_name`, `created_at`. RLS: a user can read/update
  only their own row.
- `slots` — `id`, `starts_at`, `ends_at`, `is_booked` (bool). RLS: anyone authenticated can read
  open slots; only admins (service-role API route, allow-listed emails for Stefan & Theodor) can
  insert/update slots.
- `appointments` — `id`, `user_id` (FK → `auth.users.id`), `slot_id` (FK → `slots.id`, **UNIQUE**),
  `status` (`confirmed` | `cancelled` | `completed` | `no_show`), `notes`, `created_at`. RLS: a user
  can read/cancel only their own appointments; admin route can read/update all.

**Double-booking protection:** the `UNIQUE` constraint on `appointments.slot_id` (scoped to active
`confirmed` rows via a partial unique index) means two users racing for the same slot can't both
succeed — the second insert fails at the database level, not just in app logic. The booking API
route catches that failure and returns "Slot bereits vergeben" so the UI can refresh and show the
next open slot.

Third-party services in this phase: Supabase (DB + Auth) and an SMTP mail provider (Google
Workspace). No Stripe, no payments. Mail deliberately uses plain SMTP so no vendor is locked in.

## Animations (GSAP-led, brand-restrained, respects reduced motion)
Scroll progress bar; staggered scroll reveals (fade + rise) on cards/headings; hero entrance
choreography; kinetic word-rise headlines (masked words rotate up) on hero + CTA; count-up stats;
gentle parallax on hero art; route-change fade. CSS ambient: aurora blobs, marquee, sticker float,
chat bubble pop / typing dots / online pulse. No bounces, no infinite loops on content text.

## What "done" looks like
`npm run build` passes clean; `npm run dev` runs error-free; all public + auth routes render and
navigate; visuals match the Botwerk tokens and the NiteNexo content; animations smooth and degrade
gracefully. Additionally for the booking feature:
- A new user can register, confirm their email, and log in.
- A logged-in user sees only open slots, books one, sees it in their own list, and can cancel it.
- A logged-out user hitting `/termine`, `/konto`, or `/admin/termine` is redirected to `/login`.
- A non-admin hitting `/admin/termine` is denied (redirect or 403) — RLS verified, not just UI-hidden.
- Cancelling an appointment frees the slot for someone else to book.
- Booking a slot sends a confirmation email with a working `.ics` attachment; cancelling sends a
  cancellation email.
- Two browser tabs booking the same slot at the same time: exactly one succeeds, the other gets a
  clear "already booked" error and the slot list refreshes.

## File structure (within allowed folders)
```
/app        layout, globals.css, template (route fade), page.tsx, leistungen/, preise/,
            werkstatt/ (+ 3 article routes), kontakt/, impressum/, datenschutz/, login/,
            registrieren/ (+ bestaetigen/), passwort-vergessen/, passwort-neu/, termine/,
            konto/, admin/termine/ (Stefan & Theodor only), coming-soon/
/app/api    appointments/ (availability, book, cancel, mine), admin/slots/, contact/, me/
/middleware.ts  coming-soon gate + auth guard for /termine, /konto, /admin
/components ui/ (Button, Badge, Eyebrow, KeywordHighlight, Card, CodeBlock, Spotlight,
                 BackgroundGradientAnimation)
            forms/ (Field, Input, Select)
            marketing/ (Logo, NavBar, Footer, CookieBanner, SquiggleDivider, PricingModel,
                        ArticleCard, ArticleLayout, IntegrationsStrip, Legal, Sticker, Marquee)
            screens/ (NightFilm intro, HeroSpline, HomeScreen + sub-parts: ServicesBento,
                      UseCaseTabs, TestimonialsMarquee, StatStrip, WhyAccordion, ChatPreview,
                      RobotPresenter, MascotRobot, BookingBoard)
            motion/ (MotionRoot, KineticHeading, FlipWords, ScrambleText, SquiggleDraw,
                     CinematicLayer, gsap setup)
            booking/ (BookingFlow, AppointmentList, TerminManager)
/lib        site nav config, pricing/content data, werkstatt article data, admin-emails,
            availability + booking-config, mailer/email/email-template (SMTP),
            google-calendar (OAuth)
/lib/supabase  server.ts (SSR client), client.ts (browser client), admin.ts (service-role, server-only)
/supabase   sql migrations for profiles / slots / appointments + RLS policies
/docs       setup guides (EMAIL-SETUP.md, GOOGLE-KALENDER-SETUP.md)
/public/assets  logo, stickers, squiggle, night-hero.mp4 (+ sm/poster/still), blog stills
```
