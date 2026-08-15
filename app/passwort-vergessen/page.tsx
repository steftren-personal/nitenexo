import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/ui/Button";
import { requestPasswordReset } from "./actions";

export const metadata: Metadata = {
  title: "Passwort vergessen — NiteNexo Solutions",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <>
      <NavBar polarity="dark" />
      <div style={{ background: "var(--surface-canvas-dark)", color: "var(--on-primary)", minHeight: "100vh" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "var(--space-xxl) var(--space-xl) var(--space-section)" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-xxl)" }}>
            <Eyebrow polarity="dark">Passwort vergessen</Eyebrow>
            <h1 style={{ font: "var(--type-heading-xl)", fontSize: "clamp(28px, 4vw, 40px)", margin: "var(--space-md) 0" }}>
              Kein Problem.
            </h1>
          </div>

          {sent ? (
            <div
              style={{
                background: "var(--surface-night)",
                border: "1px solid var(--hairline-violet)",
                borderRadius: "var(--rounded-xl)",
                padding: "var(--space-xxl)",
                boxShadow: "var(--shadow-2)",
                textAlign: "center",
              }}
            >
              <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: "0 0 var(--space-xl)" }}>
                Falls ein Konto mit dieser Adresse existiert, haben wir dir einen Link geschickt.
                Schau in dein Postfach — auch im Spam-Ordner.
              </p>
              <Button variant="inverted" href="/login">
                Zurück zum Login
              </Button>
            </div>
          ) : (
            <form
              action={requestPasswordReset}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-lg)",
                background: "var(--surface-night)",
                border: "1px solid var(--hairline-violet)",
                borderRadius: "var(--rounded-xl)",
                padding: "var(--space-xxl)",
                boxShadow: "var(--shadow-2)",
              }}
            >
              <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", margin: 0 }}>
                Gib deine E-Mail-Adresse ein. Wir schicken dir einen Link, mit dem du ein neues
                Passwort setzen kannst.
              </p>
              <Field label="E-Mail" polarity="dark">
                <Input polarity="dark" type="email" name="email" placeholder="maria@club.at" required autoComplete="email" />
              </Field>

              <Button variant="inverted" type="submit">
                Link anfordern
              </Button>

              <p style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)", textAlign: "center", margin: 0 }}>
                Doch wieder eingefallen?{" "}
                <Link href="/login" style={{ color: "var(--color-accent-lime)" }}>
                  Zurück zum Login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
