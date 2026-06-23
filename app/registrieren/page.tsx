import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/ui/Button";
import { register } from "./actions";

export const metadata: Metadata = {
  title: "Registrieren — NiteNexo Solutions",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <NavBar polarity="light" />
      <div style={{ background: "var(--surface-canvas-light)", color: "var(--ink)", minHeight: "100vh" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "var(--space-xxl) var(--space-xl) var(--space-section)" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-xxl)" }}>
            <Eyebrow polarity="light">Registrieren</Eyebrow>
            <h1 style={{ font: "var(--type-heading-xl)", fontSize: "clamp(28px, 4vw, 40px)", margin: "var(--space-md) 0" }}>
              Konto anlegen.
            </h1>
          </div>

          <form
            action={register}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-lg)",
              border: "1px solid var(--hairline-cloud)",
              borderRadius: "var(--rounded-xl)",
              padding: "var(--space-xxl)",
              boxShadow: "var(--shadow-2)",
            }}
          >
            <Field label="Name">
              <Input name="fullName" placeholder="Maria Keller" required autoComplete="name" />
            </Field>
            <Field label="E-Mail">
              <Input type="email" name="email" placeholder="maria@club.at" required autoComplete="email" />
            </Field>
            <Field label="Passwort">
              <Input type="password" name="password" required minLength={8} autoComplete="new-password" />
            </Field>

            {error && (
              <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)" }}>{error}</div>
            )}

            <Button variant="primary" type="submit">
              Registrieren
            </Button>

            <p style={{ font: "var(--type-caption)", color: "var(--color-accent-violet-mid)", textAlign: "center", margin: 0 }}>
              Schon ein Konto?{" "}
              <Link href="/login" style={{ color: "var(--color-accent-violet)" }}>
                Einloggen
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}