import React from "react";

type Row = { who: "gast" | "bot"; text: string; t: string };

// Static WhatsApp-style mock of the Sorry Not Sorry guest-list flow. No real
// names, no real numbers: it shows the shape of the conversation, nothing more.
const ROWS: Row[] = [
  { who: "gast", text: "Hey, setzt mich auf die Gästeliste für Samstag, +1", t: "22:14" },
  { who: "bot", text: "Passt. Du stehst mit +1 auf der Liste für Samstag. Name an der Tür nennen, Einlass ab 23:00.", t: "22:14" },
  { who: "gast", text: "Danke!", t: "22:15" },
  { who: "bot", text: "Bis Samstag. Falls was dazwischenkommt, einfach hier abmelden.", t: "22:15" },
];

function Bubble({ r }: { r: Row }) {
  const bot = r.who === "bot";
  return (
    <div style={{ display: "flex", justifyContent: bot ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "84%",
          padding: "var(--space-sm) var(--space-md)",
          borderRadius: bot ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
          font: "var(--type-caption)",
          lineHeight: 1.5,
          background: bot ? "var(--on-primary)" : "var(--color-accent-violet-deep)",
          color: bot ? "var(--color-ink-deep)" : "var(--on-primary)",
          display: "flex",
          alignItems: "flex-end",
          gap: "var(--space-sm)",
        }}
      >
        <span>{r.text}</span>
        <span style={{ font: "var(--type-code)", fontSize: 10, opacity: 0.55, whiteSpace: "nowrap" }}>{r.t}</span>
      </div>
    </div>
  );
}

export function ChatMock() {
  return (
    <div
      data-reveal
      aria-label="Beispiel-Chat: Gästeliste per WhatsApp"
      style={{
        background: "rgba(21,15,35,0.72)",
        border: "1px solid var(--hairline-violet)",
        borderRadius: "var(--rounded-xxl)",
        padding: "var(--space-lg)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-md)",
        width: "100%",
        maxWidth: 380,
        margin: "0 auto",
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", paddingBottom: "var(--space-md)", borderBottom: "1px solid var(--hairline-violet)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/sticker-bot.svg" alt="" width={38} height={38} />
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ font: "var(--type-body-strong)", color: "var(--on-primary)" }}>Gästelisten-Chatbot</div>
          <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)", display: "flex", alignItems: "center", gap: 6 }}>
            <span className="bw-pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-accent-pink)", display: "inline-block" }} />
            online, antwortet sofort
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {ROWS.map((r, i) => (
          <Bubble key={i} r={r} />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", padding: "var(--space-sm) var(--space-md)", borderRadius: "var(--rounded-full)", border: "1px solid var(--hairline-violet)" }}>
        <span style={{ font: "var(--type-caption)", color: "var(--on-dark-faint)", flex: 1 }}>Nachricht schreiben…</span>
        <span style={{ font: "var(--type-code)", fontSize: 13, color: "var(--color-accent-violet-mid)" }}>22:16</span>
      </div>
    </div>
  );
}
