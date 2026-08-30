import type { Metadata } from "next";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Sticker } from "@/components/marketing/Sticker";
import { PricingModel } from "@/components/marketing/PricingModel";

export const metadata: Metadata = {
  title: "Preise — NiteNexo Solutions",
  description:
    "Jedes Projekt wird einzeln kalkuliert: Chatbot €300 bis €4.000, Website €500 bis €3.000, KI-Integration nach Umfang. Dazu eine monatliche Pauschale für Support, Bugfixes und Weiterentwicklung.",
};

const FAQ = [
  { q: "Warum steht hier kein Paketpreis?", a: "Weil kein Betrieb dem anderen gleicht. Ein Assistent, der Öffnungszeiten beantwortet, ist etwas völlig anderes als einer, der Tischplan und Kasse kennt. Wir kalkulieren jeden einzeln — dafür bekommst du einen Festpreis und keine Überraschung." },
  { q: "Was kostet die Einrichtung?", a: "Ein Chatbot liegt zwischen €300 und €4.000, eine professionelle Website zwischen €500 und €3.000, jeweils einmalig und je nach Umfang. KI-Integration kalkulieren wir nach Umfang der Automatisierungen. Nach einem kurzen Gespräch nennen wir dir den Festpreis für genau deinen Fall." },
  { q: "Was heißt KI-Integration konkret?", a: "Automatismen in deinem Unternehmen: Die KI verbindet Kasse, Kalender, Newsletter oder Buchhaltung und übernimmt Abläufe, die sonst Handarbeit sind. Vom automatischen Wochenreport bis zur Schicht-Erinnerung. Der Preis hängt davon ab, wie viele solcher Abläufe wir einbauen." },
  { q: "Wofür ist die monatliche Pauschale?", a: "Für Support im laufenden Betrieb, Bugfixes ohne Extrarechnung und Weiterentwicklung — neue Abläufe, saisonale Aktionen, Anpassungen. Die Höhe hängt vom Umfang deines Assistenten ab und wird gemeinsam mit dem Festpreis vereinbart." },
  { q: "Bin ich an eine Laufzeit gebunden?", a: "Nein. Die monatliche Pauschale ist jederzeit zum Monatsende kündbar." },
  { q: "Brauche ich technisches Wissen?", a: "Nein. Wir richten alles ein und verknüpfen es mit deinem Kanal — meist der WhatsApp-Nummer. Dein Team bekommt eine kurze Einschulung." },
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
              Jeder Betrieb ist anders — der Preis auch.
            </h1>
            <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0 }}>
              Keine Pakete von der Stange. Ob Chatbot, Website oder KI-Integration: Du bekommst
              einen Festpreis für die Einrichtung und eine monatliche Pauschale, die zu deinem
              Projekt passt.
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
