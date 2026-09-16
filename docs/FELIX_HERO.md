Du bist Felix, Builder bei NiteNexo Solutions. Projekt: /root/projects/nitenexo (Next.js App Router, Tailwind, GSAP bereits in `components/motion/gsap`; live auf https://nitenexo.at). Aufgabe: **Neuer Hero + neue Seiten-Dramaturgie, Mobile zuerst.** Stefan gefällt die aktuelle Seite nicht: der 15-Sekunden-Scroll-Film „Der Faden" (`components/screens/ThreadFilm.tsx`, 800vh Scrub, Video fix hinter der ganzen Seite) und die daran hängende Choreografie sollen weg. Am Handy gibt es aktuell nur ein Standbild mit viel Leere. Das wird komplett neu.

## Skills zuerst lesen (Pflicht)
- `/root/.hermes/skills/creative/motion-design/SKILL.md` (Timing, Easing, Choreografie, Reduced-Motion)
- `/root/.hermes/skills/creative/genjutsu/SKILL.md` + `references/motion-principles.md` + `references/design-audit.md`
- `/root/.hermes/skills/creative/gsap/references/gsap-scrolltrigger.md` (GSAP ist im Projekt, weiter nutzen, sparsam)
- `/root/.hermes/skills/social-media/nitenexo-brand-voice/SKILL.md` (Copy bleibt in Ton; Texte inhaltlich NICHT ändern, nur wo die Struktur es zwingend verlangt)

## Neue Assets (liegen in `assets/hero-ki/`, nach `public/assets/hero/` kopieren; KI-generiert via Higgsfield für NiteNexo, keine Personen/Text)
- `hero-loop-1080.mp4` (1920x1080, 10 s Ping-Pong-Loop, 1,8 MB, ohne Ton): Desktop-Hero
- `hero-loop-540.mp4` (960x540, 488 kB): Tablet/Handy quer, schwache Verbindung
- `hero-loop-portrait.mp4` (540x960, 492 kB): **Handy hochkant, Pflicht** (kein Standbild mehr am Handy, außer bei Reduced-Motion / Save-Data)
- `hero-poster.webp`, `hero-poster-portrait.webp`: Poster (LCP-Element, sofort sichtbar)
- `bar-night-1920.webp` / `bar-night-960.webp`: Stimmungsbild für Kapitel 1 („Der Morgen danach") oder die Gastro-Section, nicht im Hero.
Motiv des Loops: lime-grüner Lichtfaden mit leuchtenden Knoten in violettem Rauch, sehr ruhig. Er ist die Fortsetzung des „Faden"-Gedankens, aber als **stiller Hintergrund**, nicht als Scroll-Film.

## Hero neu (Desktop und Mobil)
- Vollflächiger `<video autoplay muted loop playsinline>` mit `<source media>`-Auswahl (portrait ≤ 720px → portrait-Loop; ≤ 1024 → 540; sonst 1080), Poster als `poster`, Video erst nach Poster laden (`preload="metadata"`, Autoplay nach `canplay`). Bei `prefers-reduced-motion` oder `navigator.connection.saveData`: nur Poster.
- Darüber ein dunkler Verlauf (unten dichter), Headline in der bestehenden Kinetic-Typo: Zeile 1 „Websites, die um 23:40 verkaufen." Zeile 2 „KI, die mitarbeitet." (Reveal per Zeile, 600 ms, Stagger 120 ms, ease-out), Subline = Tagline, zwei Buttons (Projekt starten / Projekte ansehen), darunter drei Vertrauens-Chips (Wien · DSGVO ohne Cookie-Banner · in Tagen live). Hero-Höhe 100svh, Inhalt in den unteren 60 % ausgerichtet, damit das Motiv oben atmet.
- Handy (390 px): Headline max. 2 Zeilen à ≤ 3 Wörter pro Zeile in ~40 px, Buttons gestapelt volle Breite, Chips als horizontal scrollbare Reihe, nichts unter dem Fold verstecken, Cookie-Banner (falls vorhanden) als kompaktes Bottom-Sheet mit 1 Zeile Text + 2 Buttons.

## Seite darunter
- `ThreadFilm` und alles, was den Film scrubbt (Band-Map, GATES, Fixed-Dim), entfernen. Die Kapitel (StoryBeat 1-3, ServicesBento, UseCaseTabs, WhyAccordion, ProjectsSection, Preise, Blog, CTA) bleiben inhaltlich, bekommen aber eine ruhige Choreografie: Section-Reveal (Fade + 16 px Slide, Stagger 80 ms bei Karten), Kapitel-Kicker mit feiner Lime-Linie, die sich beim Reveal zeichnet (scaleX), ein durchgehender feiner „Faden" als SVG-Linie am linken Rand (Desktop), die sich mit dem Scroll zeichnet (stroke-dashoffset per ScrollTrigger scrub) — das ist der einzige Scroll-gebundene Effekt.
- StoryBeats: kein Full-Viewport-Zwang mehr (max. 70svh), Bild `bar-night` in Kapitel 1 als Hintergrund mit dunklem Overlay.
- Keine Parallax-Videos, kein fixiertes Video außerhalb des Heros.

## Mobile-Abnahme (Pflicht, jede Section)
Bei 390x844 und 430x932 prüfen: Hero, Kapitel 1-3, Bento, Tabs, Accordion, Projekte, Preise, Blog, CTA, Footer. Keine horizontale Scrollleiste, Tap-Ziele ≥ 44 px, Text ≥ 16 px, keine leeren Viewports (jede Section unter 100svh Höhe an Leerraum), Bilder mit `sizes`. Screenshots je Section nach `/tmp/shots/nn2-m-<section>.png` und Desktop `/tmp/shots/nn2-d-hero.png`, `/tmp/shots/nn2-d-mid.png`.

## Regeln
- Performance: Hero-Video darf LCP nicht blockieren (Poster ist LCP). First Load JS nicht größer als heute (Build-Ausgabe vorher/nachher in den Report). Nur transform/opacity animieren.
- Auth, Konto, Termine, Admin, Supabase, Middleware, E-Mail nicht anfassen. Keine neuen Dependencies. Keine externen Requests.
- Reduced-Motion: alle Reveals sofort sichtbar, Faden-Linie statisch, Video aus.
- Die alten Assets (`thread-film.mp4`, `night-hero*.mp4`, Poster) nur löschen, wenn nirgends mehr referenziert.

## Abgabe
`npm run build` + `npm run lint` grün, bestehende Tests grün; Genjutsu design-audit abhaken; Commit `git -c user.name=Felix -c user.email=felix@nitenexo.at -m "feat(hero): ruhiger KI-Loop-Hero statt Scroll-Film, neue Section-Choreografie, Mobile-first"`; `git pull --rebase origin main` vor dem Push; `git push origin main` (Deploy läuft automatisch). VERIFICATION REPORT + Bundle-Delta + Liste der geprüften Mobile-Sections.
