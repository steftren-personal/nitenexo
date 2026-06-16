"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/components/motion/gsap";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&/<>$_";

/**
 * Decode/scramble text — characters resolve from random glyphs to the final
 * string, left to right. Fits the brand's console aesthetic. Plays on load or
 * on scroll into view; shows the final text untouched under reduced motion.
 */
export function ScrambleText({
  text,
  trigger = "load",
  className = "",
  style,
}: {
  text: string;
  trigger?: "load" | "scroll";
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const run = () => {
        const total = text.length;
        const state = { p: 0 };
        gsap.to(state, {
          p: 1,
          duration: Math.min(1.4, 0.5 + total * 0.03),
          ease: "power2.out",
          onUpdate: () => {
            const revealed = Math.floor(state.p * total);
            let out = text.slice(0, revealed);
            for (let i = revealed; i < total; i++) {
              out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
            el.textContent = out;
          },
          onComplete: () => {
            el.textContent = text;
          },
        });
      };

      if (trigger === "scroll") {
        ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: run });
      } else {
        gsap.delayedCall(0.1, run);
      }
    },
    { scope: ref, dependencies: [text] }
  );

  return (
    <span ref={ref} className={className} style={style}>
      {text}
    </span>
  );
}
