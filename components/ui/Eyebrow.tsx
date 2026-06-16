import React from "react";

/**
 * Botwerk Eyebrow — uppercase, caps-tracked label above section headings.
 * The console-prompt cadence of the brand.
 */
export function Eyebrow({
  polarity = "dark",
  children,
  className = "",
  style,
}: {
  polarity?: "dark" | "light";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        font: "var(--type-eyebrow)",
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-caps)",
        color: polarity === "dark" ? "var(--on-dark-muted)" : "var(--color-accent-violet)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
