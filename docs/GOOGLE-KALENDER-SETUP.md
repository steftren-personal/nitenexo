# Google-Kalender-Anbindung einrichten

Diese Anleitung ist für Theo und Stefan. Du brauchst keine Programmiererfahrung, um sie durchzuarbeiten — nur Zugriff auf euer Google-Konto (`info@nitenexo.at`, das in einer Google-Workspace-Organisation liegt) und auf das Vercel-Projekt.

Diese Anleitung ist fummeliger als [EMAIL-SETUP.md](./EMAIL-SETUP.md). Rechnet mit 30–45 Minuten und lest Schritt 4 zweimal, bevor ihr loslegt — dort passieren die meisten Fehler.

> **Stand: Juli 2026.** Google baut die Cloud Console regelmäßig um, deshalb können einzelne Menüpunkte inzwischen anders heißen. Die beschriebenen Schritte und Einstellungen bleiben dieselben — sucht im Zweifel nach dem genannten Begriff, statt dem Klickpfad blind zu folgen. Wenn etwas gar nicht passt, sag Bescheid, dann prüfen wir es gemeinsam nach.

## 1. Was hier passiert

Die Website soll Termine direkt in euren Google Kalender (`info@nitenexo.at`) eintragen und dort auch nachsehen können, was schon belegt ist. Damit Google das erlaubt, braucht die Website eine Art Ausweis.

**Der naheliegende Weg geht bei euch nicht.** Normalerweise würde man dafür ein "Dienstkonto" (Service Account) mit einer Schlüsseldatei anlegen — ein technischer Nutzer, der sich mit einer heruntergeladenen Datei ausweist. Bei eurer Google-Workspace-Organisation ist genau das aber gesperrt: Google hat 2025 eine "Secure by Default"-Regel eingeführt (`iam.managed.disableServiceAccountKeyCreation`), die das Erstellen solcher Schlüsseldateien organisationsweit verbietet, weil sie ein beliebtes Ziel für Datendiebstahl sind. Wenn ihr das versucht, bekommt ihr die Meldung "Service account key creation is disabled" — das ist kein Fehler von euch, sondern eine bewusste Sicherheitsvorgabe eurer Organisation.

**Der Weg, der stattdessen funktioniert, heißt OAuth 2.0 mit Refresh-Token.** Grob gesagt: Ihr meldet euch **einmalig** mit `info@nitenexo.at` bei Google an und erlaubt der Website den Zugriff auf den Kalender. Google gibt der Website dafür einen dauerhaften "Nachschlüssel" (das Refresh-Token). Die Website tauscht diesen Nachschlüssel danach jedes Mal automatisch gegen einen kurzlebigen Zugriffs-Token ein, wenn sie etwas im Kalender lesen oder schreiben will. Ihr müsst dafür nichts mehr manuell tun — nur die Ersteinrichtung ist etwas aufwendiger.

## 2. Voraussetzungen

