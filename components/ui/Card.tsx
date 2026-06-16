import React from "react";

type CardSurface = "light" | "dark" | "feature-dark" | "spotlight-violet";

/**
 * Botwerk Card — polarity-aware surface. Dark sections nest dark cards with a
 * violet hairline; light sections nest white cards with a cloud hairline.
 * No drop shadow on dark canvas; depth comes from texture, not shadow.
 */
export function Card({
  polarity = "light",
  variant = "default",
  reveal = false,
  tilt = false,
  children,
  className = "",
  style,
}: {
  polarity?: "dark" | "light";
  variant?: "default" | "feature-dark" | "spotlight-violet";
  reveal?: boolean;
  tilt?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const surfaces: Record<CardSurface, React.CSSProperties> = {
    light: {
      background: "var(--surface-canvas-light)",
      color: "var(--ink)",
      border: "1px solid var(--hairline-cloud)",
      borderRadius: "var(--rounded-xl)",
      boxShadow: "var(--shadow-2)",
    },
    dark: {
      background: "var(--surface-night)",
      color: "var(--on-primary)",
      border: "1px solid var(--hairline-violet)",
      borderRadius: "var(--rounded-xl)",
      boxShadow: "none",
    },
    "feature-dark": {
      background: "var(--color-ink-deep)",
      color: "var(--on-primary)",
      border: "1px solid var(--hairline-violet)",
      borderRadius: "var(--rounded-xxl)",
      boxShadow: "none",
    },
    "spotlight-violet": {
      background: "var(--color-accent-violet-deep)",
      color: "var(--on-primary)",
      border: "none",
      borderRadius: "var(--rounded-xxl)",
      boxShadow: "none",
    },
  };
  const key: CardSurface = variant === "default" ? polarity : variant;
  return (
    <div
      className={className}
      {...(reveal ? { "data-reveal": "" } : {})}
      {...(tilt ? { "data-tilt": "" } : {})}
      style={{ padding: "var(--space-xxl)", ...surfaces[key], ...style }}
    >
      {children}
    </div>
  );
}
