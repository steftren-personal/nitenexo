import React from "react";

/**
 * Botwerk SquiggleDivider — the lime hand-drawn squiggle that replaces a
 * hairline above the footer. Full container width.
 */
export function SquiggleDivider({ style }: { style?: React.CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/assets/squiggle.svg" alt="" style={{ display: "block", width: "100%", height: "auto", ...style }} />
  );
}
