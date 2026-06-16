import React from "react";

/**
 * NiteNexo logo — bot-glyph mark + "NiteNexo" wordmark in Space Grotesk 700.
 * "Nexo" takes the accent colour (lime on dark, violet on light); the mark is
 * the same on both canvases.
 */
export function Logo({
  polarity = "dark",
  style,
}: {
  polarity?: "dark" | "light";
  style?: React.CSSProperties;
}) {
  const dark = polarity === "dark";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/logo-mark.svg" alt="" width={28} height={28} style={{ display: "block" }} />
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "22px",
          letterSpacing: "-0.5px",
          color: dark ? "var(--on-primary)" : "var(--color-ink-deep)",
        }}
      >
        Nite
        <span style={{ color: dark ? "var(--color-accent-lime)" : "var(--color-accent-violet)" }}>Nexo</span>
      </span>
    </span>
  );
}
