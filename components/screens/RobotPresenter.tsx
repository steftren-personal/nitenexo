import React from "react";
import { MessageCircle, Bot, CalendarCheck } from "lucide-react";
import { ChatPreview } from "./ChatPreview";

const STEPS = [
  { icon: <MessageCircle strokeWidth={2} />, title: "Dein Gast schreibt", text: "„Habt ihr morgen einen Tisch für 4?“ — per WhatsApp, jederzeit, auch um 23:40." },
  { icon: <Bot strokeWidth={2} />, title: "Der Assistent antwortet sofort", text: "Prüft Verfügbarkeit, schlägt Zeiten vor und bestätigt — in Sekunden, ohne dass dein Team tippt." },
  { icon: <CalendarCheck strokeWidth={2} />, title: "Automatisch eingetragen", text: "Die Reservierung landet im System, die Bestätigung geht raus. Du schläfst weiter." },
];

export function RobotPresenter() {
  return (
    <section id="assistent" className="bw-container" style={{ padding: "0 var(--space-xl) var(--space-section)" }}>
      <div className="bw-about-grid" style={{ display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: "var(--space-section)", alignItems: "center" }}>
        <div data-reveal style={{ display: "flex", justifyContent: "center" }}><ChatPreview revealed={4} /></div>
        <div>
          <h2 data-reveal style={{ font: "var(--type-display-large)", fontSize: "clamp(28px, 4vw, 44px)", marginBottom: "var(--space-xl)", maxWidth: 460 }}>Er macht die Arbeit — du siehst nur das Ergebnis.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
            {STEPS.map((s, i) => (
              <div key={s.title} data-reveal style={{ display: "flex", gap: "var(--space-lg)", alignItems: "flex-start" }}>
                <span aria-hidden="true" style={{ flex: "0 0 44px", color: "var(--color-accent-lime)" }}>{s.icon}</span>
                <div>
                  <h3 style={{ font: "var(--type-heading-sm)", marginBottom: 8 }}><span style={{ color: "var(--color-accent-lime)", marginRight: 8 }}>{String(i + 1).padStart(2, "0")}</span>{s.title}</h3>
                  <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", maxWidth: 460 }}>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
