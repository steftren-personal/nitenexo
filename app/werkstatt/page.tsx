import type { Metadata } from "next";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { KeywordHighlight } from "@/components/ui/KeywordHighlight";
import { ArticleCard } from "@/components/marketing/ArticleCard";
import { ARTICLES } from "@/lib/werkstatt";

export const metadata: Metadata = {
  title: "Aus der Werkstatt — NiteNexo Solutions",
  description:
    "Kurz erklärt: warum ein Chatbot mehr Reservierungen bringt, wie die Gästeliste am Einlass im Chat läuft und wie ein Bot-Projekt konkret abläuft.",
};

export default function WerkstattPage() {
  return (
    <>
      <NavBar polarity="dark" />
      <div style={{ background: "var(--surface-canvas-dark)", color: "var(--on-primary)" }}>
        {/* Header */}
        <div style={{ background: "var(--surface-canvas-dark) url(/assets/starfield.png)", backgroundSize: "cover" }}>
          <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-section) var(--space-xl)" }}>
            <Eyebrow polarity="dark">Aus der Werkstatt</Eyebrow>
            <h1 style={{ font: "var(--type-display-hero)", fontSize: "clamp(38px, 6vw, 72px)", lineHeight: 1.06, margin: "var(--space-md) 0 0", maxWidth: 760 }}>
              Kurz erklärt, <KeywordHighlight>ohne Fachchinesisch</KeywordHighlight>.
            </h1>
            <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", maxWidth: 560, margin: "var(--space-lg) 0 0" }}>
              Was wir aus dem Nachtbetrieb gelernt haben — verständlich aufgeschrieben für alle, die
              einen Laden führen und keine Zeit für Handbücher haben.
            </p>
          </div>
        </div>

        {/* Artikel */}
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-section) var(--space-xl)" }}>
          <div className="bw-blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)" }}>
            {ARTICLES.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "var(--surface-night)" }}>
          <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-section) var(--space-xl)", textAlign: "center" }}>
            <h2 style={{ font: "var(--type-display-large)", fontSize: "clamp(26px, 4vw, 40px)", margin: "0 auto var(--space-md)", maxWidth: 620 }}>
              Deine Frage war nicht dabei?
            </h2>
            <p style={{ font: "var(--type-body-lg)", color: "var(--on-dark-muted)", margin: "0 auto var(--space-xl)", maxWidth: 480 }}>
              Schreib uns einfach — wir antworten mit Klartext, nicht mit einem Angebot.
            </p>
            <Button variant="inverted" glow href="/kontakt">
              Frage stellen
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
