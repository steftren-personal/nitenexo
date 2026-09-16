import React from "react";
import { Button } from "@/components/ui/Button";
import { PRICING, type PricingPanel } from "@/lib/content";
import { CTA_HREF } from "@/lib/site";

/**
 * How pricing works — one panel per service instead of fixed packages, because
 * every project is quoted individually: Website-Creation (fixed quote),
 * KI-Integration (the honest setup range, chatbot as the example position)
 * and Hosting & Wartung (monthly retainer). Polarity-aware: dark on the
 * homepage, light where needed.
 */
export function PricingModel({ polarity = "dark" }: { polarity?: "dark" | "light" }) {
  const dark = polarity === "dark";
  const muted = dark ? "var(--on-dark-muted)" : "var(--color-accent-violet-mid)";
  const body = dark ? "var(--on-dark-muted)" : "var(--ink)";

  const panel = (data: PricingPanel) => {
    const accent = !!data.featured;
    return (
      <div
        key={data.id}
        data-reveal
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-md)",
          background: dark ? (accent ? "var(--surface-night)" : "transparent") : accent ? "var(--surface-canvas-light)" : "transparent",
          color: dark ? "var(--on-primary)" : "var(--color-ink-deep)",
          border: `1px solid ${dark ? "var(--hairline-violet)" : "var(--hairline-cloud)"}`,
          borderRadius: "var(--rounded-xxl)",
          padding: "var(--space-xxl)",
          boxShadow: !dark && accent ? "var(--shadow-2)" : "none",
        }}
      >
        <span
          style={{
            font: "var(--type-button-cap-light)",
            letterSpacing: "var(--tracking-caps)",
            textTransform: "uppercase",
            color: accent ? "var(--color-accent-lime)" : muted,
          }}
        >
          {data.label}
        </span>

        <div style={{ font: "var(--type-display-large)", fontSize: "clamp(26px, 3vw, 36px)", lineHeight: 1.1 }}>{data.amount}</div>
        <div style={{ font: "var(--type-body-md)", color: muted, marginTop: -4 }}>{data.caption}</div>

        <p style={{ font: "var(--type-body-md)", color: body, margin: "var(--space-sm) 0 0" }}>{data.lead}</p>

        <ul style={{ listStyle: "none", margin: "var(--space-sm) 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-md)", flex: 1 }}>
          {data.factors.map((f) => (
            <li key={f} style={{ display: "flex", gap: "var(--space-md)", font: "var(--type-body-md)", color: body }}>
              <span aria-hidden="true" style={{ color: "var(--color-accent-pink)", flexShrink: 0 }}>
                →
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {data.note && (
          <p style={{ font: "var(--type-caption)", color: muted, margin: "var(--space-md) 0 0", paddingTop: "var(--space-md)", borderTop: `1px solid ${dark ? "var(--hairline-violet)" : "var(--hairline-cloud)"}` }}>
            {data.note}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="bw-pricing-offers" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)", alignItems: "stretch" }}>
        {PRICING.map(panel)}
      </div>

      <div style={{ textAlign: "center", marginTop: "var(--space-xxl)" }}>
        <Button variant={dark ? "inverted" : "primary"} glow href={CTA_HREF}>
          Festpreis anfragen
        </Button>
        <p style={{ font: "var(--type-caption)", color: muted, margin: "var(--space-md) 0 0" }}>
          Nach einem kurzen Gespräch bekommst du einen Festpreis, keine Schätzung mit offenem Ende.
        </p>
      </div>
    </div>
  );
}
