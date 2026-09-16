import React from "react";

// The five NiteNexo agents around the one human who signs off. Built from the
// existing robot mark and site tokens; no photo, no external asset.
const AGENTS = [
  { name: "Nora", role: "Koordination" },
  { name: "Felix", role: "Entwicklung" },
  { name: "Mira", role: "Review" },
  { name: "Clara", role: "Buchhaltung" },
  { name: "Leon", role: "Marketing" },
];

export function AgentsGraphic() {
  return (
    <div
      data-reveal
      aria-label="Ein Mensch gibt frei, fünf KI-Agenten arbeiten zu"
      style={{
        background: "rgba(21,15,35,0.72)",
        border: "1px solid var(--hairline-violet)",
        borderRadius: "var(--rounded-xxl)",
        padding: "var(--space-xl)",
        width: "100%",
        maxWidth: 440,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-lg)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <span
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-accent-lime)",
            color: "var(--color-ink-deep)",
            font: "var(--type-heading-sm)",
            flex: "0 0 auto",
          }}
          aria-hidden="true"
        >
          1
        </span>
        <div style={{ lineHeight: 1.25 }}>
          <div style={{ font: "var(--type-body-strong)", color: "var(--on-primary)" }}>Ein Mensch</div>
          <div style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>Jede Freigabe läuft über ihn.</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", color: "var(--on-dark-faint)", font: "var(--type-micro-cap)", textTransform: "uppercase", letterSpacing: "var(--tracking-micro)" }}>
        <span style={{ flex: 1, height: 1, background: "var(--hairline-violet)" }} />
        gibt frei
        <span style={{ flex: 1, height: 1, background: "var(--hairline-violet)" }} />
      </div>

      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)" }}>
        {AGENTS.map((a, i) => (
          <li
            key={a.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-sm)",
              padding: "var(--space-sm) var(--space-md)",
              borderRadius: "var(--rounded-lg)",
              border: "1px solid var(--hairline-violet)",
              background: "rgba(122,63,240,0.12)",
              gridColumn: i === AGENTS.length - 1 ? "1 / -1" : undefined,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/sticker-bot.svg" alt="" width={28} height={28} style={{ flex: "0 0 auto" }} />
            <span style={{ lineHeight: 1.2 }}>
              <span style={{ display: "block", font: "var(--type-body-strong)", color: "var(--on-primary)" }}>{a.name}</span>
              <span style={{ display: "block", font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>{a.role}</span>
            </span>
          </li>
        ))}
      </ul>

      <p style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)", margin: 0, paddingTop: "var(--space-md)", borderTop: "1px solid var(--hairline-violet)" }}>
        Läuft auf eigener Infrastruktur, nur im privaten Netz.
      </p>
    </div>
  );
}
