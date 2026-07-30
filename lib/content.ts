// Shared content data.

/**
 * Pricing is quoted per project — there are no fixed packages. The page shows
 * the honest range for the one-off setup plus what drives it, and states that
 * the monthly retainer is agreed together with the fixed quote.
 */
export const PRICING = {
  setup: {
    label: "Einmalig",
    amount: "€300 – €4.000",
    caption: "Einrichtung deines Assistenten",
    lead: "Wo du in dieser Spanne landest, entscheidet der Umfang — nicht die Größe deines Betriebs.",
    factors: [
      "Wie viele Abläufe er können muss — ein Assistent nur für FAQ und Öffnungszeiten liegt am unteren Ende",
      "Ob Kasse, Tischplan oder Kalender angebunden werden",
      "Ob eine Website oder Landingpage dazukommt",
      "Wie viele Kanäle laufen sollen — WhatsApp allein oder zusätzlich Instagram und Website",
    ],
  },
  retainer: {
    label: "Laufend",
    amount: "Monatliche Pauschale",
    caption: "passend zum Umfang deines Assistenten",
    lead: "Damit er im Betrieb bleibt und mitwächst, statt nach einem halben Jahr niemandem mehr zu gehören.",
    factors: [
      "Support, wenn im laufenden Betrieb etwas ist",
      "Bugfixes — ohne Extrarechnung",
      "Weiterentwicklung: neue Abläufe, saisonale Aktionen, Anpassungen",
      "Monitoring und Updates im Hintergrund",
    ],
    note: "Den Betrag nennen wir gemeinsam mit dem Festpreis für die Einrichtung.",
  },
} as const;
