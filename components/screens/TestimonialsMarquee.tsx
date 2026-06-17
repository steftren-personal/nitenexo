import React from "react";
import { Card } from "@/components/ui/Card";

const TESTIMONIALS = [
  { quote: "Seit dem Bot verpassen wir keine Tisch-Anfrage mehr — auch nicht um Mitternacht. Mein Team tippt deutlich weniger.", name: "Marko R.", role: "Inhaber, Trattoria" },
  { quote: "Die Gästeliste am Einlass läuft jetzt komplett über WhatsApp. Türsteher happy, Gäste happy.", name: "Lena S.", role: "Booking, Club" },
  { quote: "Schnell aufgesetzt, klar erklärt, und wenn was ist, ist Stefan sofort erreichbar.", name: "Daniel K.", role: "Barbetrieb" },
  { quote: "Vorbestellungen am Wochenende laufen jetzt von allein. Wir kochen, der Bot nimmt auf.", name: "Aylin T.", role: "Café & Bar" },
];

function Stars() {
  return (
    <div style={{ display: "flex", gap: 2, color: "var(--color-accent-pink)", fontSize: 15 }} aria-hidden="true">
      {"★★★★★".split("").map((s, i) => (
        <span key={i}>{s}</span>
      ))}
    </div>
  );
}

function Group({ hidden }: { hidden?: boolean }) {
  return (
    <div style={{ display: "flex" }} aria-hidden={hidden}>
      {TESTIMONIALS.map((t, i) => (
        <Card key={i} polarity="dark" className="bw-testi-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          <Stars />
          <p style={{ font: "var(--type-body-md)", color: "var(--on-primary)", margin: 0, flex: 1, lineHeight: 1.6 }}>„{t.quote}&ldquo;</p>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", paddingTop: "var(--space-md)", borderTop: "1px solid var(--hairline-violet)" }}>
            <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-accent-violet-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", font: "var(--type-body-strong)", color: "var(--on-primary)" }}>
              {t.name.charAt(0)}
            </span>
            <div>
              <div style={{ font: "var(--type-body-strong)" }}>{t.name}</div>
              <div style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>{t.role}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/** Testimonials as an infinite marquee of cards (pauses on hover). */
export function TestimonialsMarquee() {
  return (
    <div className="bw-testi-marquee" aria-label="Stimmen aus dem Betrieb">
      <div className="bw-testi-track">
        <Group />
        <Group hidden />
      </div>
    </div>
  );
}
