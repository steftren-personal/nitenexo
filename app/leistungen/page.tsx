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
    "Website-Design, digitale Gäste-Tools, Automatisierungen, Beratung & Setup sowie Wartung & Support für Gastronomie, Bars und Clubs.",
};

const LEISTUNGEN = [
  {
    tag: "Kernprodukt",
    title: "Digitale Gäste-Tools",
    lead: "Reservierungen, Gästelisten und FAQ laufen digital — rund um die Uhr, ohne dass dein Team tippt.",
    points: ["Tischreservierung mit Verfügbarkeitsprüfung", "Bestellungen & Vorbestellungen", "Gästeliste & Einlass-Check", "FAQ: Öffnungszeiten, Anfahrt, Karte", "Automatische Bestätigungen & Erinnerungen"],
  },
  {
    tag: "Web",
    title: "Website-Design für Gastro & Clubs",
    lead: "Schnelle, klare Seiten, die auf dem Handy genauso gut aussehen wie am Laptop. Speisekarte, Öffnungszeiten und Buchung — ohne Schnickschnack, ohne Ladezeiten.",
    points: ["Mobile-first und blitzschnell", "Speisekarte & Galerie pflegbar", "Reservierung direkt eingebunden", "Social-Media-Anbindung", "Suchmaschinen-Grundlagen inklusive"],
  },
  {
    tag: "Automatisierung",
    title: "Digitale Assistenten",
    lead: "Maßgeschneiderte Abläufe für genau deinen Betrieb. Vom Türsteher-Check über Newsletter bis zur Schicht-Erinnerung — wir automatisieren, was dich Zeit kostet.",
    points: ["Individuelle Workflows nach Maß", "Anbindung an Kasse, Kalender & Tischplan", "Newsletter & Gäste-Reaktivierung", "Interne Benachrichtigungen fürs Team", "Reports, die du wirklich liest"],
  },
  {
    tag: "Start",
    title: "Beratung & Setup",
    lead: "Wir schauen uns deinen echten Ablauf an und richten alles ein. Du musst nichts Technisches können.",
    points: ["Ablauf-Analyse vor Ort oder per Call", "Komplette Einrichtung durch uns", "Test mit echten Beispiel-Anfragen", "Schulung für dein Team", "Live-Schaltung in wenigen Tagen"],
  },
  {
    tag: "Betrieb",
    title: "Wartung & Support",
    lead: "Einmal live heißt nicht allein gelassen. Wir überwachen, aktualisieren und sind erreichbar, wenn der Laden voll ist.",
    points: ["Monitoring & Updates", "Schnelle Hilfe bei Fragen", "Anpassungen, wenn sich der Ablauf ändert", "Saisonale Aktionen einbauen", "Fester Ansprechpartner"],
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
              Alles, damit dein Team <KeywordHighlight>weniger tippt</KeywordHighlight>.
            </h1>
            <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", maxWidth: 560, margin: "var(--space-lg) 0 0" }}>
              Von Websites über Gäste-Tools bis zu maßgeschneiderten Automatisierungen — wir
              bauen die digitalen Mitarbeiter für deinen Betrieb.
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
              <div key={l.title} className="bw-leistung-row" data-reveal style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-section)", alignItems: "center" }}>
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
              Sag uns einfach, wie dein Laden läuft. Wir schlagen vor, was am meisten bringt.
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
