import React from "react";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** Shared layout for the legal pages (Impressum / Datenschutz). */
export function LegalLayout({
  eyebrow,
  title,
  intro,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar polarity="dark" />
      <div style={{ background: "var(--surface-canvas-dark)", color: "var(--on-primary)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, maxWidth: 820, width: "100%", margin: "0 auto", padding: "var(--space-xxl) var(--space-xl) var(--space-section)" }}>
          <Eyebrow polarity="dark">{eyebrow}</Eyebrow>
          <h1 style={{ font: "var(--type-heading-xl)", fontSize: "clamp(30px, 4.4vw, 44px)", margin: "var(--space-md) 0 var(--space-md)" }}>{title}</h1>
          {intro && <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: "0 0 var(--space-sm)", maxWidth: 620 }}>{intro}</p>}
          {updated && <p style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)", margin: 0 }}>Stand: {updated}</p>}
          <div style={{ marginTop: "var(--space-xxl)", display: "flex", flexDirection: "column", gap: "var(--space-xxl)" }}>{children}</div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export function LegalSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section>
      {title && <h2 style={{ font: "var(--type-heading-md)", margin: "0 0 var(--space-md)" }}>{title}</h2>}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", font: "var(--type-body-md)", lineHeight: 1.7, color: "var(--on-dark-muted)" }}>
        {children}
      </div>
    </section>
  );
}

/** Highlighted placeholder for details the owner still needs to fill in. */
export function PH({ children }: { children: React.ReactNode }) {
  return <mark style={{ background: "rgba(194,239,78,0.35)", color: "var(--color-ink-deep)", padding: "0 4px", borderRadius: 3 }}>{children}</mark>;
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: "flex", gap: "var(--space-md)", font: "var(--type-body-md)", lineHeight: 1.6 }}>
          <span aria-hidden="true" style={{ color: "var(--color-accent-violet)" }}>→</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export const legalLink: React.CSSProperties = { color: "var(--color-accent-lime)" };
