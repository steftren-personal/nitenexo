"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/components/motion/gsap";

/**
 * Route template — remounts on every navigation, so a short fade here gives a
 * gentle page transition without touching individual pages.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(ref.current, { autoAlpha: 0, duration: 0.4, ease: "power2.out" });
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
