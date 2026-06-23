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
      <NavBar polarity="light" />
      <div style={{ background: "var(--surface-canvas-light)", color: "var(--ink)", minHeight: "100vh" }}>
        <div
          style={{
            maxWidth: 440,
            margin: "0 auto",
            padding: "var(--space-xxl) var(--space-xl) var(--space-section)",
            textAlign: "center",
          }}
        >
          <Eyebrow polarity="light">Fast geschafft</Eyebrow>
          <h1 style={{ font: "var(--type-heading-xl)", fontSize: "clamp(28px, 4vw, 40px)", margin: "var(--space-md) 0" }}>
            Check deine E-Mails.
          </h1>
          <p style={{ font: "var(--type-body-md)", color: "var(--color-accent-violet-mid)", margin: "0 0 var(--space-xl)" }}>
            Wir haben dir einen Bestätigungslink geschickt. Klick ihn an, dann kannst du dich einloggen
            und einen Termin buchen.
          </p>
          <Button variant="primary" href="/login">
            Zum Login
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}