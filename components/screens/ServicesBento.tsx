"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Globe, Bot, Server, MessageCircle, Workflow, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Service = {
  tag: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  featured?: boolean;
};

const SERVICES: Service[] = [
  {
    tag: "Kern",
    title: "Website-Creation",
    desc: "Event-Seiten, Bar- und Club-Websites, Landing-Pages. DSGVO ohne Cookie-Banner, Ticket-Shop und Reservierung angebunden, am Handy in Sekunden geladen. In Tagen live, nicht in Monaten.",
    icon: <Globe strokeWidth={2} />,
    featured: true,
  },
  { tag: "Kern", title: "KI-Integration", desc: "Assistenten und Automatisierung: Chatbot auf WhatsApp, Gästelisten, Buchhaltungs- und Social-Media-Workflows.", icon: <Bot strokeWidth={2} /> },
  { tag: "Laufend", title: "Hosting & Wartung", desc: "Monatlich: Hosting, Updates, Sicherheit und Support, wenn der Laden voll ist.", icon: <Server strokeWidth={2} /> },
  { tag: "Baustein", title: "Chatbots", desc: "Reservierungen, Gästelisten und FAQ direkt im Chat, rund um die Uhr. WhatsApp zuerst, auf Wunsch Instagram oder Website.", icon: <MessageCircle strokeWidth={2} /> },
  { tag: "Baustein", title: "Automatisierung", desc: "Buchhaltung vorbereiten, Social-Media-Entwürfe schreiben, das Team erinnern. Was sich wiederholt, läuft von allein.", icon: <Workflow strokeWidth={2} /> },
  { tag: "Baustein", title: "Anbindungen", desc: "Ticket-Shop, Reservierung, Kasse und Kalender sauber miteinander verbunden.", icon: <Puzzle strokeWidth={2} /> },
];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 0.84, 0.44, 1] } },
};

const tagChip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 12px",
  borderRadius: "var(--rounded-full)",
  background: "rgba(194, 239, 78, 0.1)",
  border: "1px solid rgba(194, 239, 78, 0.32)",
  color: "var(--color-accent-lime)",
  font: "var(--type-button-cap-light)",
  letterSpacing: "var(--tracking-caps)",
  textTransform: "uppercase",
  fontSize: 11,
};

function Tile({ s }: { s: Service }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -6, scale: 1.015, transition: { type: "spring", stiffness: 300, damping: 22 } }}
      className={`bw-bento-tile ${s.featured ? "bw-bento-featured" : ""}`}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "rgba(21, 15, 35, 0.66)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid var(--hairline-violet)",
        borderRadius: s.featured ? "var(--rounded-xxl)" : "var(--rounded-xl)",
        padding: s.featured ? "var(--space-xxl)" : "var(--space-xl)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <span style={tagChip}>{s.tag}</span>
        <span className="bento-icon" style={{ color: "var(--color-accent-violet-mid)", display: "inline-flex", transition: "color 0.3s ease" }}>
          {s.icon}
        </span>
      </div>

      <h3 style={{ font: s.featured ? "var(--type-display-large)" : "var(--type-heading-md)", fontSize: s.featured ? "clamp(28px, 3.2vw, 38px)" : undefined, margin: "0 0 var(--space-sm)", color: "var(--on-primary)" }}>
        {s.title}
      </h3>
      <p style={{ font: s.featured ? "var(--type-body-lg)" : "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0, flex: 1 }}>
        {s.desc}
      </p>

    </motion.div>
  );
}

/** Services as an animated bento grid (21st.dev pattern, NiteNexo-branded). */
export function ServicesBento() {
  return (
    <motion.div
      className="bw-bento"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {SERVICES.map((s) => (
        <Tile key={s.title} s={s} />
      ))}
    </motion.div>
  );
}

/** Centered link under the grid; the featured tile carries no button of its own. */
export function ServicesBentoCta() {
  return (
    <div style={{ textAlign: "center", marginTop: "var(--space-xl)" }}>
      <Button variant="ghost-on-dark" href="/leistungen">
        Alle Leistungen ansehen
      </Button>
    </div>
  );
}
