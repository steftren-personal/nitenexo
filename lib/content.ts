// Shared content data.

/**
 * Pricing is quoted per project — there are no fixed packages. The page shows
 * the honest range per offering (Chatbot / Website / KI-Integration) plus what
 * drives each, and states that the monthly retainer is agreed together with
 * the fixed quote.
 */
export const PRICING = {
  offers: [
    {
      label: "Chatbot",
      amount: "€300 – €4.000",
      caption: "Einrichtung deines Assistenten",
      lead: "Wo du in dieser Spanne landest, entscheidet der Umfang — nicht die Größe deines Betriebs.",
      factors: [
        "Wie viele Abläufe er können muss — ein Assistent nur für FAQ und Öffnungszeiten liegt am unteren Ende",
        "Ob Kasse, Tischplan oder Kalender angebunden werden",
        "Wie viele Kanäle laufen sollen — WhatsApp allein oder zusätzlich Instagram und Website",
      ],
    },
    {
      label: "Website",
      amount: "€500 – €3.000",
      caption: "Design und Umsetzung deiner Seite",
      lead: "Professionell gestaltet und gebaut: mobile-first, schnell, gepflegt ohne Agentur-Aufwand.",
      factors: [
        "Wie viele Seiten und Inhalte du brauchst: eine Landingpage liegt am unteren Ende",
        "Ob Reservierung, Speisekarte oder Galerie direkt eingebunden werden",
        "Ob wir Texte, Fotos und Suchmaschinen-Grundlagen mit aufbereiten",
      ],
    },
    {
      label: "KI-Integration",
      amount: "Nach Umfang",
      caption: "Automatismen in deinem Unternehmen",
      lead: "Von der automatischen Bestellliste bis zur Schicht-Erinnerung: Der Preis richtet sich danach, wie viele Abläufe die KI übernimmt.",
      factors: [
        "Welche Systeme angebunden werden: Kasse, Kalender, Newsletter, Buchhaltung",
        "Wie viele Abläufe automatisiert werden sollen",
        "Ob es einmalige Helfer sind oder Abläufe, die dauerhaft mitlaufen",
      ],
    },
  ],
  retainer: {
    label: "Laufend",
    amount: "Monatliche Pauschale",
    caption: "passend zum Umfang deines Projekts",
    lead: "Damit es im Betrieb bleibt und mitwächst, statt nach einem halben Jahr niemandem mehr zu gehören.",
    factors: [
      "Support, wenn im laufenden Betrieb etwas ist",
      "Bugfixes — ohne Extrarechnung",
      "Weiterentwicklung: neue Abläufe, saisonale Aktionen, Anpassungen",
      "Monitoring und Updates im Hintergrund",
    ],
    note: "Den Betrag nennen wir gemeinsam mit dem Festpreis für die Einrichtung.",
  },
} as const;
