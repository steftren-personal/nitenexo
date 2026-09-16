import type { Metadata } from "next";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/marketing/Sticker";
import { KeywordHighlight } from "@/components/ui/KeywordHighlight";

export const metadata: Metadata = {
  title: "Leistungen — NiteNexo Solutions",
  description:
    "Website-Creation für Events, Bars und Clubs, KI-Integration mit Chatbots und Automatisierung, dazu Hosting & Wartung. Aus Wien, für Gastro, Events und Nachtleben.",
};

const LEISTUNGEN = [
  {
    id: "website-creation",
    tag: "Kern",
    title: "Website-Creation",
    lead: "Event-Seiten, Bar- und Club-Websites, Landing-Pages. Seiten, die am Handy in Sekunden laden und um 23:40 Tickets verkaufen, während du hinter der Bar stehst. DSGVO ohne Cookie-Banner, weil wir ohne Tracking bauen. In Tagen live, nicht in Monaten.",
    points: ["Event-Seite mit Ticket-Vorverkauf verlinkt", "Bar- und Club-Website mit Reservierung", "Kein Cookie-Banner: keine externen Requests, kein Tracking", "Fonts und Bilder lokal, schnell am Handy", "Vom Brief bis Live in Tagen"],
  },
  {
    id: "ki-integration",
    tag: "Kern",
    title: "KI-Integration",
    lead: "Assistenten und Automatisierung für genau deinen Ablauf. Der Chatbot auf WhatsApp nimmt Reservierungen und Gästelisten auf, rund um die Uhr, ohne dass dein Team tippt. Dahinter laufen Workflows für Buchhaltung und Social Media. Wir schauen uns deinen echten Ablauf an, richten alles ein und schulen dein Team. Du musst nichts Technisches können.",
    points: ["Chatbot auf WhatsApp: Reservierung, Gästeliste, Einlass-Check, FAQ", "Auf Wunsch auch Instagram oder direkt auf deiner Website", "Buchhaltungs- und Social-Media-Workflows", "Anbindung an Kasse, Kalender und Tischplan", "Ablauf-Analyse, Einrichtung, Test mit echten Anfragen, Schulung"],
  },
  {
    id: "hosting-wartung",
    tag: "Laufend",
    title: "Hosting & Wartung",
    lead: "Einmal live heißt nicht allein gelassen. Wir hosten, aktualisieren, halten alles sicher und sind erreichbar, wenn der Laden voll ist. Monatlich, ohne Laufzeit.",
    points: ["Hosting und Updates im Hintergrund", "Sicherheit und Monitoring", "Schnelle Hilfe bei Fragen", "Anpassungen, wenn sich der Ablauf ändert", "Fester Ansprechpartner"],
  },
];

export default function LeistungenPage() {
  return (
    <>
      <NavBar polarity="dark" />
      <div style={{ background: "var(--surface-canvas-dark)", color: "var(--on-primary)" }}>
        {/* Header */}
        <div style={{ background: "var(--surface-canvas-dark) url(/assets/starfield.png)", backgroundSize: "cover" }}>
          <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-section) var(--space-xl)", position: "relative" }}>
            <Eyebrow polarity="dark">Leistungen</Eyebrow>
            <h1 style={{ font: "var(--type-display-hero)", fontSize: "clamp(38px, 6vw, 72px)", lineHeight: 1.06, margin: "var(--space-md) 0 0", maxWidth: 760 }}>
              Websites, die verkaufen. <KeywordHighlight>KI, die mitarbeitet</KeywordHighlight>.
            </h1>
            <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", maxWidth: 560, margin: "var(--space-lg) 0 0" }}>
              Drei Leistungen für Gastro, Events und Nachtleben: die Website, die deinen Laden
              verkauft, die KI, die deine Abläufe übernimmt, und die Wartung, damit beides läuft.
            </p>
            <span className="bw-float bw-hide-mobile" style={{ position: "absolute", right: 24, top: 56 }}>
              <Sticker name="plug" size={104} tilt={10} />
            </span>
          </div>
        </div>

        {/* Detailblöcke */}
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-section) var(--space-xl)", display: "flex", flexDirection: "column", gap: "var(--space-section)" }}>
          {LEISTUNGEN.map((l, i) => {
            const flip = i % 2 === 1;
            const text = (
              <div key="t">
                <Badge variant="violet-tag">{l.tag}</Badge>
                <h2 style={{ font: "var(--type-display-large)", fontSize: "clamp(26px, 3.4vw, 40px)", margin: "var(--space-md) 0 var(--space-lg)", maxWidth: 480 }}>{l.title}</h2>
                <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", margin: 0, maxWidth: 480 }}>{l.lead}</p>
                <div style={{ marginTop: "var(--space-xl)" }}>
                  <Button variant="inverted" href="/kontakt">
                    Dazu beraten lassen
                  </Button>
                </div>
              </div>
            );
            const list = (
              <Card key="c" variant={flip ? "spotlight-violet" : "feature-dark"} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                <div style={{ font: "var(--type-micro-cap)", textTransform: "uppercase", letterSpacing: "var(--tracking-micro)", color: "var(--color-accent-violet-mid)" }}>Das ist drin</div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                  {l.points.map((p) => (
                    <li key={p} style={{ display: "flex", gap: "var(--space-md)", font: "var(--type-body-md)", color: "var(--on-primary)" }}>
                      <span aria-hidden="true" style={{ color: "var(--color-accent-pink)" }}>→</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
            return (
              <div key={l.id} id={l.id} className="bw-leistung-row" data-reveal style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-section)", alignItems: "center", scrollMarginTop: 96 }}>
                {flip ? [list, text] : [text, list]}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ background: "var(--surface-night)" }}>
          <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-section) var(--space-xl)", textAlign: "center" }}>
            <h2 style={{ font: "var(--type-display-large)", fontSize: "clamp(28px, 4vw, 44px)", margin: "0 auto var(--space-md)", maxWidth: 620 }}>
              Nicht sicher, was du brauchst?
            </h2>
            <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", margin: "0 auto var(--space-xl)", maxWidth: 480 }}>
              Sag uns einfach, wie dein Laden läuft. Wir schlagen vor, ob Website, KI oder beides am meisten bringt.
            </p>
            <Button variant="inverted" glow href="/kontakt">
              Unverbindlich anfragen
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
