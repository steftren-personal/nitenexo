import React from "react";

/**
 * NiteNexo Sticker — illustrated mascot, layered directly on the canvas with no
 * container and no shadow. Tilt and overlap section boundaries. Wrap it in a
 * `.bw-float` span where a gentle ambient drift is wanted (brand-sanctioned).
 */
export function Sticker({
  name = "bot",
  size = 120,
  tilt = -4,
  style,
}: {
  name?: "bot" | "plug";
  size?: number;
  tilt?: number;
  style?: React.CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/assets/sticker-${name}.svg`}
      alt=""
      width={size}
      height={size}
      style={{ display: "block", transform: `rotate(${tilt}deg)`, ...style }}
    />
  );
}
