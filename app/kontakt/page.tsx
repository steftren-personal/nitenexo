import type { Metadata } from "next";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "./ContactForm";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt — NiteNexo Solutions",
  description: "Erzähl uns von deinem Laden. Wir melden uns innerhalb eines Werktags mit einem Vorschlag und einer kurzen Demo.",
};

const microCap: React.CSSProperties = {
  font: "var(--type-micro-cap)",
  textTransform: "uppercase",
  letterSpacing: "var(--tracking-micro)",
  color: "var(--on-dark-muted)",
  marginBottom: "var(--space-sm)",
};

export default function KontaktPage() {
  return (
    <>
      <NavBar polarity="dark" />
      <div style={{ background: "var(--surface-canvas-dark)", color: "var(--on-primary)", minHeight: "100vh" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-xxl) var(--space-xl) var(--space-section)" }}>
          <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto var(--space-xxl)" }}>
            <Eyebrow polarity="dark">Kontakt</Eyebrow>
            <h1 style={{ font: "var(--type-heading-xl)", fontSize: "clamp(30px, 4.4vw, 48px)", margin: "var(--space-md) 0 var(--space-md)" }}>
              Erzähl uns von deinem Laden.
            </h1>
            <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0 }}>
              Wir melden uns innerhalb eines Werktags mit einem Vorschlag und einer kurzen Demo.
            </p>
          </div>

          <div className="bw-kontakt-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "var(--space-section)", alignItems: "start" }}>
            <ContactForm />

            {/* Kontaktspalte */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
              <div>
                <div style={microCap}>Direkt</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                  <a href={`mailto:${CONTACT.email}`} style={{ font: "var(--type-heading-sm)", color: "var(--on-primary)", textDecoration: "none" }}>
                    {CONTACT.email}
                  </a>
                  <a href={CONTACT.phoneHref} style={{ font: "var(--type-heading-sm)", color: "var(--on-primary)", textDecoration: "none" }}>
                    {CONTACT.phone}
                  </a>
                </div>
              </div>
              <div>
                <div style={microCap}>NiteNexo</div>
                <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0, lineHeight: 1.6 }}>
                  {CONTACT.name}
                  <br />
                  {CONTACT.street}
                  <br />
                  {CONTACT.city}
                </p>
              </div>
              <div style={{ background: "var(--surface-night)", border: "1px solid var(--hairline-violet)", color: "var(--on-primary)", borderRadius: "var(--rounded-xl)", padding: "var(--space-xl)" }}>
                <div style={{ font: "var(--type-body-strong)", marginBottom: "var(--space-xs)" }}>Antwortzeit</div>
                <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0 }}>
                  In der Regel innerhalb eines Werktags. Bei laufenden Projekten meist deutlich schneller.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
