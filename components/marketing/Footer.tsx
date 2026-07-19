import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { SquiggleDraw } from "@/components/motion/SquiggleDraw";
import { CONTACT } from "@/lib/site";

/**
 * NiteNexo Footer — light-canvas footer topped by the lime squiggle divider.
 * Brand blurb + contact, three link columns, and a legal row.
 */
const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Leistungen",
    links: [
      { label: "Digitale Gäste-Tools", href: "/leistungen" },
      { label: "Website-Design", href: "/leistungen" },
      { label: "Digitale Assistenten", href: "/leistungen" },
      { label: "Beratung & Setup", href: "/leistungen" },
    ],
  },
  {
    title: "Unternehmen",
    links: [
      { label: "Preise", href: "/preise" },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutzerklärung", href: "/datenschutz" },
    ],
  },
];

const linkStyle: React.CSSProperties = {
  font: "var(--type-caption)",
  color: "var(--color-ink-deep)",
  textDecoration: "none",
};

export function Footer() {
  return (
    <footer style={{ background: "var(--surface-canvas-light)", color: "var(--color-ink-deep)" }}>
      <SquiggleDraw />
      <div
        style={{
          padding: "var(--space-section) var(--space-xl) var(--space-xxl)",
          maxWidth: "var(--container-max)",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-section)", justifyContent: "space-between" }}>
          <div style={{ maxWidth: 300, display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Logo polarity="light" />
            </Link>
            <p style={{ font: "var(--type-caption)", color: "var(--color-accent-violet-mid)", margin: 0 }}>
              Digitale Assistenten für Gastronomie, Bars und Clubs. Weniger tippen, kein Gast wartet.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              <a href={`mailto:${CONTACT.email}`} style={linkStyle}>
                {CONTACT.email}
              </a>
              <a href={CONTACT.phoneHref} style={linkStyle}>
                {CONTACT.phone}
              </a>
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--space-section)", flexWrap: "wrap" }}>
            {COLUMNS.map((col) => (
              <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                <div
                  style={{
                    font: "var(--type-micro-cap)",
                    textTransform: "uppercase",
                    letterSpacing: "var(--tracking-micro)",
                    color: "var(--color-accent-violet-mid)",
                  }}
                >
                  {col.title}
                </div>
                {col.links.map((l, i) => (
                  <Link key={i} href={l.href} className="bw-footer-link" style={linkStyle}>
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: "var(--space-section)",
            paddingTop: "var(--space-lg)",
            borderTop: "1px solid var(--hairline-cloud)",
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-md)",
            justifyContent: "space-between",
            font: "var(--type-caption)",
            color: "var(--color-accent-violet-mid)",
          }}
        >
          <span>© 2026 NiteNexo Solutions · Stefan Trendafilov · Wien</span>
          <span style={{ display: "flex", gap: "var(--space-lg)" }}>
            <Link href="/impressum" className="bw-footer-link" style={linkStyle}>
              Impressum
            </Link>
            <Link href="/datenschutz" className="bw-footer-link" style={linkStyle}>
              Datenschutz
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
