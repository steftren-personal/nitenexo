"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { MessageCircle, Check } from "lucide-react";

type Row = { t: string; name: string; p: string };

const ROWS: Row[] = [
  { t: "18:30", name: "Lena", p: "2 Pers." },
  { t: "19:00", name: "Marco", p: "4 Pers." },
  { t: "20:00", name: "Stefan", p: "4 Pers." },
  { t: "20:30", name: "Aylin", p: "6 Pers." },
  { t: "21:15", name: "David", p: "3 Pers." },
  { t: "22:00", name: "Nora", p: "5 Pers." },
];

const list: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.35 } },
};
const row: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 0.84, 0.44, 1] } },
};

/**
 * BookingBoard — the morning after the intro film: tonight's reservation list,
 * filled overnight by the assistant. The hero's proof piece (no mascot needed).
 */
export function BookingBoard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1], delay: 0.2 }}
      style={{
        position: "relative",
        background: "rgba(21,15,35,0.72)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid var(--hairline-violet)",
        borderRadius: "var(--rounded-xxl)",
        padding: "var(--space-lg)",
        width: "100%",
        maxWidth: 400,
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-md)",
          paddingBottom: "var(--space-md)",
          borderBottom: "1px solid var(--hairline-violet)",
        }}
      >
        <div style={{ lineHeight: 1.25 }}>
          <div style={{ font: "var(--type-body-strong)", color: "var(--on-primary)" }}>Reservierungen · heute</div>
          <div style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>über Nacht angenommen</div>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            font: "var(--type-button-cap-light)",
            letterSpacing: "var(--tracking-caps)",
            textTransform: "uppercase",
            color: "var(--color-accent-lime)",
            border: "1px solid rgba(194,239,78,0.4)",
            borderRadius: "var(--rounded-full)",
            padding: "6px 12px",
            whiteSpace: "nowrap",
          }}
        >
          <span className="bw-pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-accent-lime)", display: "inline-block" }} />
          Ausgebucht
        </span>
      </div>

      <motion.ul
        variants={list}
        initial="hidden"
        animate="visible"
        style={{ listStyle: "none", margin: 0, padding: "var(--space-md) 0 0", display: "flex", flexDirection: "column", gap: 10 }}
      >
        {ROWS.map((r) => (
          <motion.li
            key={r.t}
            variants={row}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-md)",
              padding: "10px var(--space-md)",
              borderRadius: "var(--rounded-lg)",
              background: "rgba(122,63,240,0.10)",
              border: "1px solid var(--hairline-violet)",
            }}
          >
            <span style={{ font: "var(--type-code)", fontSize: 13, color: "var(--color-accent-lime)", fontVariantNumeric: "tabular-nums" }}>{r.t}</span>
            <span style={{ font: "var(--type-body-strong)", color: "var(--on-primary)", flex: 1 }}>{r.name}</span>
            <span style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>{r.p}</span>
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "rgba(194,239,78,0.16)",
                color: "var(--color-accent-lime)",
              }}
            >
              <Check size={13} strokeWidth={3} />
            </span>
          </motion.li>
        ))}
      </motion.ul>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: "var(--space-md)",
          paddingTop: "var(--space-md)",
          borderTop: "1px solid var(--hairline-violet)",
          font: "var(--type-caption)",
          color: "var(--on-dark-muted)",
        }}
      >
        <MessageCircle size={14} strokeWidth={2.4} style={{ color: "var(--color-accent-lime)", flexShrink: 0 }} />
        Alle über WhatsApp angenommen — ohne einen einzigen Griff zum Handy.
      </div>
    </motion.div>
  );
}
