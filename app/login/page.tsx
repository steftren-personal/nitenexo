import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/ui/Button";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Login — NiteNexo Solutions",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string; success?: string }>;
}) {
  const { error, redirectTo = "/termine", success } = await searchParams;

  return (
    <>
      <NavBar polarity="dark" />
      <div style={{ background: "var(--surface-canvas-dark)", color: "var(--on-primary)", minHeight: "100vh" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "var(--space-xxl) var(--space-xl) var(--space-section)" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-xxl)" }}>
            <Eyebrow polarity="dark">Login</Eyebrow>
            <h1 style={{ font: "var(--type-heading-xl)", fontSize: "clamp(28px, 4vw, 40px)", margin: "var(--space-md) 0" }}>
              Schön, dass du da bist.
            </h1>
          </div>

          <form
            action={login}
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
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <Field label="E-Mail" polarity="dark">
              <Input polarity="dark" type="email" name="email" placeholder="maria@club.at" required autoComplete="email" />
            </Field>
            <Field label="Passwort" polarity="dark">
              <Input polarity="dark" type="password" name="password" required autoComplete="current-password" />
            </Field>

            <p style={{ font: "var(--type-caption)", textAlign: "right", margin: "calc(-1 * var(--space-sm)) 0 0" }}>
              <Link href="/passwort-vergessen" style={{ color: "var(--color-accent-lime)" }}>
                Passwort vergessen?
              </Link>
            </p>

            {success && (
              <div style={{ font: "var(--type-caption)", color: "var(--color-accent-lime)" }}>{success}</div>
            )}

            {error && (
              <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)" }}>{error}</div>
            )}

            <Button variant="inverted" type="submit">
              Einloggen
            </Button>

            <p style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)", textAlign: "center", margin: 0 }}>
              Noch kein Konto?{" "}
              <Link href="/registrieren" style={{ color: "var(--color-accent-lime)" }}>
                Jetzt registrieren
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}