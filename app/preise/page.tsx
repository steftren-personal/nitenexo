import type { Metadata } from "next";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Sticker } from "@/components/marketing/Sticker";
import { PricingTiers } from "@/components/marketing/PricingTiers";

export const metadata: Metadata = {
  title: "Preise — NiteNexo Solutions",
  description: "Preise für Betriebe jeder Größe. Einmalige Einrichtung, danach monatlich. Jederzeit kündbar.",
};

const FAQ = [
  { q: "Was kostet die Einrichtung?", a: "Das Setup startet ab €290 einmalig — abhängig von Umfang und Anbindungen. Den genauen Preis nennen wir dir nach einem kurzen Gespräch." },
  { q: "Bin ich an eine Laufzeit gebunden?", a: "Nein. Die monatlichen Pakete sind jederzeit zum Monatsende kündbar." },
  { q: "Brauche ich technisches Wissen?", a: "Nein. Wir richten alles ein und verknüpfen es mit deiner WhatsApp-Nummer. Dein Team bekommt eine kurze Einschulung." },
  { q: "Wem gehören die Gästedaten?", a: "Dir. Wir setzen datensparsam auf, Server in der EU. Details findest du in der Datenschutzerklärung." },
];

export default function PreisePage() {
  return (
    <>
      <NavBar polarity="light" />
      <div style={{ background: "var(--surface-canvas-light)", color: "var(--ink)", minHeight: "100vh" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-xxl) var(--space-xl) var(--space-section)", position: "relative" }}>
          <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto var(--space-section)" }}>
            <Eyebrow polarity="light">Preise</Eyebrow>
            <h1 style={{ font: "var(--type-heading-xl)", fontSize: "clamp(30px, 4.4vw, 48px)", margin: "var(--space-md) 0 var(--space-md)" }}>
              Preise für Betriebe jeder Größe.
            </h1>
            <p style={{ font: "var(--type-body-md)", color: "var(--color-accent-violet-mid)", margin: 0 }}>
              Einmalige Einrichtung, danach monatlich. Keine versteckten Kosten, jederzeit kündbar.
            </p>
            <span className="bw-float bw-hide-mobile" style={{ position: "absolute", right: 8, top: -8 }}>
              <Sticker name="plug" size={92} tilt={10} />
            </span>
          </div>

          <PricingTiers />

          <p style={{ textAlign: "center", font: "var(--type-caption)", color: "var(--color-accent-violet-mid)", marginTop: "var(--space-xl)" }}>
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
                  style={{ border: "1px solid var(--hairline-cloud)", borderRadius: "var(--rounded-xl)", padding: "var(--space-xl)", background: "var(--surface-canvas-light)", boxShadow: "var(--shadow-2)" }}
                >
                  <div style={{ font: "var(--type-heading-sm)", marginBottom: "var(--space-sm)" }}>{f.q}</div>
                  <p style={{ font: "var(--type-body-md)", color: "var(--color-accent-violet-mid)", margin: 0 }}>{f.a}</p>
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
