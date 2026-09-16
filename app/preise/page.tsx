import type { Metadata } from "next";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Sticker } from "@/components/marketing/Sticker";
import { PricingModel } from "@/components/marketing/PricingModel";

export const metadata: Metadata = {
  title: "Preise — NiteNexo Solutions",
  description:
    "Jedes Projekt wird einzeln kalkuliert: Website-Creation €500 bis €3.000, KI-Integration mit Chatbot-Einrichtung €300 bis €4.000, dazu eine monatliche Pauschale für Hosting und Wartung.",
};

const FAQ = [
  { q: "Warum steht hier kein Paketpreis?", a: "Weil kein Betrieb dem anderen gleicht. Eine Event-Seite mit Ticket-Link ist etwas anderes als eine Club-Website mit Reservierung, und ein Chatbot für Öffnungszeiten etwas anderes als einer, der Tischplan und Kasse kennt. Wir kalkulieren jedes Projekt einzeln. Dafür bekommst du einen Festpreis und keine Überraschung." },
  { q: "Was kostet eine Website?", a: "Zwischen €500 und €3.000 einmalig, je nach Umfang: Event-Seite, Landing-Page oder komplette Bar- und Club-Website, mit oder ohne Ticket- und Reservierungs-Anbindung. Nach einem kurzen Gespräch nennen wir dir den Festpreis für genau deinen Fall." },
  { q: "Was kostet die KI-Integration?", a: "Die Einrichtung eines Chatbots liegt zwischen €300 und €4.000 einmalig, je nach Abläufen und Anbindungen. Andere Automatisierungen, etwa für Buchhaltung, Newsletter oder Social Media, kalkulieren wir nach Umfang als Festpreis: Welche Systeme angebunden werden und wie viele Abläufe die KI übernimmt." },
  { q: "Wofür ist die monatliche Pauschale?", a: "Für Hosting, Updates und Sicherheit, Support im laufenden Betrieb, Bugfixes ohne Extrarechnung und Weiterentwicklung: neue Abläufe, saisonale Aktionen, Anpassungen. Die Höhe hängt vom Umfang ab und wird gemeinsam mit dem Festpreis vereinbart." },
  { q: "Bin ich an eine Laufzeit gebunden?", a: "Nein. Die monatliche Pauschale ist jederzeit zum Monatsende kündbar." },
  { q: "Brauche ich technisches Wissen?", a: "Nein. Wir bauen, richten ein und verknüpfen alles mit deinen Kanälen, etwa der WhatsApp-Nummer oder dem Ticket-Shop. Dein Team bekommt eine kurze Einschulung." },
  { q: "Wem gehören die Gästedaten?", a: "Dir. Wir verarbeiten sie ausschließlich in deinem Auftrag — geregelt in einem Auftragsverarbeitungsvertrag nach Art. 28 DSGVO. Die Datenbank liegt in Frankfurt, und wir erheben nur, was der jeweilige Ablauf wirklich braucht. Details in der Datenschutzerklärung." },
];

export default function PreisePage() {
  return (
    <>
      <NavBar polarity="dark" />
      <div style={{ background: "var(--surface-canvas-dark)", color: "var(--on-primary)", minHeight: "100vh" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-xxl) var(--space-xl) var(--space-section)", position: "relative" }}>
          <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto var(--space-section)" }}>
            <Eyebrow polarity="dark">Preise</Eyebrow>
            <h1 style={{ font: "var(--type-heading-xl)", fontSize: "clamp(30px, 4.4vw, 48px)", margin: "var(--space-md) 0 var(--space-md)" }}>
              Jeder Betrieb ist anders. Der Preis auch.
            </h1>
            <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0 }}>
              Keine Pakete von der Stange. Du bekommst einen Festpreis für Website oder
              KI-Integration und eine monatliche Pauschale für Hosting und Wartung.
            </p>
            <span className="bw-float bw-hide-mobile" style={{ position: "absolute", right: 8, top: -8 }}>
              <Sticker name="plug" size={92} tilt={10} />
            </span>
          </div>

          <PricingModel polarity="dark" />

          <p style={{ textAlign: "center", font: "var(--type-caption)", color: "var(--on-dark-muted)", marginTop: "var(--space-xl)" }}>
            Alle Preise zzgl. gesetzlicher Abgaben. Kleinunternehmer gem. § 6 Abs 1 Z 27 UStG — keine
            Umsatzsteuer ausgewiesen.
          </p>

          {/* FAQ */}
          <div style={{ maxWidth: 760, margin: "var(--space-section) auto 0" }}>
            <h2 style={{ font: "var(--type-heading-lg)", margin: "0 0 var(--space-xl)", textAlign: "center" }}>Häufige Fragen</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              {FAQ.map((f) => (
                <div
                  key={f.q}
                  data-reveal
                  style={{ border: "1px solid var(--hairline-violet)", borderRadius: "var(--rounded-xl)", padding: "var(--space-xl)", background: "var(--surface-night)" }}
                >
                  <div style={{ font: "var(--type-heading-sm)", marginBottom: "var(--space-sm)" }}>{f.q}</div>
                  <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
