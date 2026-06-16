// Shared site configuration — nav links + contact details used across the site.

export type NavItem = { label: string; href: string };

export const NAV_ITEMS: NavItem[] = [
  { label: "Start", href: "/" },
  { label: "Leistungen", href: "/leistungen" },
  { label: "Preise", href: "/preise" },
  { label: "Kontakt", href: "/kontakt" },
];

export const CTA_HREF = "/kontakt";

export const CONTACT = {
  email: "stef.tren@gmail.com",
  phone: "+43 660 9390787",
  phoneHref: "tel:+436609390787",
  name: "Stefan Trendafilov",
  brand: "NiteNexo Solutions",
  street: "Schumanngasse 9/13",
  city: "1180 Wien, Österreich",
};
