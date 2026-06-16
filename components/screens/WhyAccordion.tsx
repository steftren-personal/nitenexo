"use client";

import React, { useState } from "react";

const WHY_ROWS = [
  {
    title: "Auf deinen Betrieb zugeschnitten",
    body: "Kein Baukasten von der Stange. Wir bilden deinen echten Ablauf ab — von der Reservierung bis zur Gästeliste am Einlass.",
  },
  {
    title: "In Tagen live, nicht in Monaten",
    body: "Du gibst uns Speisekarte und Ablauf, wir verdrahten den Assistenten mit deiner Nummer. Setup fühlt sich an wie ein Deploy.",
  },
  {
    title: "Sicher & DSGVO-konform",
    body: "Datensparsam aufgesetzt, Server in der EU, klare Datenschutzerklärung. Deine Gästedaten bleiben deine.",
  },
];

/** "Warum NiteNexo" — single-open accordion. */
export function WhyAccordion() {
  const [openRow, setOpenRow] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {WHY_ROWS.map((r, i) => {
        const open = openRow === i;
        return (
          <div
            key={i}
            style={{
              border: "1px solid var(--hairline-violet)",
              borderRadius: "var(--rounded-lg)",
              overflow: "hidden",
              background: open ? "var(--surface-night)" : "transparent",
            }}
          >
            <button
              onClick={() => setOpenRow(open ? -1 : i)}
              aria-expanded={open}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--space-md)",
                padding: "var(--space-lg)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--on-primary)",
                textAlign: "left",
                font: "var(--type-heading-sm)",
              }}
            >
              {r.title}
              <span
                aria-hidden="true"
                style={{
                  color: "var(--color-accent-violet-mid)",
                  transition: "transform 150ms ease",
                  transform: open ? "rotate(45deg)" : "none",
                  fontSize: 22,
                  lineHeight: 1,
                }}
              >
                +
              </span>
            </button>
            {open && (
              <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0, padding: "0 var(--space-lg) var(--space-lg)" }}>
                {r.body}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
