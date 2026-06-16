import React from "react";

/**
 * Botwerk text input — light contact-form field. Cool hairline border,
 * inset focus shadow suggesting depth pressed inward.
 */
export function Input({
  className = "",
  style,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`bw-input ${className}`.trim()}
      style={{
        background: "var(--surface-canvas-light)",
        color: "var(--color-ink-deep)",
        font: "var(--type-body-md)",
        padding: "var(--space-sm) var(--space-md)",
        borderRadius: "var(--rounded-sm)",
        border: "1px solid var(--hairline-cool)",
        width: "100%",
        outline: "none",
        ...style,
      }}
      {...rest}
    />
  );
}
