Du bist Felix, Builder bei NiteNexo Solutions. Projekt: /root/projects/nitenexo (Next.js App Router, GSAP/ScrollTrigger in `components/motion/gsap`; live auf https://nitenexo.at). Aufgabe: **Neuer Film „Eine Nacht, ein Take" für die bestehende Scroll-Film-Mechanik.** Stefan will die Seite EXAKT wie heute (ThreadFilm-Scrubbing, Caption-Bänder, Button-Effekte, Chat-Nachrichten, Kanäle, Roboter) - nur der Film selbst wird gegen einen fotorealistischen KI-Film getauscht und die Kapitel laufen jetzt IN den Szenen des Films. NICHTS entfernen, keine Motion-Komponenten anfassen außer `components/screens/ThreadFilm.tsx` und dessen CSS-Block in `app/globals.css` (`.tf` …). Vorher `git status` (sauber) und `git log -3` lesen; Commit dfc0288 ist der Referenzstand.

## Neue Assets (liegen in `assets/film/`, nach `public/assets/film/` kopieren)
- `film-desktop.mp4` 1600x900, 24 fps, **27,25 s**, 7,3 MB, Keyframe alle 8 Frames (fürs Scrubbing gebaut, wie der alte `thread-film.mp4` mit 15 s)
- `film-mobile.mp4` 540x960 Hochkant, 2,3 MB (Center-Crop, gleiche Zeitachse)
- `film-poster.webp`, `film-poster-mobile.webp` (LCP-Poster)
- `scene-map.json`: 6 Szenen mit `start`/`end`/`stable_from`/`stable_to` in Sekunden. Reihenfolge = Seitenreihenfolge:
  1. `01_hero` 0-5,0 s: Bar von außen im Regen, Tür offen → **Hero** (Wortmarke + Claim + Buttons, Caption-Bänder wie heute)
  2. `05_morgen` 4,4-9,5 s: Stühle hochgestellt, Kasse, Kaffee → **Kapitel 1 · Der Morgen danach** (Reservierungs-Board)
  3. `06_faden` 8,9-13,9 s: Lime-Faden im Rauch → **Kapitel 2 · Über NiteNexo** (Terminal-Block, Roboter)
  4. `04_club` 13,3-18,4 s: Tanzfläche, Laser → **Kapitel 3 · Für deine Art von Laden** (Use-Case-Tabs)
  5. `03_website` 17,8-22,8 s: Tablet auf Restauranttisch → **Kapitel 4 · Was wir bauen** (Bento)
  6. `02_tresen` 22,2-27,25 s: Tresen 23:40, Handy leuchtet auf → **Kapitel 5 · So arbeitet dein Assistent** (Chat-Preview) + **Kapitel 6 · Dein Zug** (CTA); die letzten Sekunden stehen fast still, wie heute der Tail.

## Umsetzung (in ThreadFilm.tsx)
- `VIDEO_URL`/`POSTER_URL`/`VIDEO_BYTES` auf den neuen Film (Bytes exakt aus `stat`), Mobil-Quelle ergänzen: bei den bestehenden GATES (Portrait/≤720 px/coarse) statt Standbild jetzt `film-mobile.mp4` scrubben, Fallback bleibt Poster bei Reduced-Motion, Save-Data oder wenn das Video nicht lädt (bestehendes `tf--video-failed`-Verhalten).
- Heute: Hero-Region 800vh scrubbt 0 → T_SETTLE (13 s), Rest der Seite scrubbt den Tail ultra-langsam. **Neu:** Die Zeitachse wird über die GESAMTE Seite verteilt: Hero-Region scrubbt Szene 1 (0 → 5,0 s), danach ist jede Kapitel-Section (StoryBeat/Section in HomeScreen) an ihre Szene gebunden: beim Erreichen der Section läuft der Film in ihren `stable_from…stable_to`-Bereich, zwischen zwei Sections scrubbt die Überblendung (0,6 s xfade). Implementiere das mit einer Zeit-Map aus `scene-map.json` (statisch importiert) und ScrollTrigger-Progress pro Section (gleiches Delta-Gating/rAF-Muster wie heute). Der Film bleibt `position: fixed` hinter allem, Dim (`DIM_MAX`) wie heute.
- Caption-Bänder im Hero (5 Bänder, BANDS) behalten; Copy unverändert. Die Kapitel-Texte kommen weiter aus HomeScreen.
- Kein Autoplay, kein Ton, keine neuen Dependencies, keine externen Requests. `preload`-Strategie wie heute (Content-Length-Ring).

## Nicht anfassen
Buttons, Chat-Preview, Kanäle/Integrations-Strip, Roboter, StoryThread, splitChars, Cookie-Banner, Footer, Auth/Konto/Termine/Supabase.

## Abnahme
- Desktop 1440x900: Screenshots bei Scroll 0 %, 12 %, 30 %, 50 %, 70 %, 90 % nach `/tmp/shots/film-d-<n>.png`; je Kapitel muss die passende Szene im Hintergrund stehen (Bar-Außen im Hero, Tresen/Handy beim Assistenten).
- Mobil 390x844: dieselben Punkte `/tmp/shots/film-m-<n>.png`; Video scrubbt (nicht Standbild), Text lesbar über dem Dim.
- Alte Assets `thread-film.mp4`, `thread-poster.jpg`, `thread-ending.jpg` erst löschen, wenn nirgends referenziert.
- `npm run build` + `npm run lint` + Tests grün. Commit `git -c user.name=Felix -c user.email=felix@nitenexo.at -m "feat(film): fotorealistischer KI-Film 'Eine Nacht, ein Take' über die ganze Seite, Mobil scrubbt mit"`; `git pull --rebase origin main`; `git push origin main` (Deploy automatisch). **Zwischen-Commit sobald der Desktop-Scrub läuft**, dann Mobil. VERIFICATION REPORT.
