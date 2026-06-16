import React from "react";

type BadgeVariant = "neutral-dark" | "violet-tag" | "micro";

/**
 * Botwerk Badge / pill. Neutral-dark status pill or a violet tag chip.
 * Lime is never used as a badge background.
 */
export function Badge({
  variant = "neutral-dark",
  children,
  style,
}: {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const variants: Record<BadgeVariant, React.CSSProperties> = {
    "neutral-dark": {
      background: "var(--surface-night)",
      color: "var(--on-primary)",
      font: "var(--type-caption)",
      padding: "var(--space-xs) var(--space-sm)",
      borderRadius: "var(--rounded-xs)",
    },
    "violet-tag": {
      background: "var(--color-accent-violet-mid)",
      color: "var(--on-primary)",
      font: "var(--type-button-cap-light)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      padding: "var(--space-xs) var(--space-md)",
      borderRadius: "var(--rounded-xl)",
      border: "1px solid var(--color-accent-violet-deep)",
    },
    micro: {
      background: "transparent",
      color: "var(--on-dark-muted)",
      font: "var(--type-micro-cap)",
      letterSpacing: "var(--tracking-micro)",
      textTransform: "uppercase",
      padding: 0,
      borderRadius: 0,
    },
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", ...variants[variant], ...style }}>
      {children}
    </span>
  );
}