| Was | Wo |
|---|---|
| Ein Google Cloud Projekt | Falls noch keins existiert: auf [console.cloud.google.com](https://console.cloud.google.com) oben auf die Projektauswahl klicken → "Neues Projekt" |
| Die Google Calendar API aktiviert | Im Cloud-Projekt unter **APIs & Dienste → Bibliothek** nach "Google Calendar API" suchen und auf **Aktivieren** klicken |
| Zugriff auf `info@nitenexo.at` | Ihr müsst euch damit einloggen können |

## 3. OAuth-Client erstellen

### 3a. Consent Screen (Zustimmungsbildschirm) einrichten

Bevor ihr einen OAuth-Client anlegen könnt, verlangt Google, dass ihr einmal festlegt, wie sich eure App bei der Anmeldung vorstellt. Google hat diesen Bereich kürzlich umgebaut und nennt ihn jetzt "Google Auth Platform" (Unterpunkte: Branding, Zielgruppe/Audience, Datenzugriff, Clients). Die genaue Menüführung kann sich noch leicht ändern — sucht im linken Menü nach **"APIs & Dienste" → "OAuth-Zustimmungsbildschirm"** bzw. **"Google Auth Platform"**.

1. **App-Informationen**: Name eintragen (z. B. "NiteNexo Terminbuchung"), Support-E-Mail = `info@nitenexo.at`.
2. **Zielgruppe (Audience/User Type)**: Da `info@nitenexo.at` Teil einer Google-Workspace-Organisation ist, solltet ihr hier **"Intern" (Internal)** auswählen können, statt "Extern". Das ist wichtig und spart euch später Ärger:
   - Bei **Intern** kann nur euer eigenes Workspace-Konto die App autorisieren, es gibt **keine Google-Prüfung (Verification)**, **keine Begrenzung auf Testnutzer** und — das ist der entscheidende Punkt — **keine automatische 7-Tage-Ablaufregel** für das Refresh-Token.
   - Steht dort nur **"Extern"** zur Auswahl (z. B. weil die Workspace-Einstellungen das so vorgeben), müsst ihr im nächsten Schritt euch selbst (`info@nitenexo.at`) als **Testnutzer** eintragen. Wichtig: Solange der Veröffentlichungsstatus dann auf **"Testing"** steht, läuft das Refresh-Token nach spätestens **7 Tagen** ab und muss neu erzeugt werden (siehe Abschnitt 7). Um das zu vermeiden, müsste die App auf "In Produktion" (In production) gestellt werden — das verlangt bei sensiblen Scopes wie dem Kalenderzugriff aber ggf. eine Google-Prüfung. Für einen rein internen Anwendungsfall ist "Intern" fast immer die bessere Wahl, falls verfügbar.
3. Kontaktdaten (E-Mail für Benachrichtigungen) eintragen, speichern.

### 3b. OAuth-Client anlegen

1. Im linken Menü zu **APIs & Dienste → Zugangsdaten (Credentials)** gehen.
2. **Zugangsdaten erstellen → OAuth-Client-ID** wählen.
3. Als **Anwendungstyp "Web-Anwendung"** auswählen — **nicht** "Desktopanwendung". Grund: Nur der Typ "Web-Anwendung" erlaubt es, eine sogenannte Redirect-URI einzutragen, und genau die braucht ihr im nächsten Schritt für den OAuth Playground.
4. Bei **Autorisierte Weiterleitungs-URIs (Authorized redirect URIs)** folgende Zeile eintragen:
   ```
   https://developers.google.com/oauthplayground
   ```
   Achtet auf exakte Schreibweise (keine Leerzeichen, kein Schrägstrich am Ende) — Google vergleicht das auf den Buchstaben genau.
5. **Erstellen** klicken. Google zeigt euch jetzt **Client-ID** und **Client-Secret** an — beide sofort an einem sicheren Ort notieren (z. B. Passwort-Manager). Das Client-Secret wird später nicht mehr im Klartext angezeigt.

## 4. Refresh-Token über den OAuth Playground erzeugen

Das ist der Teil, bei dem am ehesten etwas schiefgeht. Geht Schritt für Schritt vor und überspringt nichts.

1. Öffnet [developers.google.com/oauthplayground](https://developers.google.com/oauthplayground) in einem Browser, in dem ihr **nicht** mit einem anderen Google-Konto eingeloggt seid (um Verwechslungen zu vermeiden).
2. Oben rechts auf das **Zahnrad-Symbol (Settings)** klicken.
3. Häkchen bei **"Use your own OAuth credentials"** setzen. Das ist wichtig: Ohne dieses Häkchen benutzt der Playground Googles eigene, gemeinsam genutzte Test-Zugangsdaten — damit laufen erzeugte Refresh-Tokens automatisch nach 24 Stunden ab, egal was ihr beim Consent Screen eingestellt habt.
4. In die Felder, die jetzt erscheinen, **eure eigene Client-ID** und **euer eigenes Client-Secret** aus Schritt 3b einfügen.
5. Das Einstellungsfenster schließen.
6. Links in der Liste **"Step 1: Select & authorize APIs"** nach **Calendar API v3** suchen und aufklappen.
7. Den Scope auswählen, der **Lesen und Schreiben** von Terminen erlaubt:
   ```
   https://www.googleapis.com/auth/calendar
   ```
   (Nicht `calendar.readonly` — der erlaubt nur Lesen. Der volle `calendar`-Scope erlaubt auch das Anlegen und Ändern von Terminen, was für die Terminbuchung gebraucht wird.)
8. Unten auf **"Authorize APIs"** klicken.
9. Ihr werdet zu Google weitergeleitet und sollt euch anmelden — **hier unbedingt mit `info@nitenexo.at` einloggen**, nicht mit einem privaten Konto. Der Kalender, der am Ende angebunden wird, ist der Kalender des Kontos, mit dem ihr euch jetzt anmeldet.
10. Google zeigt den Zustimmungsbildschirm mit dem Hinweis, dass "NiteNexo Terminbuchung" (oder wie ihr die App genannt habt) auf den Kalender zugreifen möchte. Zustimmen.
11. Ihr landet zurück im OAuth Playground bei **"Step 2: Exchange authorization code for tokens"**. Dort seht ihr bereits einen **Authorization Code**.
12. Auf **"Exchange authorization code for tokens"** klicken.
13. Jetzt erscheinen ein **Access Token** (kurzlebig, uninteressant für euch) und ein **Refresh Token** — das ist der Wert, den ihr braucht. Sofort kopieren und sicher notieren.
14. **Aufräumen (empfohlen):** Geht danach zurück in die Google Cloud Console zu eurem OAuth-Client (Schritt 3b) und entfernt die Playground-Redirect-URI wieder, falls ihr sie nicht dauerhaft für weitere Token-Erzeugungen offenlassen wollt. Für die Nutzung des bereits erzeugten Refresh-Tokens wird sie nicht mehr gebraucht.

Wenn ihr das Refresh-Token später verliert oder es ungültig wird, müsst ihr diesen ganzen Abschnitt 4 einfach erneut durchgehen — es gibt keinen Weg, ein bestehendes Refresh-Token nachträglich wieder anzuzeigen.

## 5. Werte eintragen

Genau wie beim E-Mail-Versand ([EMAIL-SETUP.md](./EMAIL-SETUP.md), Abschnitt 3) werden die Werte in Vercel eingetragen: Projekt öffnen → **Settings → Environment Variables**.

| Variable | Beispielwert | Was sie macht |
|---|---|---|
| `GOOGLE_CLIENT_ID` | `123456789-abc...apps.googleusercontent.com` | Der "Name" eurer Website gegenüber Google — identifiziert, welche App gerade Zugriff will |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-abcdefghijk...` | Das Passwort zu obiger Client-ID — beweist, dass es wirklich eure App ist, die anfragt |
| `GOOGLE_REFRESH_TOKEN` | `1//0abcdefghijklmnop...` | Der dauerhafte "Nachschlüssel" aus Schritt 4 — damit holt sich die Website bei Bedarf kurzlebige Zugriffs-Tokens, ohne dass sich jemand erneut manuell anmelden muss |
| `GOOGLE_CALENDAR_ID` | `info@nitenexo.at` | Welcher Kalender angebunden wird — bei einem normalen Google-Kalender ist das schlicht die E-Mail-Adresse des Kontos |

Nach dem Eintragen: **Speichern**, dann im Vercel-Dashboard unter **Deployments** beim letzten Deployment auf die drei Punkte klicken → **Redeploy**. Ohne Redeploy wirken neue Variablen nicht.

Wollt ihr das Ganze auch lokal auf eurem Rechner testen, tragt dieselben vier Variablen zusätzlich in `.env.local` ein (Datei anlegen, falls sie nicht existiert) und startet danach `npm run dev` neu. `.env.local` darf wie immer niemals in Git/GitHub landen.

## 6. Sicherheitshinweise

- `GOOGLE_CLIENT_SECRET` und `GOOGLE_REFRESH_TOKEN` sind so sensibel wie ein Passwort — wer beide hat, kann in eurem Namen Termine lesen und schreiben. Behandelt sie entsprechend:
  - Niemals ins Repository (Git/GitHub) committen.
  - Niemals per E-Mail, Chat oder Screenshot verschicken.
  - Nur in Vercels Environment Variables und in eurer lokalen `.env.local` speichern.
- **Zugriff wieder entziehen:** Falls ihr den Zugriff der Website auf den Kalender beenden wollt (z. B. bei einem Verdacht auf Missbrauch oder wenn ihr die Anbindung nicht mehr braucht), geht in das Google-Konto von `info@nitenexo.at` unter **Sicherheit → Meine Google-Daten verwalten** bzw. **Drittanbieter-Apps mit Kontozugriff** (auch erreichbar über [myaccount.google.com/connections](https://myaccount.google.com/connections)) und entfernt dort eure App aus der Liste. Damit wird das Refresh-Token sofort ungültig — anschließend müsst ihr Abschnitt 4 erneut durchlaufen, um ein neues zu erzeugen.
- Zusätzlich könnt ihr in der Google Cloud Console unter **APIs & Dienste → Zugangsdaten** den OAuth-Client löschen oder ein neues Client-Secret erzeugen, falls das Secret einmal versehentlich weitergegeben wurde.

## 7. Wann das Refresh-Token ungültig wird

Ein Refresh-Token gilt nicht für immer. Es wird ungültig, wenn eine der folgenden Situationen eintritt:

| Ursache | Was tun |
|---|---|
| Consent Screen steht auf Zielgruppe "Extern" **und** Veröffentlichungsstatus "Testing" | Google löscht das Token spätestens nach **7 Tagen** automatisch. Entweder Zielgruppe auf "Intern" umstellen (falls möglich, siehe Abschnitt 3a) oder Abschnitt 4 alle paar Tage wiederholen. Für einen produktiven Einsatz ist "Intern" klar zu bevorzugen |
| Passwort von `info@nitenexo.at` wurde geändert | Google kann in diesem Fall bestehende Refresh-Tokens für Google-Konten ungültig machen. Neu erzeugen: Abschnitt 4 wiederholen |
| Zugriff wurde manuell entzogen (siehe Abschnitt 6) | Erwartet — Abschnitt 4 wiederholen, um ein neues Token zu erzeugen |
| App/Nutzer hat den OAuth-Client 6 Monate lang nicht benutzt | Google verfällt inaktive Tokens nach etwa 6 Monaten Nichtnutzung. Abschnitt 4 wiederholen |
| Mehr als 50 Refresh-Tokens für dieselbe Kombination aus Nutzer und OAuth-Client wurden erzeugt | Das älteste Token wird automatisch ungültig, ohne Fehlermeldung. Passiert nur, wenn Abschnitt 4 sehr oft wiederholt wird — im Normalbetrieb kein Thema |
| Die Google-Workspace-Organisation entzieht der App zentral die Freigabe | Ein Administrator müsste den Zugriff über die Workspace-Admin-Konsole wieder freigeben |

In allen Fällen ist die Lösung dieselbe: Abschnitt 4 (OAuth Playground) erneut durchlaufen und das neue Refresh-Token in Vercel eintragen + Redeploy.

## 8. Fehlertabelle

| Fehlermeldung / Symptom | Wahrscheinliche Ursache | Lösung |
|---|---|---|
| "Service account key creation is disabled" | Ihr habt versucht, ein Dienstkonto mit Schlüsseldatei anzulegen — das ist in eurer Organisation gesperrt | Diese Anleitung (OAuth statt Dienstkonto) verwenden |
| `redirect_uri_mismatch` beim Anmelden im OAuth Playground | Die Redirect-URI im OAuth-Client stimmt nicht exakt mit `https://developers.google.com/oauthplayground` überein (z. B. Tippfehler oder überflüssiger Schrägstrich) | Redirect-URI in der Google Cloud Console unter Zugangsdaten prüfen und korrigieren |
| Refresh-Token funktioniert nach spätestens 24 Stunden nicht mehr | "Use your own OAuth credentials" war beim Erzeugen nicht angehakt — der Playground hat Googles geteilte Test-Zugangsdaten benutzt | Abschnitt 4 wiederholen, diesmal mit eigener Client-ID/Secret |
| Refresh-Token funktioniert nach spätestens 7 Tagen nicht mehr | Consent Screen steht auf "Extern" + "Testing" | Siehe Abschnitt 7 — auf "Intern" umstellen oder Token regelmäßig neu erzeugen |
| `invalid_grant` / "Token has been expired or revoked" | Eine der Ursachen aus Abschnitt 7 ist eingetreten | Abschnitt 4 wiederholen, neues Token eintragen, Redeploy |
| `invalid_client` | Client-ID oder Client-Secret in Vercel falsch abgetippt oder vertauscht | Beide Werte in der Google Cloud Console (Zugangsdaten) mit den Vercel-Variablen abgleichen |
| Termine erscheinen nicht im richtigen Kalender | `GOOGLE_CALENDAR_ID` falsch oder leer | Prüfen, dass dort exakt `info@nitenexo.at` steht |
| Website kann Termine lesen, aber nicht anlegen | Beim Autorisieren im Playground wurde `calendar.events.readonly` statt `calendar` gewählt | Abschnitt 4 wiederholen und diesmal den vollen `https://www.googleapis.com/auth/calendar`-Scope wählen |
| Änderungen wirken nicht | Nach dem Eintragen der Variablen kein Redeploy gemacht | In Vercel unter Deployments ein Redeploy auslösen |
