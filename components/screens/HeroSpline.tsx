"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/components/motion/gsap";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { KineticHeading } from "@/components/motion/KineticHeading";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { Spotlight } from "@/components/ui/Spotlight";
import { BookingBoard } from "./BookingBoard";

/**
 * Hero — lands right after the intro film's morning shot: the headline on the
 * left, and on the right the payoff made concrete — tonight's reservation
 * board, filled overnight by the assistant. Text rises in; a Spotlight sweeps
 * across.
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
              <ScrambleText text="WhatsApp-Chatbots für Gastro & Clubs" />
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

          {/* Tonight's reservation board — the film's morning payoff, live */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
            <BookingBoard />
          </div>
        </div>
      </div>
    </div>
  );
}
