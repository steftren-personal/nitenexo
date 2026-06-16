import React from "react";

/**
 * Botwerk CodeBlock — Monaco snippet on a night surface. Barely lifted from
 * the dark canvas. Highlight keywords with <strong>.
 */
export function CodeBlock({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <pre
      className={className}
      style={{
        background: "var(--surface-night)",
        color: "var(--on-primary)",
        font: "var(--type-code)",
        padding: "var(--space-lg)",
        borderRadius: "var(--rounded-md)",
        margin: 0,
        overflowX: "auto",
        ...style,
      }}
    >
      {children}
    </pre>
  );
}
