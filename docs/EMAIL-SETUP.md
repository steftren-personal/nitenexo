# E-Mail-Versand einrichten

Diese Anleitung ist für Theo und Stefan. Du brauchst keine Programmiererfahrung, um sie durchzuarbeiten — nur Zugriff auf euer Google-Konto (`info@nitenexo.at`) und auf das Vercel-Projekt.

## 1. Was hier passiert

Wenn jemand auf der Website das Kontaktformular ausfüllt, schickt die Website die Nachricht nicht selbst — sie bittet den Mailserver von Google, das für sie zu tun. Damit Google das erlaubt, muss die Website sich mit einem eigenen "App-Passwort" ausweisen. Am Ende landet die Anfrage ganz normal in eurem Postfach (oder in mehreren Postfächern gleichzeitig, siehe [Der Verteiler](#5-der-verteiler)).

## 2. Schritt 1: App-Passwort in Google erstellen

Ein App-Passwort ist ein zweites, extra Passwort nur für dieses eine Programm (die Website). Der Vorteil: Wenn irgendwas komisch wirkt, könnt ihr genau dieses eine Passwort widerrufen, ohne euer echtes Google-Passwort zu ändern.

**Voraussetzung:** Die 2-Faktor-Authentifizierung (2FA) muss auf dem Google-Konto bereits aktiviert sein. Ohne 2FA bietet Google die Option "App-Passwörter" gar nicht an.

1. Bei `info@nitenexo.at` einloggen.
2. Im Google-Konto in den Bereich **Sicherheit** gehen.
3. Prüfen, ob **2-Faktor-Authentifizierung (Bestätigung in zwei Schritten)** aktiv ist. Falls nicht: zuerst aktivieren.
4. Nach **App-Passwörter** suchen (meist im Sicherheitsbereich zu finden, ggf. über die Google-Suche im Kontobereich "App-Passwörter" eingeben).
5. Ein neues App-Passwort anlegen, z. B. mit dem Namen "NiteNexo Website".
6. Google zeigt ein 16-stelliges Passwort an. Das ist euer `SMTP_PASS` — sofort kopieren, es wird danach nicht mehr angezeigt.

## 3. Schritt 2: Variablen in Vercel eintragen

1. Im Vercel-Dashboard das Projekt öffnen.
2. Zu **Settings → Environment Variables** gehen.
3. Folgende Variablen eintragen:

| Variable | Beispielwert | Was sie macht |
|---|---|---|
| `SMTP_HOST` | `smtp.gmail.com` | Adresse von Googles Mailserver |
| `SMTP_PORT` | `465` | Verbindungs-"Tür" zum Mailserver (465 = verschlüsselt) |
| `SMTP_USER` | `info@nitenexo.at` | Das Google-Konto, das die Mails verschickt |
| `SMTP_PASS` | `abcd efgh ijkl mnop` | Das App-Passwort aus Schritt 1 (nicht das normale Passwort!) |
| `CONTACT_TO` | `theogentsch@nitenexo.at,stefan@nitenexo.at` | Wohin die Anfragen ankommen — mehrere Adressen mit Komma trennen |

4. Speichern.
5. Wichtig: Neue oder geänderte Variablen wirken erst nach einem **Redeploy**. Im Vercel-Dashboard unter **Deployments** beim letzten Deployment auf die drei Punkte klicken → **Redeploy**.

## 4. Schritt 3: Lokal testen

Wenn ihr das Formular auf eurem eigenen Rechner (`localhost:3000`) testen wollt, braucht ihr dieselben Werte lokal:

1. Im Projektordner die Datei `.env.local` öffnen (falls sie nicht existiert, neu anlegen).
2. Dieselben fünf Variablen wie oben eintragen, z. B.:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=info@nitenexo.at
   SMTP_PASS=abcdefghijklmnop
   CONTACT_TO=theogentsch@nitenexo.at,stefan@nitenexo.at
   ```
3. Server neu starten: `npm run dev`.

**Wichtig:** `.env.local` darf **niemals** in Git/GitHub landen. Sie enthält euer echtes Passwort. Das Projekt ist so eingerichtet, dass diese Datei automatisch ignoriert wird — trotzdem: nie manuell hochladen oder teilen.

## 5. Der Verteiler

Manchmal sollen mehrere Personen die Kontaktanfragen bekommen, nicht nur eine Adresse. Dafür gibt es zwei Varianten:

**Variante A — direkt in `CONTACT_TO` eintragen:**
Einfach mehrere Adressen mit Komma trennen, z. B.:
```
CONTACT_TO=theogentsch@nitenexo.at,stefan@nitenexo.at
```
Einfach und schnell eingerichtet. Nachteil: Ändert sich das Team, muss jemand wieder in Vercel die Variable anpassen und neu deployen.

**Variante B — eine Google-Gruppe anlegen:**
Ihr legt in Google eine Gruppe an (z. B. `team@nitenexo.at`) und tragt die Mitglieder dort ein. In `CONTACT_TO` steht dann nur noch:
```
CONTACT_TO=team@nitenexo.at
```
Vorteil: Wer die Anfragen bekommt, verwaltet ihr bequem direkt in Google (Mitglieder hinzufügen/entfernen), ohne die Website-Einstellungen anzufassen.

**Welche Variante wählen?** Bei zwei, drei festen Adressen reicht Variante A völlig. Sobald sich das Team öfter ändert oder mehr als eine Handvoll Leute betroffen sind, lohnt sich Variante B.

Leerzeichen rund um die Kommas sind egal — `a@x.at, b@x.at` funktioniert genauso wie `a@x.at,b@x.at`.

## 5b. Bestätigungsmail an den Gast

Wer das Formular abschickt, bekommt automatisch eine kurze Bestätigung ("Danke für deine Anfrage, wir melden uns innerhalb eines Werktags"). Das passiert von selbst, ihr müsst nichts einrichten.

Falls ihr das nicht wollt, setzt zusätzlich diese Variable:

| Variable | Wert | Bedeutung |
|---|---|---|
| `CONTACT_AUTOREPLY` | `false` | Schaltet die Bestätigungsmail ab. Ohne diese Variable ist sie an. |

Wichtig: Wenn die Bestätigungsmail mal fehlschlägt, ist das kein Problem — eure Anfrage ist trotzdem angekommen und der Gast sieht weiterhin die Erfolgsmeldung.

## 6. Testen

1. Auf der Website die Kontaktseite (`/kontakt`) öffnen.
2. Das Formular mit Testdaten ausfüllen und absenden.
3. Im Erfolgsfall zeigt die Seite eine Bestätigung und im Postfach (bzw. allen Postfächern aus dem Verteiler) kommt innerhalb weniger Sekunden eine E-Mail mit dem Betreff "Neue Anfrage von ..." an.

## 7. Wenn es nicht klappt

| Problem | Wahrscheinliche Ursache | Lösung |
|---|---|---|
| Formular zeigt eine Fehlermeldung | App-Passwort falsch oder abgelaufen | Neues App-Passwort in Google erzeugen und in Vercel/`.env.local` ersetzen |
| Formular zeigt eine Fehlermeldung | 2FA wurde nachträglich deaktiviert | 2FA wieder aktivieren, App-Passwort neu erstellen |
| Formular zeigt eine Fehlermeldung | Leerzeichen im kopierten Passwort | Passwort ohne Leerzeichen eintragen (Google zeigt es oft in 4er-Gruppen an — das sind keine Pflicht-Leerzeichen) |
| Änderungen wirken nicht | Nach dem Eintragen der Variablen kein Redeploy gemacht | In Vercel unter Deployments ein Redeploy auslösen |
| Verbindung schlägt fehl | Falscher Port | `465` für verschlüsselte Verbindung verwenden (Standard bei Gmail) |
| Mail kommt nirgends an | `CONTACT_TO` leer oder falsch geschrieben | Adresse(n) in `CONTACT_TO` prüfen — bei mehreren müssen sie mit Komma getrennt sein |
| "Zu viele Anfragen" beim Testen | Schutz gegen Spam: max. 3 Anfragen pro Absender in 10 Minuten | Kurz warten und erneut testen — das ist gewolltes Verhalten |

## 7b. Login-Mails von Supabase (Registrierung & Passwort vergessen)

Neben der Kontaktformular-Mail oben gibt es noch zwei andere Mails, die nichts mit dem Kontaktformular zu tun haben: die Registrierungs-Bestätigung und das Passwort-zurücksetzen. Die verschickt nicht eure Website, sondern Supabase selbst — dafür müsst ihr die passenden Vorlagen einmal im Supabase-Dashboard hinterlegen.

### Zuerst: SMTP in Supabase aktivieren

Supabase verschickt diese Mails über einen eigenen Zugang — der ist getrennt von dem, was ihr in Vercel eingetragen habt. Im Supabase-Dashboard unter **Project Settings → Notifications → Emails** (Supabase benennt diesen Bereich gelegentlich um; sucht nach "SMTP") tragt ihr dieselben Werte ein wie in Vercel:

| Feld | Wert |
|---|---|
| Enable Custom SMTP | **einschalten** — ohne diesen Schalter werden alle Felder darunter ignoriert |
| Host | `smtp.gmail.com` — **`.com`, nicht `.at`**. Ein Tippfehler hier führt zu einem nichtssagenden "Error sending recovery email" |
| Port | `587` — hier bewusst ein anderer als in Vercel; Supabase arbeitet damit zuverlässiger |
| Username | `info@nitenexo.at` |
| Password | das App-Passwort |
| Sender email | `info@nitenexo.at` — muss mit dem Username übereinstimmen, Gmail verschickt sonst nicht |
| Sender name | `NiteNexo Solutions` |

Wenn der Schalter aus bleibt, versucht Supabase weiter über seinen eingebauten Test-Mailer zu senden. Der ist stark gedrosselt und bei wiederhergestellten Projekten oft gar nicht mehr aktiv — die Mail schlägt dann mit "Error sending recovery email" fehl, obwohl die eingetragenen Daten korrekt sind.

### Dann: Vorlagen einfügen

Im Supabase-Dashboard unter **Authentication → Email Templates** findet ihr mehrere Vorlagen (z. B. "Confirm signup", "Reset Password", "Magic Link" ...). Für NiteNexo sind aktuell zwei davon relevant:

- **Confirm signup** — die Mail, die jemand nach der Registrierung bekommt. Die gebrandete HTML-Vorlage dafür liegt im Repo unter `email-templates/supabase-email-bestaetigen.html`.
- **Reset Password** — die Mail für "Passwort vergessen". Die Vorlage dafür liegt unter `email-templates/supabase-passwort-zuruecksetzen.html`.

Zum Einrichten einfach den Inhalt der jeweiligen `.html`-Datei komplett kopieren und im Supabase-Dashboard in das passende Vorlagenfeld einfügen, dann speichern.

**Update (Fix "requested path is invalid"):** Beide Vorlagen wurden geändert — sie verlinken jetzt nicht mehr auf Supabases eigenen `{{ .ConfirmationURL }}`-Link, sondern direkt auf eine eigene Seite (`/auth/confirm`). Wenn ihr die Vorlagen schon einmal eingefügt hattet, **müsst ihr sie jetzt neu kopieren und erneut einfügen** — sonst bleibt der alte, fehleranfällige Link aktiv. Warum das nötig war, steht gleich im nächsten Abschnitt.

## 7c. Redirect-URLs in Supabase (wichtig für "Passwort vergessen")

Die Mail-Vorlagen sind jetzt eingerichtet — aber es gibt noch eine Stelle, die bei "Passwort vergessen" (und bei der Registrierungs-Bestätigung) garantiert Probleme macht, wenn man sie übersieht.

**Warum das wichtig ist:**
Der Link in der Passwort-Mail führt zurück auf eure Website, zu einer Seite, auf der man ein neues Passwort eingeben kann. Supabase lässt das nur für eine Adresse zu, die ihr vorher ausdrücklich als **Site URL** eingetragen habt — sonst weiß Supabase nicht, wohin der Link zeigen soll.

**Wo das eingestellt wird:**
Im Supabase-Dashboard im Bereich **Authentication**, dort nach **URL Configuration** suchen. Dort gibt es zwei Felder:

- **Site URL** — die Hauptadresse eurer Website. Genau dieser Wert wird jetzt direkt in den Mail-Link eingesetzt (siehe unten, "Zwei Ursachen").
- **Redirect URLs** — eine Liste erlaubter Ziel-Adressen (Platzhalter mit `*` werden unterstützt). Diese Liste bleibt für andere Supabase-Funktionen wichtig (z. B. falls später Login über Google/Apple dazukommt), betrifft die beiden Mail-Links unten aber nicht mehr.

**Was konkret eingetragen werden muss:**

| Umgebung | Site URL | Redirect URLs (hinzufügen) |
|---|---|---|
| Lokale Entwicklung | `http://localhost:3000` | `http://localhost:3000/**` |
| Live-Seite | `https://nitenexo.at` | `https://nitenexo.at/**` |

Supabase erlaubt nur **eine** Site URL gleichzeitig. Wollt ihr den Link lokal testen, muss die Site URL vorübergehend auf `http://localhost:3000` stehen — für den Live-Betrieb muss sie danach wieder auf `https://nitenexo.at` zurückgestellt werden.

### Zwei Ursachen für kaputte Links — und wie der Code das jetzt löst

Es gibt zwei unabhängige Gründe, warum der Klick auf den Mail-Link fehlschlagen kann. Beide treten unabhängig voneinander auf, auch wenn beide sich als Fehlerseite bemerkbar machen:

1. **Site URL falsch oder nicht gesetzt** (siehe Tabelle oben) — der Link zeigt dann auf die falsche Adresse oder auf gar nichts Sinnvolles.
2. **E-Mail-Sicherheitsprogramme "klicken" den Link automatisch vorab.** Viele Firmen- und Uni-Postfächer (z. B. Microsoft Defender "Safe Links") öffnen eingehende Links automatisch, um sie auf Schadsoftware zu prüfen — noch bevor der Mensch überhaupt reinschaut. Der Passwort- bzw. Bestätigungslink ist aber nur **einmal** gültig. Wenn das Sicherheitsprogramm ihn zuerst "verbraucht", bekommt der echte Nutzer beim eigenen Klick nur noch eine Fehlermeldung, obwohl er nichts falsch gemacht hat.

Der zweite Punkt war früher unabhängig vom Redirect-URL-Problem und konnte auch dann noch zuschlagen, wenn Site URL und Redirect URLs schon korrekt eingetragen waren. Der Code (`app/auth/confirm/route.ts`) und die beiden Vorlagen wurden deshalb umgebaut: Der Mail-Link zeigt jetzt direkt auf `{{ .SiteURL }}/auth/confirm?...` (unsere eigene Seite) statt auf Supabases eigene Verifizierungs-Seite. Das räumt Ursache 1 komplett aus dem Weg (der Link braucht keine Prüfung gegen die Redirect-URLs-Liste mehr) und macht das Verhalten bei Ursache 2 wenigstens vorhersehbar: Ein bereits verbrauchter Link zeigt jetzt zuverlässig die freundliche "Link nicht gültig"-Meldung auf `/passwort-neu` bzw. eine Fehlermeldung auf `/registrieren`, statt einer rohen, kryptischen Supabase-Fehlerseite. Verbrauchte Links lassen sich technisch nicht verhindern (das Sicherheitsprogramm entscheidet, nicht wir) — der Nutzer muss in dem Fall einfach einen neuen Link anfordern.

**Wichtig — die Umgebungsvariable `NEXT_PUBLIC_SITE_URL`:**
Diese Variable (in `.env.local` bzw. Vercel) steuert **nicht mehr**, wohin der Mail-Link zeigt — das erledigt jetzt allein die Supabase-Einstellung **Site URL** oben. `NEXT_PUBLIC_SITE_URL` wird im Code nur noch als harmloser Rückfall mitgeschickt, falls im Dashboard versehentlich doch noch die alte Vorlage hinterlegt ist. Trotzdem gilt weiterhin:

- In Vercel sollte `NEXT_PUBLIC_SITE_URL` auf `https://nitenexo.at` gesetzt sein (unter **Settings → Environment Variables**, wie in Abschnitt 3 beschrieben).
- Lokal gehört in `.env.local` die Zeile `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
- Nach dem Setzen oder Ändern dieser Variable in Vercel ist wie immer ein **Redeploy** nötig (siehe Abschnitt 3, Schritt 5).

**Wenn es nicht klappt:**

| Problem | Wahrscheinliche Ursache | Lösung |
|---|---|---|
| Klick auf den Mail-Link landet auf der Startseite statt auf dem Passwort-Formular | Die Vorlage im Dashboard ist noch die alte, ODER Site URL ist falsch gesetzt | Vorlage aus `email-templates/` neu einfügen (siehe oben); Site URL in Authentication → URL Configuration prüfen |
| Seite zeigt "requested path is invalid" oder eine ähnliche Fehlermeldung | Ältere Ursache: Redirect-URL fehlte oder war falsch geschrieben. Betrifft die beiden Mail-Links nach diesem Update nicht mehr, kann aber bei anderen Supabase-Funktionen (z. B. OAuth) weiterhin auftreten | Eintrag in Supabase exakt mit `https://` bzw. `http://` und `/**` am Ende prüfen |
| Link funktioniert beim ersten eigenen Test, aber ein echter Kunde meldet "Link ungültig" bei einem noch ganz frischen Link | Vermutlich hat das Sicherheitsprogramm des Kunden-Postfachs den Link automatisch vorab "angeklickt" und damit verbraucht (siehe oben, Ursache 2) | Kein Bug — Nutzer bittet einfach um einen neuen Link. Lässt sich nicht verhindern, ist aber jetzt wenigstens eine klare Fehlermeldung statt eines Absturzes |
| Mail-Link zeigt auf `localhost`, obwohl ein echter Kunde die Mail bekommen hat | Site URL in Supabase steht noch auf `localhost` | Site URL in Supabase auf `https://nitenexo.at` umstellen |
| Beim lokalen Testen zeigt der Link auf die falsche Adresse | Site URL in Supabase steht noch auf die Live-Adresse | Site URL in Supabase vorübergehend auf `http://localhost:3000` umstellen |

## 8. Anbieter wechseln

Die Website nutzt bewusst reines SMTP statt eines bestimmten Anbieter-Dienstes (wie z. B. eine Versand-API von SendGrid oder Postmark). Das war eine bewusste Entscheidung, um nicht von einem einzelnen Anbieter abhängig zu sein.

Das heißt: Wollt ihr später von Google auf einen anderen Mail-Anbieter wechseln, müsst ihr nur die vier SMTP-Variablen (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) mit den Werten des neuen Anbieters ersetzen. Am Code muss dafür nichts geändert werden.
