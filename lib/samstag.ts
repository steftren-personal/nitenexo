// Inhalt der Signatur-Sektion »Dein Samstag«.
//
// Ehrlichkeits-Regel: Der Zaehler zaehlt exakt das, was auf dem Schirm steht —
// keine erfundene Statistik. Und zwei Zeilen bleiben bewusst offen: Es wird nicht
// behauptet, dass alles automatisch laeuft. Genau das macht den Rest glaubhaft.

export type Kanal = "website" | "ki" | "hosting" | "du";

export type Zeile = {
  /** Die Nachricht, wie sie wirklich ankommt. */
  text: string;
  /** Wer sie erledigt — "du" heisst: bleibt bei dir. */
  von: Kanal;
};

export type Betrieb = {
  id: string;
  label: string;
  /** Wie die Uhrzeit-Marke ueber der Spalte heisst. */
  abend: string;
  zeilen: Zeile[];
};

export const KANAL_LABEL: Record<Kanal, string> = {
  website: "Website",
  ki: "KI",
  hosting: "Hosting",
  du: "Du",
};

export const BETRIEBE: Betrieb[] = [
  {
    id: "bar",
    label: "Bar",
    abend: "Samstag, 19:40",
    zeilen: [
      { text: "Habts heute noch was frei?", von: "ki" },
      { text: "Bis wann habts offen?", von: "website" },
      { text: "Wo find ich eure Karte?", von: "website" },
      { text: "Kann man einen Tisch für 6 reservieren?", von: "ki" },
      { text: "Macht ihr auch Geburtstage?", von: "website" },
      { text: "Eure Seite lädt nicht", von: "hosting" },
      { text: "Kommt der Gin wieder rein, den ihr im Sommer hattet?", von: "du" },
      { text: "Servus, können wir wegen einer Kooperation reden?", von: "du" },
    ],
  },
  {
    id: "club",
    label: "Club",
    abend: "Samstag, 22:10",
    zeilen: [
      { text: "Setz mich bitte auf die Gästeliste", von: "ki" },
      { text: "Bin ich draufgekommen?", von: "ki" },
      { text: "Wer legt heute auf?", von: "website" },
      { text: "Was kostet der Eintritt?", von: "website" },
      { text: "Gibts noch Tickets?", von: "website" },
      { text: "Die Ticketseite hängt", von: "hosting" },
      { text: "Können wir für Freitag den ganzen Raum haben?", von: "du" },
      { text: "Wir würden gern bei euch spielen", von: "du" },
    ],
  },
  {
    id: "restaurant",
    label: "Restaurant",
    abend: "Samstag, 18:20",
    zeilen: [
      { text: "Habts heut noch einen Vierertisch?", von: "ki" },
      { text: "Bis wann gibts Küche?", von: "website" },
      { text: "Habt ihr was Vegetarisches?", von: "website" },
      { text: "Können wir auf 20:30 verschieben?", von: "ki" },
      { text: "Wo kann ich parken?", von: "website" },
      { text: "Die Speisekarte öffnet nicht", von: "hosting" },
      { text: "Meine Tochter hat eine Nussallergie, geht das?", von: "du" },
      { text: "Wir waren gestern da, danke für den schönen Abend", von: "du" },
    ],
  },
  {
    id: "event",
    label: "Event-Reihe",
    abend: "Samstag, 20:00",
    zeilen: [
      { text: "Wo krieg ich Tickets?", von: "website" },
      { text: "Ab wieviel Jahren?", von: "website" },
      { text: "Setzt ihr mich auf die Liste?", von: "ki" },
      { text: "Wann geht es los?", von: "website" },
      { text: "Gibts Abendkassa?", von: "ki" },
      { text: "Der Ticket-Link geht nicht", von: "hosting" },
      { text: "Dürfen wir für die Schule Karten reservieren?", von: "du" },
      { text: "Presseanfrage für Samstag", von: "du" },
    ],
  },
];
