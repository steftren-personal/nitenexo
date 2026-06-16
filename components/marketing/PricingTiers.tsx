import React from "react";
import { PricingCard } from "./PricingCard";
import { PRICING_TIERS } from "@/lib/content";

/**
 * Three pricing tiers in a responsive grid (Pro = dark inverted / featured).
 * Shared by the home pricing section and the Preise page.
 */
export function PricingTiers() {
  return (
    <div
      className="bw-pricing-grid"
      style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)", alignItems: "stretch" }}
    >
      {PRICING_TIERS.map((t) => (
        <PricingCard
          key={t.name}
          name={t.name}
          price={t.price}
          cadence={t.cadence}
          featured={t.featured}
          features={t.features}
          ctaLabel={t.ctaLabel}
          reveal
          tilt
        />
      ))}
    </div>
  );
}
