Du bist Felix, Builder bei NiteNexo Solutions. Projekt: /root/projects/nitenexo (Next.js App Router, Supabase-Auth, Tailwind; live auf https://nitenexo.at). Aufgabe: **Umpositionierung + „Clients Highlight"**. Diese Datei ist die von Stefan freigegebene Spec: `project_specs.md` um einen Abschnitt „Rebranding 09/2026" ergänzen und direkt bauen, NICHT auf eine Freigabe warten (CLAUDE.md-Regel 2 ist damit erfüllt). Vorher `git status`: eine Datei ist bereits geändert, unangetastet lassen und nicht mit-committen.

## 1. Neue Positionierung (Copy)
Bisher: „Digitale Assistenten für Gastro & Clubs", Chatbots im Zentrum. Neu: **Websites & KI-Integration** im Zentrum, Chatbots nur noch ein Baustein.
- Tagline überall (Meta-Title, Hero-Subline, Footer, OG): **„Websites & KI-Integration für Gastro, Events und Nachtleben"**
- Meta-Description: „NiteNexo Solutions aus Wien baut Websites, die verkaufen, und KI, die mitarbeitet: Event-Seiten, Bar- und Club-Websites, Automatisierung und Assistenten. DSGVO-tauglich, in Tagen live."
- Hero: Headline in der bestehenden Dramaturgie (NightFilm/Kapitel-Struktur beibehalten, nur Inhalte drehen): Erstes Versprechen = Website, die um 23:40 verkauft; zweites = KI, die Abläufe übernimmt; Chatbot als Beispiel innerhalb der KI-Zeile. CTA „Projekt starten" bleibt.
- Leistungen-Seite: neue Reihenfolge und Titel: 1) **Website-Creation** (Event-Seiten, Bar/Club-Websites, Landing-Pages; DSGVO ohne Cookie-Banner, Ticket-/Reservierungs-Anbindung, in Tagen live), 2) **KI-Integration** (Assistenten und Automatisierung: WhatsApp-/Reservierungs-Bots, Gästelisten, Buchhaltungs- und Social-Media-Workflows), 3) **Hosting & Wartung** (monatlich, Updates, Sicherheit, Support). „Beratung & Setup" in KI-Integration aufgehen lassen. Bestehende Texte zu Chatbots kürzen, nicht löschen.
- Preise-Seite: Struktur an die drei Leistungen anpassen, **bestehende Beträge übernehmen, keine neuen Preise erfinden**. Wenn ein Betrag nur für Chatbots gilt, als Beispiel-Position unter KI-Integration führen.
- Stimme: `/root/.hermes/skills/social-media/nitenexo-brand-voice/SKILL.md` lesen und einhalten (Du-Form, konkret, keine Em-Dashes im neuen Text, keine KI-Vokabeln).

## 2. Clients Highlight (Pflicht)
`components/screens/TestimonialsMarquee.tsx` enthält **erfundene Zitate** (Marko R., Lena S., Daniel K., Aylin T.). Das ist rechtlich nicht haltbar (UWG, keine Fake-Reviews): Komponente aus der Startseite entfernen und durch eine neue Section **„Projekte"** ersetzen, außerdem Unterseite `/projekte` mit denselben Daten in Langform. Daten in `lib/projects.ts` (typisiert), Bilder unter `public/projekte/`.

Drei Einträge, nur belegbare Fakten, keine erfundenen Zahlen:
1. **Teen Clubbing Wien** (teenclubbing.at, Website-Creation, Freigabe des Kunden liegt vor). Avatar `assets/clients/teenclubbing_profile.jpg`. Screenshot der Live-Seite selbst erzeugen (headless Chromium/Chrome auf https://teenclubbing.at, 1440x900 Hero + 390x844 mobil, als WebP nach public/projekte/). Fakten: Event-Website für ein Clubbing 12-15 Jahre; Brief bis Live in 4 Tagen; Ticket-Vorverkauf verlinkt; Eltern-Bereich und FAQ; kein Cookie-Banner, weil keine externen Requests und kein Tracking; Fonts und Bilder lokal; 129 kB First Load JS; Scroll-Choreografie mit Reduced-Motion-Fallback; Hosting und Wartung durch NiteNexo. Link: https://teenclubbing.at.
2. **Sorry Not Sorry Event** (Wiener Event-Reihe, Instagram @sorrynotsorry.event, KI-Integration/Chatbot). Avatar `assets/clients/sorrynotsorry_profile.jpg` (150 px, nur klein als runder Avatar bis 96 px nutzen). Fakten: WhatsApp-Gästelisten-Bot; Gäste schreiben „setzt mich auf die Gästeliste", der Bot nimmt auf und bestätigt; Einlass-Check am Handy statt Klemmbrett; regelbasiert, keine Gästedaten bei Dritt-KI; Einrichtung und Go-Live durch NiteNexo. **Keine Personennamen nennen.** Link: https://www.instagram.com/sorrynotsorry.event/.
3. **NiteNexo selbst: die KI-Firma** (KI-Integration). Fakten: Ein Mensch, fünf KI-Agenten (Nora Koordination, Felix Entwicklung, Mira Review, Clara Buchhaltung, Leon Marketing); die Agenten bauen Kundenseiten, führen die Buchhaltung, erstellen Social-Media-Entwürfe und laufen auf eigener Infrastruktur nur im privaten Netz; jede Freigabe bleibt beim Menschen. Visual: bestehendes Robot-Mark/Maskottchen, kein Foto. Link: /leistungen (Abschnitt KI-Integration).

Karten-Layout: Avatar, Kundenname, Branche/Kategorie-Badge (Website / KI-Integration), 1 Satz Ergebnis, 3 Fakten-Chips, Link. Auf der Startseite als 3er-Grid (mobil gestapelt), Section-Titel „Umgesetzt für", Subline „Echte Projekte, echte Zahlen." Auf /projekte je Projekt ein Block mit Screenshot (bei Sorry Not Sorry und NiteNexo stattdessen Chat-Mock bzw. Agenten-Grafik aus Bordmitteln). Reveal-Animationen im vorhandenen Stil, Reduced-Motion beachten.

## 3. Grenzen
- Auth, Konto, Termine, Admin, Supabase, Middleware, E-Mail: nicht anfassen.
- Keine neuen Dependencies. Keine externen Requests hinzufügen (Instagram-Avatar liegt lokal).
- Navigation: „Werkstatt" bleibt, „Projekte" als neuer Punkt zwischen Leistungen und Preise.
- Impressum/Datenschutz nur, wenn durch die Änderungen nötig (nicht nötig, wenn keine neuen Dienste).

## 4. Abgabe
`npm run build` + `npm run lint` grün; Screenshots /tmp/shots/nn-home.png (1440, Projekte-Section im Viewport), /tmp/shots/nn-projekte.png, /tmp/shots/nn-mobile.png (390, Hero). Commit `git -c user.name=Felix -c user.email=felix@nitenexo.at -m "feat(rebrand): Websites & KI-Integration als Kern, Projekte-Section + /projekte, Fake-Testimonials entfernt"`; `git push origin main` (Nora deployt). VERIFICATION REPORT (Build/Lint/Security/Overall) mit Liste der geänderten Copy-Stellen.
