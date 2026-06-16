import React from "react";
import Link from "next/link";

type Variant = "primary" | "inverted" | "ghost-on-dark" | "violet-token";

type ButtonProps = {
  variant?: Variant;
  disabled?: boolean;
  glow?: boolean;
  magnetic?: boolean;
  href?: string;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Botwerk Button — the single strongest UI affordance on any surface.
 * Polarity-aware: filled near-black on light, filled white on dark.
 * Uppercase caps cadence with 0.2px tracking is baked in. Renders a Next
 * <Link> when `href` is provided, otherwise a <button>.
 */
export function Button({
  variant = "primary",
  disabled = false,
  glow = false,
  magnetic = false,
  href,
  className = "",
  children,
  style,
  ...rest
}: ButtonProps) {
  const magneticAttr = magnetic ? { "data-magnetic": "" } : {};
  const base: React.CSSProperties = {
    fontFamily: "var(--font-ui)",
    textTransform: "uppercase",
    letterSpacing: "var(--tracking-caps)",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--space-sm)",
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  const capStrong: React.CSSProperties = {
    font: "var(--type-button-cap)",
    letterSpacing: "var(--tracking-caps)",
  };
  const capLight: React.CSSProperties = {
    font: "var(--type-button-cap-light)",
    letterSpacing: "var(--tracking-caps)",
  };

  const variants: Record<Variant, React.CSSProperties> = {
    primary: {
      ...capStrong,
      background: "var(--color-primary)",
      color: "var(--on-primary)",
      padding: "var(--space-md) var(--space-lg)",
      borderRadius: "var(--rounded-md)",
      boxShadow: glow ? "var(--shadow-3)" : "none",
    },
    inverted: {
      ...capStrong,
      background: "var(--on-primary)",
      color: "var(--color-ink-deep)",
      padding: "var(--space-md) var(--space-lg)",
      borderRadius: "var(--rounded-md)",
      boxShadow: "var(--shadow-1)",
    },
    "ghost-on-dark": {
      ...capStrong,
      background: "var(--on-dark-faint)",
      color: "var(--on-primary)",
      padding: "var(--space-sm) var(--space-lg)",
      borderRadius: "var(--rounded-xl)",
      boxShadow: "none",
    },
    "violet-token": {
      ...capLight,
      background: "var(--color-accent-violet-mid)",
      color: "var(--on-primary)",
      padding: "var(--space-sm) var(--space-lg)",
      borderRadius: "var(--rounded-xl)",
      border: "1px solid var(--color-accent-violet-deep)",
      boxShadow: "none",
    },
  };

  const disabledStyle: React.CSSProperties = {
    ...capStrong,
    background: "var(--hairline-cloud)",
    color: "var(--on-dark-muted)",
    padding: "var(--space-md) var(--space-lg)",
    borderRadius: "var(--rounded-md)",
    boxShadow: "none",
  };

  const v = disabled ? disabledStyle : variants[variant];
  const cls = `bw-btn bw-btn-${variant} ${className}`.trim();
  const merged = { ...base, ...v, ...style };

  if (href && !disabled) {
    return (
      <Link href={href} className={cls} style={merged} {...magneticAttr}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={cls}
      style={merged}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      {...magneticAttr}
      {...rest}
    >
      {children}
    </button>
  );
}
