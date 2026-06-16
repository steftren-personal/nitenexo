"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";

const SQUIGGLE_D =
  "M2 14 C 22 -6, 42 34, 62 14 C 82 -6, 102 34, 122 14 C 142 -6, 162 34, 182 14 C 202 -6, 222 34, 242 14 C 262 -6, 282 34, 302 14 C 322 -6, 342 34, 362 14 C 382 -6, 402 34, 422 14 C 442 -6, 462 34, 482 14 C 502 -6, 522 34, 542 14 C 562 -6, 582 34, 602 14 C 622 -6, 642 34, 662 14 C 682 -6, 702 34, 722 14 C 742 -6, 762 34, 782 14 C 802 -6, 822 34, 842 14 C 862 -6, 882 34, 902 14 C 922 -6, 942 34, 962 14 C 982 -6, 1002 34, 1022 14 C 1042 -6, 1062 34, 1082 14 C 1102 -6, 1122 34, 1150 14";

/**
 * Botwerk SquiggleDivider, animated — the lime squiggle draws itself in when
 * it scrolls into view (strokeDashoffset). Falls back to a fully-drawn line
 * when motion is reduced.
 */
export function SquiggleDraw({ style }: { style?: React.CSSProperties }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 90%" },
      });
    },
    { scope: wrapRef }
  );

  return (
    <div ref={wrapRef} style={style}>
      <svg
        viewBox="0 0 1152 28"
        fill="none"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "auto" }}
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d={SQUIGGLE_D}
          stroke="#c2ef4e"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
