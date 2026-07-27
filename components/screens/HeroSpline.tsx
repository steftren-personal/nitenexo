"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/components/motion/gsap";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { KineticHeading } from "@/components/motion/KineticHeading";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { Spotlight } from "@/components/ui/Spotlight";

/**
 * Hero — a realistic, transparent robot video (background removed → VP8-alpha
 * WebM, so it floats with no rectangle/cut-off). It flies in on load, waves +
 * points toward the headline, and zooms forward as you scroll. Text rises in;
 * a Spotlight sweeps across.
 */
export function HeroSpline() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(".hs-sub", { autoAlpha: 1, y: 0, duration: 0.5 }, 0.5)
        .to(".hs-cta", { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.25");

      // Robot flies in from the right on load.
      gsap.from(".hs-robot-vid", { xPercent: 60, autoAlpha: 0, scale: 0.72, duration: 1.1, ease: "power3.out", delay: 0.15 });

      // Zoom-in on scroll (the whole robot scales forward + drifts).
      gsap.to(".hs-robot", {
        scale: 1.22,
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="hero-wrap" style={{ position: "relative", overflow: "hidden" }}>
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-1/3" fill="#c2ef4e" />

      <div className="bw-container bw-section" style={{ position: "relative", zIndex: 2, padding: "48px var(--space-xl) var(--space-section)" }}>
        <div className="bw-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.02fr 0.98fr", gap: "var(--space-xl)", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Eyebrow polarity="dark">
              <ScrambleText text="Digitale Lösungen für Gastro & Clubs" />
            </Eyebrow>
            <KineticHeading
              trigger="load"
              style={{ font: "var(--type-display-hero)", fontSize: "clamp(40px, 6.2vw, 74px)", lineHeight: 1.05, margin: "16px 0 0", maxWidth: 620 }}
              tokens={[{ w: "Digitale" }, { w: "Assistenten," }, { w: "die" }, { w: "mitarbeiten", kw: true, after: "." }]}
            />
            <p className="hs-sub anim-fade-up" style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", maxWidth: 480, margin: "var(--space-xl) 0 0" }}>
              Dein Gast schreibt um 23:40 „Habt ihr morgen noch einen Tisch?&quot; — der
              NiteNexo-Assistent antwortet, nimmt die Reservierung auf und trägt sie ein, bevor du
              das Handy gesehen hast.
            </p>
            <div className="hs-cta anim-fade-up" style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-xl)", flexWrap: "wrap" }}>
              <Button variant="inverted" glow magnetic href="/kontakt">
                Projekt starten
              </Button>
              <Button variant="ghost-on-dark" magnetic href="/leistungen">
                Leistungen ansehen
              </Button>
            </div>
          </div>

          {/* Realistic transparent robot (VP8-alpha WebM). On desktop the
              traveling RobotGuide takes over and this is hidden via CSS. */}
          <div className="hs-robot hs-robot-inline" style={{ position: "relative", height: "min(64vh, 600px)", minHeight: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                width: "78%",
                aspectRatio: "1 / 1",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(194,239,78,0.18), rgba(122,63,240,0.16) 45%, transparent 70%)",
                filter: "blur(46px)",
              }}
            />
            <video
              className="hs-robot-vid"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              style={{ position: "relative", width: "100%", height: "100%", objectFit: "contain" }}
            >
              <source src="/assets/robot-hero.webm" type="video/webm" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
