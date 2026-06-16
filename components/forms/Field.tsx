import React from "react";

/**
 * Botwerk form Field — a label + control wrapper. Label uses the body-md
 * UI role; polarity sets the label color.
 */
export function Field({
  label,
  htmlFor,
  polarity = "light",
  children,
  className = "",
  style,
}: {
  label: string;
  htmlFor?: string;
  polarity?: "dark" | "light";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={className}
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", ...style }}
    >
      <span
        style={{
          font: "var(--type-body-md)",
          color: polarity === "dark" ? "var(--on-dark-muted)" : "var(--color-ink-deep)",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
