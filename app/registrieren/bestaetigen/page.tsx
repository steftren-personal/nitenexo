import type { Metadata } from "next";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Bestätige deine E-Mail — NiteNexo Solutions",
};

export default function ConfirmEmailPage() {
  return (
    <>
      <NavBar polarity="dark" />
      <div style={{ background: "var(--surface-canvas-dark)", color: "var(--on-primary)", minHeight: "100vh" }}>
        <div
          style={{
            maxWidth: 440,
            margin: "0 auto",
            padding: "var(--space-xxl) var(--space-xl) var(--space-section)",
            textAlign: "center",
          }}
        >
          <Eyebrow polarity="dark">Fast geschafft</Eyebrow>
          <h1 style={{ font: "var(--type-heading-xl)", fontSize: "clamp(28px, 4vw, 40px)", margin: "var(--space-md) 0" }}>
            Check deine E-Mails.
          </h1>
          <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: "0 0 var(--space-xl)" }}>
            Wir haben dir einen Bestätigungslink geschickt. Klick ihn an, dann kannst du dich einloggen
            und einen Termin buchen. Schau auch kurz im Spam-Ordner nach.
          </p>
          <p style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)", margin: "0 0 var(--space-xl)" }}>
            Du hast dich hier schon einmal registriert? Dann kannst du dich direkt einloggen.
          </p>
          <Button variant="inverted" href="/login">
            Zum Login
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}