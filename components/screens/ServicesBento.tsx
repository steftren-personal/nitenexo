import React from "react";
import { Globe, Bot, Server, MessageCircle, Workflow, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const SERVICES = [
  {
    tag: "Kern", title: "Website-Creation",
    desc: "Event-Seiten, Bar- und Club-Websites, Landing-Pages. DSGVO ohne Cookie-Banner, Ticket-Shop und Reservierung angebunden, am Handy in Sekunden geladen. In Tagen live, nicht in Monaten.",
    icon: <Globe strokeWidth={2} />, featured: true,
  },
  { tag: "Kern", title: "KI-Integration", desc: "Assistenten und Automatisierung: Chatbot auf WhatsApp, Gästelisten, Buchhaltungs- und Social-Media-Workflows.", icon: <Bot strokeWidth={2} /> },
  { tag: "Laufend", title: "Hosting & Wartung", desc: "Monatlich: Hosting, Updates, Sicherheit und Support, wenn der Laden voll ist.", icon: <Server strokeWidth={2} /> },
  { tag: "Baustein", title: "Chatbots", desc: "Reservierungen, Gästelisten und FAQ direkt im Chat, rund um die Uhr. WhatsApp zuerst, auf Wunsch Instagram oder Website.", icon: <MessageCircle strokeWidth={2} /> },
  { tag: "Baustein", title: "Automatisierung", desc: "Buchhaltung vorbereiten, Social-Media-Entwürfe schreiben, das Team erinnern. Was sich wiederholt, läuft von allein.", icon: <Workflow strokeWidth={2} /> },
  { tag: "Baustein", title: "Anbindungen", desc: "Ticket-Shop, Reservierung, Kasse und Kalender sauber miteinander verbunden.", icon: <Puzzle strokeWidth={2} /> },
];

export function ServicesBento() {
  return (
    <div className="bw-bento">
      {SERVICES.map(s => (
        <article key={s.title} data-reveal className={`bw-bento-tile ${s.featured ? "bw-bento-featured" : ""}`}>
          <div className="nn-tile-top"><span className="nn-service-tag">{s.tag}</span><span className="bento-icon" aria-hidden="true">{s.icon}</span></div>
          <h3 style={{ font: "var(--type-heading-md)", fontSize: s.featured ? "clamp(28px, 3.2vw, 38px)" : undefined, marginBottom: "var(--space-sm)" }}>{s.title}</h3>
          <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", lineHeight: 1.6 }}>{s.desc}</p>
        </article>
      ))}
    </div>
  );
}

export function ServicesBentoCta() {
  return <div style={{ textAlign: "center", marginTop: "var(--space-xl)" }}><Button variant="ghost-on-dark" href="/leistungen">Alle Leistungen ansehen</Button></div>;
}
