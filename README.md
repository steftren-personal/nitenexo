<div align="center">

# NiteNexo Solutions — Website

**Chatbots — spezialisiert auf WhatsApp —, Website-Design und digitale Assistenten**
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
Digital-Werkstatt, die Chatbots (spezialisiert auf WhatsApp, auf Wunsch auch Instagram oder
direkt auf der Website), Websites und maßgeschneiderte digitale Assistenten für die
Nachtgastronomie baut. Die Seite ist auf Deutsch (lockeres „Du") und enthält neben den
öffentlichen Seiten ein Kontaktformular sowie eine Terminbuchung für angemeldete Nutzer.

## Highlights

- **Premium-Design** im Botwerk Design-System (Violett-Mitternacht + Lime, zwei Flächen-Polaritäten)
- **Cinematischer Einstieg** „EINE NACHT" — ein kapitelweiser Nacht-Zeitraffer, der beim Scrollen von 21:00 bis 09:00 Uhr durchläuft
- **Bewegung im Detail** mit GSAP & ScrollTrigger — kinetische Headlines, Scroll-Reveals, Count-up-Stats, Parallax
- **Voll responsiv** und mit Rücksicht auf `prefers-reduced-motion`
- **Mit Backend** — Supabase (Auth + Postgres), API-Routen und Middleware; siehe [Konfiguration](#konfiguration)

## Tech Stack

| Bereich      | Technologie                                          |
| ------------ | ---------------------------------------------------- |
| Framework    | Next.js (App Router) + TypeScript                    |
| Styling      | Tailwind CSS + Botwerk Design-Tokens (CSS Variablen) |
| Animation    | GSAP (ScrollTrigger) via `@gsap/react`               |
| Schriften    | `next/font` — Space Grotesk (Display), Rubik (UI)    |
| Intro-Film   | Higgsfield-generierter Nacht-Zeitraffer (`public/assets/night-hero.mp4`) |
| Auth & DB    | Supabase (Auth + Postgres, RLS auf jeder Tabelle)    |
| Mailversand  | nodemailer über reines SMTP                          |
| Termine      | Google Kalender API (OAuth)                          |
| Deployment   | Vercel                                               |

## Schnellstart

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Umgebungsvariablen anlegen und ausfüllen
cp .env.local.example .env.local

# 3. Entwicklungsserver starten
npm run dev
```

Danach im Browser **[http://localhost:3000](http://localhost:3000)** öffnen.

Die öffentlichen Seiten laufen auch ohne ausgefüllte `.env.local`. Login, Terminbuchung
und Mailversand brauchen die passenden Werte — siehe [Konfiguration](#konfiguration).

### Produktiv-Build

```bash
npm run build   # Build erstellen
npm run start   # Build lokal starten
```

## Seitenübersicht

| Route                       | Inhalt                                                  |
| --------------------------- | ------------------------------------------------------- |
| `/`                         | Start — Intro-Film „EINE NACHT", danach die Landing-Page |
| `/leistungen`               | Leistungen im Detail                                     |
| `/preise`                   | Preismodell (individuell kalkuliert) + FAQ               |
| `/werkstatt`                | Artikelübersicht                                         |
| `/werkstatt/[slug]`         | Einzelartikel (derzeit drei)                             |
| `/kontakt`                  | Kontakt — Formular, versendet per SMTP                   |
| `/login`                    | Anmeldung (Supabase Auth)                                |
| `/registrieren`             | Registrierung inkl. E-Mail-Bestätigung                   |
| `/registrieren/bestaetigen` | Hinweisseite nach der Registrierung                      |
| `/passwort-vergessen`       | Zurücksetzen anfordern                                   |
| `/passwort-neu`             | Neues Passwort vergeben                                  |
| `/termine`                  | Terminbuchung (nur angemeldet)                           |
| `/konto`                    | Eigenes Konto (nur angemeldet)                           |
| `/admin/termine`            | Terminverwaltung (nur Admins)                            |
| `/impressum`                | Rechtliches (Österreich, § 5 ECG)                        |
| `/datenschutz`              | Datenschutzerklärung (DSGVO)                             |
| `/coming-soon`              | Platzhalter, nur aktiv bei `NEXT_PUBLIC_COMING_SOON=true` |

Geschützte Bereiche (`/termine`, `/konto`, `/admin`) sichert `middleware.ts` ab — ohne
Anmeldung geht es zurück auf `/login`, ohne Admin-Rechte zurück auf `/termine`.

## Projektstruktur

```
app/              Seiten (Routes), Layout & globale Styles
  └─ api/            Server-Endpunkte (Kontakt, Termine, Admin)
components/        Wiederverwendbare Bausteine
  ├─ ui/             Buttons, Cards, Badges …
  ├─ forms/          Formularelemente
  ├─ booking/        Slot-Auswahl, Terminlisten
  ├─ marketing/      NavBar, Footer, Preise, Artikel-Karten, CookieBanner …
  ├─ screens/        Seiten-Abschnitte (NightFilm, Hero, Bento, Tabs …)
  └─ motion/         GSAP-Animationslogik
lib/              Inhalts- & Konfigurationsdaten, Supabase-Clients, Mailversand,
                  Google-Kalender-Anbindung
middleware.ts     Coming-Soon-Weiche + Schutz von /termine, /konto, /admin
supabase/         Datenbank-Migrationen
docs/             Einrichtungs-Anleitungen (SMTP, Google Kalender)
email-templates/  HTML-Vorlagen für Transaktionsmails
public/           Bilder, Intro-Film & statische Dateien
Botwerk/          Design-System-Referenz (kein App-Code)
```

## Konfiguration

Alle Variablen stehen kommentiert in [`.env.local.example`](./.env.local.example). Kurz:

| Gruppe          | Variablen                                                                 | Wofür                              |
| --------------- | ------------------------------------------------------------------------- | ---------------------------------- |
| Supabase        | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAILS` | Login, Registrierung, Admin-Zugang |
| Allgemein       | `NEXT_PUBLIC_SITE_URL`                                                    | Links in E-Mails, Weiterleitungen  |
| SMTP            | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `CONTACT_AUTOREPLY` | Kontaktformular, Terminmails       |
| Google Kalender | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID` | Terminbuchung                      |
| Schalter        | `NEXT_PUBLIC_COMING_SOON`                                                 | Seite hinter Platzhalter legen     |

`SUPABASE_SERVICE_ROLE_KEY` umgeht sämtliche RLS-Regeln und darf ausschließlich
serverseitig verwendet werden. `.env.local` gehört nie ins Repository.

## E-Mail-Versand

Das Kontaktformular verschickt echte E-Mails über SMTP (z. B. Google Workspace). Damit das funktioniert, müssen `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` und `CONTACT_TO` gesetzt sein.

Eine vollständige, anfängertaugliche Anleitung (inkl. App-Passwort erstellen, Vercel-Setup und Verteiler mit mehreren Empfängern) gibt es in [`docs/EMAIL-SETUP.md`](./docs/EMAIL-SETUP.md).

## Google-Kalender

Die Terminbuchung soll an den Google Kalender von `info@nitenexo.at` angebunden werden. Der Zugang läuft über OAuth statt über ein Dienstkonto — Google Workspace sperrt das Erstellen von Dienstkonto-Schlüsseln per Organisationsrichtlinie.

Einrichtung Schritt für Schritt: [`docs/GOOGLE-KALENDER-SETUP.md`](./docs/GOOGLE-KALENDER-SETUP.md).

## Hinweise

- Deployment erfolgt über **Vercel** (Next.js).
- Mailversand läuft über reines SMTP — kein Anbieter-Lock-in, siehe [`docs/EMAIL-SETUP.md`](./docs/EMAIL-SETUP.md).

---

<div align="center">
<sub>Gebaut mit Next.js · GSAP · Tailwind CSS</sub>
</div>
