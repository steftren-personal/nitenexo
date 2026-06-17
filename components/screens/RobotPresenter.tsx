"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { MessageCircle, Bot, CalendarCheck } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ChatPreview } from "./ChatPreview";

const STEPS = [
  {
    icon: <MessageCircle strokeWidth={2} />,
    title: "Dein Gast schreibt",
    text: "„Habt ihr morgen einen Tisch für 4?“ — per WhatsApp, jederzeit, auch um 23:40.",
  },
  {
    icon: <Bot strokeWidth={2} />,
    title: "Der Assistent antwortet sofort",
    text: "Prüft Verfügbarkeit, schlägt Zeiten vor und bestätigt — in Sekunden, ohne dass dein Team tippt.",
  },
  {
    icon: <CalendarCheck strokeWidth={2} />,
    title: "Automatisch eingetragen",
    text: "Die Reservierung landet im System, die Bestätigung geht raus. Du schläfst weiter.",
  },
];

const list: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};
const stepV: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.16, 0.84, 0.44, 1] } },
};

/**
 * Foreground robot "presenter" — the robot plays in a framed portal on one
 * side while it "presents" three steps that animate in on the other side
 * (Framer Motion). Brings the robot into the foreground, doing + showing things.
 */
export function RobotPresenter() {
  return (
    <section className="bw-container bw-section" style={{ padding: "var(--space-section) var(--space-xl)" }}>
      <div className="bw-about-grid" style={{ display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: "var(--space-section)", alignItems: "center" }}>
        {/* Framed robot portal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1] }}
          style={{ position: "relative", display: "flex", justifyContent: "center" }}
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "-8%",
              background: "radial-gradient(circle, rgba(194,239,78,0.22), rgba(122,63,240,0.18) 45%, transparent 70%)",
              filter: "blur(40px)",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center", width: "100%" }}>
            <ChatPreview />
          </div>
        </motion.div>

        {/* Presented steps */}
        <div>
          <Eyebrow polarity="dark">So arbeitet dein Assistent</Eyebrow>
          <h2 style={{ font: "var(--type-display-large)", fontSize: "clamp(28px, 4vw, 44px)", margin: "var(--space-md) 0 var(--space-xl)", maxWidth: 460 }}>
            Er macht die Arbeit — du siehst nur das Ergebnis.
          </h2>

          <motion.div variants={list} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {STEPS.map((s, i) => (
              <motion.div key={i} variants={stepV} style={{ display: "flex", gap: "var(--space-lg)", alignItems: "flex-start" }}>
                <span
                  style={{
                    flex: "0 0 auto",
                    width: 48,
                    height: 48,
                    borderRadius: "var(--rounded-lg)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(122,63,240,0.18)",
                    border: "1px solid var(--hairline-violet)",
                    color: "var(--color-accent-lime)",
                  }}
                >
                  {s.icon}
                </span>
                <div>
                  <div style={{ font: "var(--type-heading-sm)", color: "var(--on-primary)", marginBottom: 4 }}>
                    <span style={{ color: "var(--color-accent-violet-mid)", marginRight: 8 }}>{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </div>
                  <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0, maxWidth: 460 }}>{s.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
