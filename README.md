<div align="center">

# NiteNexo Solutions — Website

**WhatsApp-Chatbots, Website-Design und digitale Assistenten**
für Gastronomie, Bars und Clubs.

[![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=white)](https://gsap.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## Über das Projekt

Marketing-Website für **NiteNexo Solutions** (Stefan Trendafilov, Wien) — eine kleine
Digital-Werkstatt, die WhatsApp-Chatbots, Websites und maßgeschneiderte digitale Assistenten
für die Nachtgastronomie baut. Die Seite ist öffentlich, mehrsprachig auf Deutsch (lockeres „Du")
und enthält ein Demo-Kontaktformular (sendet bewusst keine Daten).

## Highlights

- **Premium-Design** im Botwerk Design-System (Violett-Mitternacht + Lime, zwei Flächen-Polaritäten)
- **Cinematische Animationen** mit GSAP & ScrollTrigger — kinetische Headlines, Scroll-Reveals, Count-up-Stats, Parallax
- **Voll responsiv** und mit Rücksicht auf `prefers-reduced-motion`
- **Kein Backend nötig** — statisch auf Vercel deploybar

## Tech Stack

| Bereich      | Technologie                                          |
| ------------ | ---------------------------------------------------- |
| Framework    | Next.js (App Router) + TypeScript                    |
| Styling      | Tailwind CSS + Botwerk Design-Tokens (CSS Variablen) |
| Animation    | GSAP (ScrollTrigger) via `@gsap/react`               |
| Schriften    | `next/font` — Space Grotesk (Display), Rubik (UI)    |
| Hintergrund  | Higgsfield-generiertes Roboter-Video                 |
| Deployment   | Vercel                                               |

## Schnellstart

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Entwicklungsserver starten
npm run dev
```

Danach im Browser **[http://localhost:3000](http://localhost:3000)** öffnen.

### Produktiv-Build

```bash
npm run build   # Build erstellen
npm run start   # Build lokal starten
```

## Seitenübersicht

| Route          | Inhalt                                                       |
| -------------- | ----------------------------------------------------------- |
| `/`            | Start — dunkel, animierter Roboter-Hintergrund              |
| `/leistungen`  | Leistungen im Detail                                        |
| `/preise`      | Preispakete + FAQ                                           |
| `/kontakt`     | Kontakt — Demo-Formular (überträgt keine Daten)             |
| `/impressum`   | Rechtliches (Österreich, § 5 ECG)                          |
| `/datenschutz` | Datenschutzerklärung (DSGVO)                                |

## Projektstruktur

```
app/          Seiten (Routes), Layout & globale Styles
components/    Wiederverwendbare Bausteine
  ├─ ui/         Buttons, Cards, Badges …
  ├─ forms/      Formularelemente
  ├─ marketing/  NavBar, Footer, Pricing, CookieBanner …
  ├─ screens/    Seiten-Abschnitte (Hero, Chat-Vorschau …)
  └─ motion/     GSAP-Animationslogik
lib/          Inhalts- & Konfigurationsdaten
public/       Bilder, Video & statische Dateien
```

## Hinweise

- Das Kontaktformular ist eine **Demo** und überträgt oder speichert keine Daten.
- Deployment erfolgt über **Vercel** (Next.js).

---

<div align="center">
<sub>Gebaut mit Next.js · GSAP · Tailwind CSS</sub>
</div>
