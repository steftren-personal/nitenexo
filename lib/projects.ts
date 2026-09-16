// Reference projects — feeds the "Umgesetzt für" section on the homepage and
// the long-form /projekte page. Only facts that can be backed up; no invented
// numbers, no quotes, no person names.

export type ProjectCategory = "website" | "ki";

export type ProjectVisual =
  | { kind: "screenshots"; desktop: string; mobile: string; alt: string }
  | { kind: "chat" }
  | { kind: "agents" };

export type Project = {
  slug: string;
  name: string;
  /** Path under /public, or "mascot" for the NiteNexo robot mark. */
  avatar: string;
  category: ProjectCategory;
  /** What kind of business / who the client is, one short line. */
  kind: string;
  /** One sentence: what came out of it. */
  result: string;
  /** Three short fact chips for the card. */
  chips: [string, string, string];
  /** Long-form facts for /projekte. */
  facts: string[];
  /** One paragraph of context for /projekte. */
  intro: string;
  visual: ProjectVisual;
  link: { href: string; label: string; external: boolean };
};

export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  website: "Website",
  ki: "KI-Integration",
};

export const PROJECTS: Project[] = [
  {
    slug: "teen-clubbing-wien",
    name: "Teen Clubbing Wien",
    avatar: "/projekte/teenclubbing-avatar.webp",
    category: "website",
    kind: "Clubbing für 12 bis 15 Jahre, Wien",
    result: "Event-Website mit Ticket-Vorverkauf, vom Brief bis Live in 4 Tagen.",
    chips: ["4 Tage bis Live", "Kein Cookie-Banner", "129 kB First Load"],
    intro:
      "Ein Clubbing nur für 12- bis 15-Jährige braucht zwei Zielgruppen auf einer Seite: die Kids, die Tickets wollen, und die Eltern, die wissen wollen, was da läuft. Beides auf einer Seite, die am Handy in Sekunden lädt.",
    facts: [
      "Event-Website für ein Clubbing 12 bis 15 Jahre",
      "Brief bis Live in 4 Tagen",
      "Ticket-Vorverkauf direkt verlinkt",
      "Eltern-Bereich und FAQ",
      "Kein Cookie-Banner: keine externen Requests, kein Tracking",
      "Fonts und Bilder liegen lokal auf dem Server",
      "129 kB First Load JS",
      "Scroll-Choreografie mit Fallback für reduzierte Bewegung",
      "Hosting und Wartung durch NiteNexo",
    ],
    visual: {
      kind: "screenshots",
      desktop: "/projekte/teenclubbing-hero.webp",
      mobile: "/projekte/teenclubbing-mobile.webp",
      alt: "Startseite von teenclubbing.at mit Ticket-Button und Countdown bis zum Einlass",
    },
    link: { href: "https://teenclubbing.at", label: "teenclubbing.at", external: true },
  },
  {
    slug: "sorry-not-sorry-event",
    name: "Sorry Not Sorry Event",
    avatar: "/projekte/sorrynotsorry-avatar.webp",
    category: "ki",
    kind: "Event-Reihe, Wien",
    result: "Gästeliste über WhatsApp: Der Chatbot nimmt auf, bestätigt, und die Tür checkt am Handy.",
    chips: ["WhatsApp-Gästeliste", "Einlass am Handy", "Keine Daten bei Dritt-KI"],
    intro:
      "Vor jedem Event dasselbe: Dutzende Nachrichten mit „setzt mich auf die Gästeliste“, dazwischen Rückfragen, und am Einlass ein Klemmbrett. Der Chatbot übernimmt den Teil, der sich jedes Mal wiederholt.",
    facts: [
      "Gäste schreiben „setzt mich auf die Gästeliste“, der Chatbot nimmt auf und bestätigt",
      "Einlass-Check am Handy statt Klemmbrett",
      "Läuft regelbasiert: keine Gästedaten bei einer Dritt-KI",
      "Antwortet rund um die Uhr, auch am Event-Abend",
      "Einrichtung und Go-Live durch NiteNexo",
    ],
    visual: { kind: "chat" },
    link: { href: "https://www.instagram.com/sorrynotsorry.event/", label: "@sorrynotsorry.event", external: true },
  },
  {
    slug: "nitenexo",
    name: "NiteNexo Solutions",
    avatar: "mascot",
    category: "ki",
    kind: "Die KI-Firma, Wien",
    result: "Ein Mensch, fünf KI-Agenten: Sie bauen, prüfen, buchen und texten. Freigabe bleibt beim Menschen.",
    chips: ["1 Mensch, 5 Agenten", "Eigene Infrastruktur", "Jede Freigabe menschlich"],
    intro:
      "Wir nutzen selbst, was wir verkaufen. NiteNexo ist ein Ein-Personen-Betrieb, in dem fünf KI-Agenten mitarbeiten. Jeder hat eine Rolle, keiner entscheidet allein.",
    facts: [
      "Nora koordiniert, Felix entwickelt, Mira prüft, Clara führt die Buchhaltung, Leon macht Marketing",
      "Die Agenten bauen Kundenseiten, führen die Buchhaltung und erstellen Social-Media-Entwürfe",
      "Laufen auf eigener Infrastruktur, nur im privaten Netz",
      "Jede Freigabe bleibt beim Menschen",
    ],
    visual: { kind: "agents" },
    link: { href: "/leistungen#ki-integration", label: "So bauen wir das für dich", external: false },
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
