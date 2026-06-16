import React from "react";

/**
 * Botwerk KeywordHighlight — the signature lime syntax-highlight chip that
 * wraps a single keyword inside a display headline. Glyph-level decoration,
 * not a standalone component. One per viewport.
 *
 * The lime fill is drawn as a sized background (see .bw-keyword in globals.css)
 * so the hero can "swipe" it in like a highlighter. Pass the `anim-keyword`
 * class to start it collapsed for that reveal.
 */
export function KeywordHighlight({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`bw-keyword ${className}`.trim()} style={style}>
      {children}
    </span>
  );
}
