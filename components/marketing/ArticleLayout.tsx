import React from "react";
import Link from "next/link";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Article } from "@/lib/werkstatt";

/** Section heading inside an article. */
export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        font: "var(--type-display-large)",
        fontSize: "clamp(23px, 3vw, 32px)",
        lineHeight: 1.2,
        margin: "var(--space-xxl) 0 var(--space-md)",
      }}
    >
      {children}
    </h2>
  );
}

/** Body paragraph. */
export function P({ children }: { children: React.ReactNode }) {
  return <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", margin: "0 0 var(--space-lg)" }}>{children}</p>;
}

/** Arrow list — matches the "Das ist drin" lists on /leistungen. */
export function UL({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: "none", margin: "0 0 var(--space-lg)", padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {items.map((t) => (
        <li key={t} style={{ display: "flex", gap: "var(--space-md)", font: "var(--type-body-lg)", color: "var(--on-primary)" }}>
          <span aria-hidden="true" style={{ color: "var(--color-accent-pink)", flexShrink: 0 }}>
            →
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

/** Pulled-out statement between sections. */
export function Pull({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        font: "var(--type-display-large)",
        fontSize: "clamp(20px, 2.6vw, 28px)",
        lineHeight: 1.3,
        color: "var(--on-primary)",
        borderLeft: "2px solid var(--color-accent-lime)",
        paddingLeft: "var(--space-lg)",
        margin: "var(--space-xxl) 0",
      }}
    >
      {children}
    </p>
  );
}

/**
 * Shared chrome for a Werkstatt article: still from the intro film as the
 * header, a readable prose column, and a closing CTA. Article bodies stay in
 * their own page files so the prose is easy to read and edit.
 */
export function ArticleLayout({ article, children }: { article: Article; children: React.ReactNode }) {
  return (
    <>
      <NavBar polarity="dark" />
      <div style={{ background: "var(--surface-canvas-dark)", color: "var(--on-primary)" }}>
        {/* Header with the film still */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: `url(${article.img}) center / cover no-repeat` }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: article.hue }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(10,7,18,0.94) 12%, rgba(10,7,18,0.55) 60%, rgba(10,7,18,0.35))" }} />
          <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", padding: "var(--space-section) var(--space-xl) var(--space-xxl)" }}>
            <Link href="/werkstatt" style={{ font: "var(--type-caption)", color: "var(--color-accent-lime)", textDecoration: "none", display: "inline-block", marginBottom: "var(--space-lg)" }}>
              ← Aus der Werkstatt
            </Link>
            <Badge variant="violet-tag">{article.tag}</Badge>
            <h1 style={{ font: "var(--type-display-hero)", fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.08, margin: "var(--space-md) 0 var(--space-md)" }}>
              {article.title}
            </h1>
            <span style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>{article.read} Lesezeit</span>
          </div>
        </div>

        {/* Prose */}
        <article style={{ maxWidth: 760, margin: "0 auto", padding: "var(--space-xxl) var(--space-xl) var(--space-section)" }}>{children}</article>

        {/* CTA */}
        <div style={{ background: "var(--surface-night)" }}>
          <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-section) var(--space-xl)", textAlign: "center" }}>
            <h2 style={{ font: "var(--type-display-large)", fontSize: "clamp(26px, 4vw, 40px)", margin: "0 auto var(--space-md)", maxWidth: 620 }}>
              Klingt nach deinem Laden?
            </h2>
            <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", margin: "0 auto var(--space-xl)", maxWidth: 480 }}>
              Erzähl uns kurz, wie es bei dir läuft. Wir sagen dir ehrlich, ob sich ein Assistent
              für dich rechnet.
            </p>
            <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "center", flexWrap: "wrap" }}>
              <Button variant="inverted" glow href="/kontakt">
                Projekt starten
              </Button>
              <Button variant="ghost-on-dark" href="/werkstatt">
                Mehr aus der Werkstatt
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
