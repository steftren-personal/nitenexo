"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/components/motion/gsap";
import { KeywordHighlight } from "@/components/ui/KeywordHighlight";

export type Token = { w: string; kw?: boolean; br?: boolean; after?: string };

/**
 * Kinetic headline — each word sits in an overflow mask and rises + rotates
 * into place (GSAP). `trigger="load"` plays on mount (hero); `trigger="scroll"`
 * plays when it scrolls into view (CTA). A token with `kw` becomes the lime
 * keyword chip; `br` forces a line break before the word.
 *
 * Initial hidden state lives in CSS (.kinetic .kw-word under html.gsap-enabled),
 * so reduced-motion / no-JS visitors see the finished headline with no flicker.
 */
export function KineticHeading({
  as = "h1",
  tokens,
  trigger = "load",
  className = "",
  style,
}: {
  as?: "h1" | "h2";
  tokens: Token[];
  trigger?: "load" | "scroll";
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const Tag = as;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const words = ref.current?.querySelectorAll(".kw-word");
      if (!words || !words.length) return;

      const anim = () =>
        gsap.fromTo(
          words,
          { yPercent: 118, rotate: 6, autoAlpha: 0 },
          { yPercent: 0, rotate: 0, autoAlpha: 1, duration: 0.85, ease: "power3.out", stagger: 0.05 }
        );

      if (trigger === "scroll") {
        ScrollTrigger.create({ trigger: ref.current, start: "top 80%", once: true, onEnter: anim });
      } else {
        gsap.delayedCall(0.15, anim);
      }
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={`kinetic ${className}`.trim()} style={style}>
      {tokens.map((t, i) => (
        <React.Fragment key={i}>
          {t.br && <br />}
          <span className="kw-mask">
            <span className="kw-word">
              {t.kw ? <KeywordHighlight>{t.w}</KeywordHighlight> : t.w}
              {t.after}
            </span>
          </span>{" "}
        </React.Fragment>
      ))}
    </Tag>
  );
}
