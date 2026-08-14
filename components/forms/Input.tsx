import React from "react";

/**
 * Botwerk text input — polarity-aware contact-form field. Hairline border,
 * focus treatment per surface (inset shadow on light, faint ring on dark).
 */
export function Input({
  polarity = "light",
  className = "",
  style,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { polarity?: "dark" | "light" }) {
  const dark = polarity === "dark";
  return (
    <input
      className={`bw-input ${dark ? "bw-input-dark" : ""} ${className}`.trim()}
      style={{
        background: dark ? "var(--surface-canvas-dark)" : "var(--surface-canvas-light)",
        color: dark ? "var(--on-primary)" : "var(--color-ink-deep)",
        font: "var(--type-body-md)",
        padding: "var(--space-sm) var(--space-md)",
        borderRadius: "var(--rounded-sm)",
        border: dark ? "1px solid var(--hairline-violet)" : "1px solid var(--hairline-cool)",
        width: "100%",
        outline: "none",
        ...style,
      }}
      {...rest}
    />
  );
}
