"use client";

import React, { useState } from "react";
import { Utensils, Wine, Music, Coffee } from "lucide-react";

const CASES = [
  { id: "restaurants", label: "Restaurants", icon: <Utensils size={18} />,
    headline: "Volle Tische, weniger Telefon.",
    bullets: ["Tischreservierung mit Live-Verfügbarkeit", "Vorbestellungen & Menü-Fragen automatisch", "Bestätigung und Erinnerung per WhatsApp"],
    example: "„Habt ihr Sonntag 19 Uhr einen Tisch für 6?“ — beantwortet und eingetragen, bevor der Kellner Zeit hätte." },
  { id: "bars", label: "Bars", icon: <Wine size={18} />,
    headline: "Mehr los — auch unter der Woche.",
    bullets: ["Happy-Hour & Events automatisch ankündigen", "Gästeliste und Reservierungen direkt im Chat", "Stammgäste mit Aktionen zurückholen"],
    example: "„Was geht heute bei euch?“ — der Bot schickt Programm, Happy-Hour und reserviert den Tisch gleich mit." },
  { id: "clubs", label: "Clubs", icon: <Music size={18} />,
    headline: "Einlass, der sich selbst organisiert.",
    bullets: ["Digitale Gästeliste & Türsteher-Check", "Line-up und Themen-Nights pushen", "VIP-Tische & Bottle-Service anfragen"],
    example: "„Setz mich auf die Gästeliste für Freitag.“ — erledigt, mit QR-Code für den Einlass." },
  { id: "cafes", label: "Cafés", icon: <Coffee size={18} />,
    headline: "Der Morgen-Rush ohne Schlange.",
    bullets: ["Vorbestellungen für die Stoßzeit", "Tagesangebote & Specials zeigen", "Stammgäste mit Treue-Aktionen binden"],
    example: "„2 Flat White to go, in 10 Min.“ — steht fertig bereit, keine Warteschlange." },
];

export function UseCaseTabs() {
  const [active, setActive] = useState(0);
  const current = CASES[active];
  return (
    <section id="betriebe" className="nn-usecases" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--space-xl) var(--space-section)" }}>
      <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto var(--space-xxl)" }} data-reveal>
        <h2 style={{ font: "var(--type-display-large)", fontSize: "clamp(28px, 4vw, 44px)" }}>Gebaut für genau deinen Betrieb.</h2>
      </div>
      <div role="tablist" aria-label="Betriebsart" className="nn-tabs">
        {CASES.map((item, index) => (
          <button key={item.id} type="button" role="tab" id={`tab-${item.id}`} aria-controls="betrieb-panel"
            aria-selected={active === index} tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)} onKeyDown={event => {
              let next = index;
              if (event.key === "ArrowRight") next = (index + 1) % CASES.length;
              else if (event.key === "ArrowLeft") next = (index + CASES.length - 1) % CASES.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = CASES.length - 1;
              else return;
              event.preventDefault();
              setActive(next);
              document.getElementById(`tab-${CASES[next].id}`)?.focus();
            }}>
            <span aria-hidden="true">{item.icon}</span>{item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="betrieb-panel" aria-labelledby={`tab-${current.id}`} tabIndex={0} className="nn-case-panel bw-about-grid">
        <div>
          <h3 style={{ font: "var(--type-display-large)", fontSize: "clamp(24px, 3vw, 34px)", marginBottom: "var(--space-lg)" }}>{current.headline}</h3>
          <ul className="nn-case-bullets">{current.bullets.map(b => <li key={b}><span aria-hidden="true">→</span>{b}</li>)}</ul>
        </div>
        <div className="nn-case-example">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/sticker-bot.svg" sizes="40px" alt="" width={40} height={40} loading="lazy" />
          <p>{current.example}</p>
        </div>
      </div>
    </section>
  );
}
