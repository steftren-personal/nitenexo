import React from "react";

const CHEVRON =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='white' stroke-width='2' fill='none' stroke-linecap='round'/></svg>\")";

/**
 * Botwerk Select — the deep-violet dropdown used inside dark contact panels.
 * Reads as a deliberate brand surface, not a plain text input.
 */
export function Select({
  children,
  className = "",
  style,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={className}
      style={{
        background: "var(--color-accent-violet-deep)",
        color: "var(--on-primary)",
        font: "var(--type-body-md)",
        padding: "var(--space-sm) var(--space-lg)",
        borderRadius: "var(--rounded-md)",
        border: "none",
        appearance: "none",
        WebkitAppearance: "none",
        width: "100%",
        cursor: "pointer",
        backgroundImage: CHEVRON,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right var(--space-md) center",
        ...style,
      }}
      {...rest}
    >
      {children}
    </select>
  );
}
