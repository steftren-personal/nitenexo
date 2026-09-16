# Project Specs — NiteNexo Solutions Website

## What the app does and who uses it
Marketing website for **NiteNexo Solutions** (Stefan Trendafilov, Wien) — a small digital
workshop building **websites and KI-Integration** for hospitality, events and nightlife
(see "Rebranding 09/2026" below). Website-Creation and KI-Integration are the core; chatbots
(WhatsApp first, Instagram and on-site widgets too) are one building block inside KI-Integration.
Visitors are venue and event owners — little time, non-technical, high WhatsApp/Instagram
volume. German copy, informal "Du".

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
  services grid (6, one spotlight) → pricing panels → "Warum NiteNexo" accordion + code block →
  Projekte grid („Umgesetzt für") → blog teasers → big kinetic CTA → footer.
- `/leistungen` **Leistungen** (dark): hero + 3 alternating detail rows (text ↔ checklist card) + CTA.
- `/projekte` **Projekte** (dark): hero + one long-form block per reference project + CTA.
- `/preise` **Preise** (dark): 3 pricing panels (KI-Integration featured) + Kleinunternehmer note + FAQ.
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

## Rebranding 09/2026 — Websites & KI-Integration als Kern (approved by Stefan, 2026-09-16)

**Why:** the old positioning ("Digitale Assistenten für Gastro & Clubs", chatbots at the centre)
no longer matches what NiteNexo sells. Websites and KI-Integration are the core now; chatbots
are one building block inside KI-Integration. Spec source: `docs/FELIX_REBRAND.md`.

**Tagline everywhere** (meta title, ThreadFilm static hero subline, footer, OpenGraph):
„Websites & KI-Integration für Gastro, Events und Nachtleben".
**Meta description:** „NiteNexo Solutions aus Wien baut Websites, die verkaufen, und KI, die
mitarbeitet: Event-Seiten, Bar- und Club-Websites, Automatisierung und Assistenten.
DSGVO-tauglich, in Tagen live."

**Copy changes (no structural change to the ThreadFilm/StoryBeat choreography):**
- Hero (ThreadFilm bands + settle hero): first promise = a website that sells at 23:40, second =
  KI that takes over the workflow, chatbot as the example inside the KI line. Settle headline
  „Websites, die verkaufen. KI, die mitarbeitet." CTA „Projekt starten" unchanged.
- `/leistungen`: three services in this order: 1) **Website-Creation** (event pages, bar/club
  sites, landing pages; DSGVO without cookie banner, ticket/reservation links, live in days),
  2) **KI-Integration** (assistants + automation: WhatsApp/reservation chatbots, guest lists,
  bookkeeping and social-media workflows; „Beratung & Setup" merged in), 3) **Hosting & Wartung**
  (monthly: hosting, updates, security, support). Chatbot copy shortened, not deleted.
  Each row has an anchor id (`website-creation`, `ki-integration`, `hosting-wartung`).
- `/preise`: one panel per service. Existing figures only: Website-Creation €500 – €3.000 (the
  range main already carried for „Website"), KI-Integration shows €300 – €4.000 as the example
  position „Chatbot-Einrichtung" with other automation quoted by scope; Hosting & Wartung is the
  monthly retainer. No new number was invented.
- Homepage: services bento reordered to the three core services + three building blocks
  (Chatbots, Automatisierung, Anbindungen); About, flip-words band and pricing subline reworded.
- Contact form service select uses the three new service names.
- Voice: `nitenexo-brand-voice` skill (Du-Form, concrete, no em-dashes in new copy, no AI jargon).
- Untouched on purpose: auth, konto, termine, admin, Supabase, middleware, e-mail, Impressum,
  Datenschutz (no new third-party service was added).

**Clients Highlight („Projekte"):** the testimonial marquee contained invented quotes, which is
not defensible (UWG, no fake reviews). It is removed and replaced by:
- `lib/projects.ts` — typed data for three reference projects (facts only, no invented numbers,
  no person names for Sorry Not Sorry): Teen Clubbing Wien (website), Sorry Not Sorry Event
  (KI-Integration: WhatsApp guest-list chatbot), NiteNexo itself (one human, five KI agents).
  Guarded by `lib/projects.test.ts` (`npm test`, Node's built-in runner, no new dependency).
- Homepage section „Umgesetzt für" / „Echte Projekte, echte Zahlen." — 3-card grid (stacked on
  mobile): avatar, name, category badge (Website / KI-Integration), one result sentence, three
  fact chips, link. Component: `components/screens/ProjectsSection.tsx` +
  `components/marketing/ProjectCard.tsx`.
- `/projekte` — long form, one block per project: Teen Clubbing with real screenshots of the live
  site (captured headless, stored as WebP under `public/projekte/`), Sorry Not Sorry with a static
  chat mock, NiteNexo with an agents graphic built from the robot mark. Reveal animations via the
  existing `data-reveal` mechanism (reduced motion respected by MotionRoot).
- Navigation: „Projekte" sits between Leistungen and Preise; „Werkstatt" stays.
- Assets: `public/projekte/` holds local WebP avatars + screenshots only (no external requests).

**Done means:** `npm run build`, `npm run lint`, `npm test` green; homepage shows the Projekte grid
where the testimonials were; `/projekte` renders all three blocks; nav and footer link to it.

## File structure (within allowed folders)
```
/app        layout, globals.css, template (route fade), page.tsx, leistungen/, projekte/
            (+ ChatMock, AgentsGraphic), preise/,
            werkstatt/ (+ 3 article routes), kontakt/, impressum/, datenschutz/, login/,
            registrieren/ (+ bestaetigen/), passwort-vergessen/, passwort-neu/, termine/,
            konto/, admin/termine/ (Stefan & Theodor only), coming-soon/
/app/api    appointments/ (availability, book, cancel, mine), admin/slots/, contact/, me/
/middleware.ts  coming-soon gate + auth guard for /termine, /konto, /admin
/components ui/ (Button, Badge, Eyebrow, KeywordHighlight, Card, CodeBlock, Spotlight,
                 BackgroundGradientAnimation)
            forms/ (Field, Input, Select)
            marketing/ (Logo, NavBar, Footer, CookieBanner, SquiggleDivider, PricingModel,
                        ArticleCard, ArticleLayout, IntegrationsStrip, Legal, Sticker, Marquee,
                        ProjectCard)
            screens/ (ThreadFilm scrub intro, HomeScreen + sub-parts: ServicesBento,
                      UseCaseTabs, ProjectsSection, StatStrip, WhyAccordion, ChatPreview,
                      RobotPresenter mit Halte-Moment, MascotRobot, BookingBoard)
            motion/StoryThread (der Seiten-Faden), marketing/ChapterKicker (Kapitel-Knoten)
            motion/ (MotionRoot, KineticHeading, FlipWords, ScrambleText, SquiggleDraw,
                     CinematicLayer, gsap setup)
            booking/ (BookingFlow, AppointmentList, TerminManager)
/lib        site nav config, pricing/content data, projects data (+ test), werkstatt article
            data, admin-emails,
            availability + booking-config, mailer/email/email-template (SMTP),
            google-calendar (OAuth)
/lib/supabase  server.ts (SSR client), client.ts (browser client), admin.ts (service-role, server-only)
/supabase   sql migrations for profiles / slots / appointments + RLS policies
/docs       setup guides (EMAIL-SETUP.md, GOOGLE-KALENDER-SETUP.md)
/public/assets  logo, stickers, squiggle, film/ (film-desktop.mp4, film-mobile.mp4, posters, scene-map.json), thread-ending.jpg (thread-env), night-hero.mp4 (alt, ungenutzt), blog stills
/public/projekte  client avatars + Teen Clubbing screenshots (local WebP only)
```

## Film „Eine Nacht, ein Take" 09/2026 — Kapitel laufen in den Szenen (approved via docs/FELIX_FILM.md, 2026-09-16)

**Why:** the 15 s „Der Faden" take is replaced by a photoreal 27.25 s KI film cut from six
scenes. The page mechanics stay exactly as they are (ThreadFilm scrubbing, caption bands,
StoryBeats, buttons, chat preview, robots); only the film and its time map change.

**Assets** (`public/assets/film/`, copied from `assets/film/`): `film-desktop.mp4` 1600x900,
`film-mobile.mp4` 540x960 portrait crop with the same timeline, `film-poster.webp`,
`film-poster-mobile.webp`, `scene-map.json` (six scenes with `start`/`end`/`stable_from`/
`stable_to`, 0.6 s crossfades, page order: Hero → Morgen → Faden → Club → Website → Tresen).

**Time map** (`lib/film-timeline.ts`, pure, tested by `lib/film-timeline.test.ts`):
- Hero region (800vh sticky stage) scrubs scene 1's stable range 0 → 4.44 s with the five bands.
- Every StoryBeat below binds to the next scene: while the beat scrolls into the viewport the
  film scrubs the crossfade (previous `stable_to` → own `stable_from`), then the scene's stable
  range plays across the chapter until the next beat starts entering. Chapters 5 and 6 share the
  last scene (Tresen, phone lights up); the page end maps to the film end so the tail stands still.
- Piecewise-linear scroll → time keyframes, rebuilt on every ScrollTrigger refresh (one trigger
  per beat, `start`/`end` used as the scroll anchors). Same rAF lerp, seek gating and delta-gated
  writes as before. Film stays `position: fixed` behind everything, dim `DIM_MAX` unchanged.

**Mobile:** the four layout gates (≤720 px, portrait tablet, portrait coarse, short landscape)
no longer show the static hero; they scrub `film-mobile.mp4` with the mobile poster. Static
hero stays for reduced motion, Save-Data and no-JS; a failed video keeps the poster
(`tf--video-failed`). No autoplay, no audio, no new dependency, no external request.

**Removed:** `thread-film.mp4`, `thread-poster.jpg` (unreferenced). `thread-ending.jpg` stays,
it is the page-wide `thread-env` fallback world.

**Done means:** build, lint, `npm test` green; desktop 1440x900 and mobile 390x844 screenshots at
0/12/30/50/70/90 % scroll show the matching scene behind each chapter; mobile scrubs.
