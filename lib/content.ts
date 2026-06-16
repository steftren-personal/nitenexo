// Shared content data. Prices are placeholders to be replaced with real values.

export type Tier = {
  name: string;
  price: string;
  cadence: string;
  featured?: boolean;
  features: string[];
  ctaLabel: string;
};

export const PRICING_TIERS: Tier[] = [
  {
    name: "Starter",
    price: "€49",
    cadence: "/ Monat",
    features: ["Einmaliges Setup ab €290", "1 WhatsApp-Bot", "FAQ & Öffnungszeiten", "Reservierungen", "E-Mail-Support"],
    ctaLabel: "Projekt starten",
  },
  {
    name: "Pro",
    price: "€99",
    cadence: "/ Monat",
    featured: true,
    features: ["Alles aus Starter", "Bestellungen", "Gästeliste & Einlass", "Website inklusive", "Priorisierter Support"],
    ctaLabel: "Projekt starten",
  },
  {
    name: "Studio",
    price: "Individuell",
    cadence: "",
    features: ["Mehrere Standorte", "Eigene Integrationen", "Automatisierungen nach Maß", "Dedizierter Ansprechpartner"],
    ctaLabel: "Gespräch buchen",
  },
];
