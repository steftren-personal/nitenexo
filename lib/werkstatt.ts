/**
 * Werkstatt articles — the single source of truth for the homepage cards, the
 * /werkstatt overview and each article's own metadata. Article bodies live in
 * their page files; only the card/teaser data belongs here.
 */
export type Article = {
  slug: string;
  tag: string;
  title: string;
  /** Card teaser + meta description. */
  excerpt: string;
  read: string;
  img: string;
  /** Tint laid over the still so the badge stays readable. */
  hue: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "chatbot-mehr-reservierungen",
    tag: "Guide",
    title: "Warum ein Chatbot mehr Reservierungen bringt",
    excerpt:
      "Gäste fragen dann, wenn sie Lust haben — nicht zu Bürozeiten. Wer sofort antwortet, gewinnt den Tisch.",
    read: "5 Min",
    img: "/assets/blog-night-1.webp",
    hue: "linear-gradient(135deg, rgba(66,32,130,0.55), rgba(122,63,240,0.35))",
  },
  {
    slug: "gaesteliste-am-einlass",
    tag: "Praxis",
    title: "Gästeliste am Einlass: vom Klemmbrett zum Chat",
    excerpt:
      "Warum die Liste auf Papier am Freitag um eins zum Nadelöhr wird — und wie sie im Chat funktioniert.",
    read: "4 Min",
    img: "/assets/blog-night-2.webp",
    hue: "linear-gradient(135deg, rgba(21,15,35,0.6), rgba(66,32,130,0.35))",
  },
  {
    slug: "bot-projekt-ablauf",
    tag: "Setup",
    title: "In Tagen live: so läuft ein Bot-Projekt ab",
    excerpt:
      "Von der ersten Nachricht bis zur Live-Schaltung — was wir von dir brauchen und was wir übernehmen.",
    read: "3 Min",
    img: "/assets/blog-night-3.webp",
    hue: "linear-gradient(135deg, rgba(90,45,176,0.45), rgba(250,127,170,0.3))",
  },
];

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
