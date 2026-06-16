import React from "react";
import { Button } from "@/components/ui/Button";
import { CTA_HREF } from "@/lib/site";

/**
 * Botwerk PricingCard — standard light tier or dark inverted "featured" tier.
 * Featured uses the night surface inversion, never an accent border.
 */
export function PricingCard({
  name,
  price,
  cadence = "/ Monat",
  features = [],
  ctaLabel = "Projekt starten",
  href = CTA_HREF,
  featured = false,
  reveal = false,
  tilt = false,
}: {
  name: string;
  price: string;
  cadence?: string;
  features?: string[];
  ctaLabel?: string;
  href?: string;
  featured?: boolean;
  reveal?: boolean;
  tilt?: boolean;
}) {
  const dark = featured;
  return (
    <div
      {...(reveal ? { "data-reveal": "" } : {})}
      {...(tilt ? { "data-tilt": "" } : {})}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-lg)",
        background: dark ? "var(--surface-night)" : "var(--surface-canvas-light)",
        color: dark ? "var(--on-primary)" : "var(--color-ink-deep)",
        border: dark ? "1px solid var(--hairline-violet)" : "1px solid var(--hairline-cloud)",
        borderRadius: "var(--rounded-xl)",
        padding: "var(--space-xxl)",
      }}
    >
      <div style={{ font: "var(--type-heading-md)" }}>{name}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-sm)" }}>
        <span style={{ font: "var(--type-display-large)", fontSize: "44px" }}>{price}</span>
        <span style={{ font: "var(--type-caption)", color: dark ? "var(--on-dark-muted)" : "var(--color-accent-violet-mid)" }}>
          {cadence}
        </span>
      </div>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-md)",
          flex: 1,
        }}
      >
        {features.map((f) => (
          <li key={f} style={{ font: "var(--type-body-md)", display: "flex", gap: "var(--space-sm)" }}>
            <span style={{ color: "var(--color-accent-violet)" }} aria-hidden="true">
              →
            </span>
            <span style={{ color: dark ? "var(--on-dark-muted)" : "var(--ink)" }}>{f}</span>
          </li>
        ))}
      </ul>
      <Button variant={dark ? "inverted" : "primary"} href={href} style={{ width: "100%" }}>
        {ctaLabel}
      </Button>
    </div>
  );
}
