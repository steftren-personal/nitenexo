"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "./gsap";

/** The only scroll-linked decoration: a fine line in the desktop margin. */
export function StoryThread() {
  const root = useRef<SVGSVGElement>(null);
  useGSAP(() => {
    const svg = root.current;
    const host = svg?.parentElement;
    if (!svg || !host) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1025px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(svg.querySelector("path"), { strokeDashoffset: 1000 }, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { id: "home-thread", trigger: host, start: "top 65%", end: "bottom 85%", scrub: true },
      });
      const observer = new ResizeObserver(() => ScrollTrigger.refresh());
      observer.observe(host);
      return () => observer.disconnect();
    });
    return () => mm.revert();
  }, { scope: root });
  return (
    <svg ref={root} className="story-thread" viewBox="0 0 2 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M1 0 V1000" pathLength={1000} strokeDasharray={1000} strokeDashoffset={0}
        fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
