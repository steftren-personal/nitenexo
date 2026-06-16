"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/components/motion/gsap";

/**
 * Fixed, full-viewport background video for the whole page. Plays a seamless
 * forward+reverse "boomerang" clip natively (GPU-smooth, no scrubbing, no
 * jarring loop restart, never frozen) so the robot stays alive behind the
 * entire page. A scroll-driven scrim keeps it bright in the hero and dims it
 * gently lower down for text legibility. Reduced motion → rests on poster.
 */
export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const v = videoRef.current;

    if (scrimRef.current) {
      gsap.fromTo(
        scrimRef.current,
        { opacity: 0.12 },
        {
          opacity: 0.5,
          ease: "none",
          scrollTrigger: { start: 0, end: () => window.innerHeight * 0.9, scrub: true, invalidateOnRefresh: true },
        }
      );
    }

    if (!v || prefersReducedMotion()) return;
    const play = () => v.play().catch(() => {});
    play();
    v.addEventListener("canplay", play, { once: true });
    ScrollTrigger.refresh();
    return () => v.removeEventListener("canplay", play);
  });

  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", background: "var(--surface-night)" }}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        poster="/assets/robot-hero.png"
        style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", filter: "brightness(0.72) saturate(1.1)" }}
      >
        <source src="/assets/robot-loop.mp4" type="video/mp4" />
      </video>
      {/* brand wash + scroll-driven readability scrim */}
      <div
        ref={scrimRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
          background:
            "radial-gradient(120% 90% at 50% 42%, rgba(21,15,35,0.1), rgba(21,15,35,0.92) 100%), linear-gradient(180deg, rgba(21,15,35,0.2), rgba(21,15,35,0.35))",
        }}
      />
    </div>
  );
}
