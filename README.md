# NiteNexo Solutions — Website

Marketing-Website für **NiteNexo Solutions** (WhatsApp-Chatbots, Website-Design und
digitale Assistenten für Gastronomie, Bars und Clubs).

## Tech Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** + Botwerk Design-Tokens (CSS Custom Properties)
- **GSAP** (ScrollTrigger) für Animationen
- `next/font` (Space Grotesk, Rubik)
- Higgsfield-generiertes Roboter-Video als Hintergrund

## Lokal starten

```bash
npm install
npm run dev
```

Dann im Browser **http://localhost:3000** öffnen.

## Build

```bash
npm run build
npm run start
```

## Seiten

- `/` — Start (dunkel, animierter Roboter-Hintergrund)
- `/leistungen` — Leistungen
- `/preise` — Preise
- `/kontakt` — Kontakt (Formular, versendet per SMTP)
- `/impressum`, `/datenschutz` — Rechtliches (Österreich)

## E-Mail-Versand

Das Kontaktformular verschickt echte E-Mails über SMTP (z. B. Google Workspace). Damit das funktioniert, müssen `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` und `CONTACT_TO` gesetzt sein.

Eine vollständige, anfängertaugliche Anleitung (inkl. App-Passwort erstellen, Vercel-Setup und Verteiler mit mehreren Empfängern) gibt es in [`docs/EMAIL-SETUP.md`](./docs/EMAIL-SETUP.md).

## Hinweise

- Deployment: Vercel (Next.js).
