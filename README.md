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
- `/kontakt` — Kontakt (Demo-Formular, sendet keine Daten)
- `/impressum`, `/datenschutz` — Rechtliches (Österreich)

## Hinweise

- Das Kontaktformular ist eine Demo und überträgt/speichert keine Daten.
- Deployment: Vercel (Next.js).
