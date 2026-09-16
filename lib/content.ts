// Shared content data.

export type PricingPanel = {
  id: "website" | "ki" | "hosting";
  label: string;
  amount: string;
  caption: string;
  lead: string;
  factors: readonly string[];
  note?: string;
  /** The panel that carries the concrete figure gets the accent surface. */
  featured?: boolean;
};

/**
 * Pricing is quoted per project — there are no fixed packages. One panel per
 * service: Website-Creation (fixed quote after a short call), KI-Integration
 * (the honest setup range, with the chatbot setup as the example position)
 * and Hosting & Wartung (the monthly retainer agreed together with the quote).
 * Figures here are the existing ones; nothing is invented.
 */
export const PRICING: readonly PricingPanel[] = [
  {
    id: "website",
    label: "Website-Creation",
    amount: "€500 – €3.000",
    caption: "einmalig, Design und Umsetzung deiner Seite",
    lead: "Event-Seite, Landing-Page oder komplette Bar- und Club-Website: Der Umfang entscheidet, nicht die Größe deines Ladens. Eine Landing-Page liegt am unteren Ende.",
    factors: [
      "Wie viele Seiten und Inhalte du brauchst: eine Seite fürs Event oder mehrere für den ganzen Laden",
      "Ob Ticket-Shop, Reservierung, Speisekarte oder Galerie direkt eingebunden werden",
      "Ob wir Texte, Fotos und Suchmaschinen-Grundlagen mit aufbereiten",
      "DSGVO ohne Cookie-Banner ist immer drin",
    ],
    note: "In Tagen live. Den Festpreis bekommst du vor dem Start, nicht danach.",
  },
  {
    id: "ki",
    label: "KI-Integration",
    amount: "€300 – €4.000",
    caption: "einmalig, Beispiel: Einrichtung eines Chatbots",
    lead: "Wo du in dieser Spanne landest, entscheidet der Umfang. Ein Chatbot nur für FAQ und Öffnungszeiten liegt am unteren Ende.",
    factors: [
      "Wie viele Abläufe er können muss: FAQ, Reservierung, Gästeliste, Einlass",
      "Ob Kasse, Tischplan oder Kalender angebunden werden",
      "Wie viele Kanäle laufen sollen: WhatsApp allein oder zusätzlich Instagram und Website",
      "Andere Automatisierungen (Buchhaltung, Newsletter, Social Media) kalkulieren wir nach Umfang: Welche Systeme angebunden werden und ob die Abläufe dauerhaft mitlaufen",
    ],
    note: "Beispiel-Position: Die Spanne gilt für die Chatbot-Einrichtung. Für alles andere gibt es einen eigenen Festpreis nach Umfang.",
    featured: true,
  },
  {
    id: "hosting",
    label: "Hosting & Wartung",
    amount: "Monatliche Pauschale",
    caption: "passend zum Umfang von Website und KI",
    lead: "Damit alles im Betrieb bleibt und mitwächst, statt nach einem halben Jahr niemandem mehr zu gehören.",
    factors: [
      "Hosting, Updates und Sicherheit im Hintergrund",
      "Support, wenn im laufenden Betrieb etwas ist",
      "Bugfixes ohne Extrarechnung",
      "Weiterentwicklung: neue Abläufe, saisonale Aktionen, Anpassungen",
    ],
    note: "Den Betrag nennen wir gemeinsam mit dem Festpreis. Monatlich kündbar.",
  },
] as const;
