"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Wine, Music, Coffee } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

type UseCase = {
  id: string;
  label: string;
  icon: React.ReactNode;
  headline: string;
  bullets: string[];
  example: string;
};

const CASES: UseCase[] = [
  {
    id: "restaurants",
    label: "Restaurants",
    icon: <Utensils size={16} strokeWidth={2} />,
    headline: "Volle Tische, weniger Telefon.",
    bullets: [
      "Tischreservierung mit Live-Verfügbarkeit",
      "Vorbestellungen & Menü-Fragen automatisch",
      "Bestätigung und Erinnerung per WhatsApp",
    ],
    example: "„Habt ihr Sonntag 19 Uhr einen Tisch für 6?“ — beantwortet und eingetragen, bevor der Kellner Zeit hätte.",
  },
  {
    id: "bars",
    label: "Bars",
    icon: <Wine size={16} strokeWidth={2} />,
    headline: "Mehr los — auch unter der Woche.",
    bullets: [
      "Happy-Hour & Events automatisch ankündigen",
      "Gästeliste und Reservierungen direkt im Chat",
      "Stammgäste mit Aktionen zurückholen",
    ],
    example: "„Was geht heute bei euch?“ — der Bot schickt Programm, Happy-Hour und reserviert den Tisch gleich mit.",
  },
  {
    id: "clubs",
    label: "Clubs",
    icon: <Music size={16} strokeWidth={2} />,
    headline: "Einlass, der sich selbst organisiert.",
    bullets: [
      "Digitale Gästeliste & Türsteher-Check",
      "Line-up und Themen-Nights pushen",
      "VIP-Tische & Bottle-Service anfragen",
    ],
    example: "„Setz mich auf die Gästeliste für Freitag.“ — erledigt, mit QR-Code für den Einlass.",
  },
  {
    id: "cafes",
    label: "Cafés",
    icon: <Coffee size={16} strokeWidth={2} />,
    headline: "Der Morgen-Rush ohne Schlange.",
    bullets: [
      "Vorbestellungen für die Stoßzeit",
      "Tagesangebote & Specials zeigen",
      "Stammgäste mit Treue-Aktionen binden",
    ],
    example: "„2 Flat White to go, in 10 Min.“ — steht fertig bereit, keine Warteschlange.",
  },
];

export function UseCaseTabs() {
  const [active, setActive] = useState(CASES[0].id);
  const current = CASES.find((c) => c.id === active) ?? CASES[0];

  return (
    <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-section) var(--space-xl)" }}>
      <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto var(--space-xxl)" }} data-reveal>
        <Eyebrow polarity="dark">Für deine Art von Laden</Eyebrow>
        <h2 style={{ font: "var(--type-display-large)", fontSize: "clamp(28px, 4vw, 44px)", margin: "var(--space-md) 0 0" }}>
          Gebaut für genau deinen Betrieb.
        </h2>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "var(--space-xs)",
          margin: "0 auto var(--space-xl)",
          padding: "var(--space-xs)",
          width: "fit-content",
          borderRadius: "var(--rounded-full)",
          background: "rgba(21,15,35,0.66)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--hairline-violet)",
        }}
      >
        {CASES.map((c) => {
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "var(--space-sm) var(--space-lg)",
                borderRadius: "var(--rounded-full)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                font: "var(--type-button-cap-light)",
                letterSpacing: "var(--tracking-caps)",
                textTransform: "uppercase",
                color: isActive ? "var(--color-ink-deep)" : "var(--on-dark-muted)",
                transition: "color 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="ucTabPill"
                  style={{ position: "absolute", inset: 0, borderRadius: "var(--rounded-full)", background: "var(--on-primary)", zIndex: 0 }}
                  transition={{ type: "spring", bounce: 0.18, duration: 0.55 }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
                {c.icon}
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.3 }}
          className="bw-about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-section)",
            alignItems: "center",
            background: "rgba(21,15,35,0.6)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--hairline-violet)",
            borderRadius: "var(--rounded-xxl)",
            padding: "var(--space-xxl)",
          }}
        >
          <div>
            <h3 style={{ font: "var(--type-display-large)", fontSize: "clamp(24px, 3vw, 34px)", margin: "0 0 var(--space-lg)", color: "var(--on-primary)" }}>
              {current.headline}
            </h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              {current.bullets.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.08 }}
                  style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start", font: "var(--type-body-md)", color: "var(--on-dark-muted)" }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-accent-lime)", marginTop: 8, flex: "0 0 auto" }} />
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              position: "relative",
              borderRadius: "var(--rounded-xl)",
              padding: "var(--space-xl)",
              background: "rgba(194,239,78,0.06)",
              border: "1px solid rgba(194,239,78,0.22)",
            }}
          >
            <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/sticker-bot.svg" alt="" width={40} height={40} style={{ flex: "0 0 auto" }} />
              <p style={{ font: "var(--type-body-md)", color: "var(--on-primary)", margin: 0, lineHeight: 1.6 }}>{current.example}</p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
