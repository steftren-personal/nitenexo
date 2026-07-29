import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/ui/Button";
import { resetPassword } from "./actions";

export const metadata: Metadata = {
  title: "Neues Passwort — NiteNexo Solutions",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string; invalid?: string }>;
}) {
  const { code, error, invalid } = await searchParams;

  const showInvalid = invalid === "1" || !code;

  return (
    <>
      <NavBar polarity="light" />
      <div style={{ background: "var(--surface-canvas-light)", color: "var(--ink)", minHeight: "100vh" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "var(--space-xxl) var(--space-xl) var(--space-section)" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-xxl)" }}>
            <Eyebrow polarity="light">Neues Passwort</Eyebrow>
            <h1 style={{ font: "var(--type-heading-xl)", fontSize: "clamp(28px, 4vw, 40px)", margin: "var(--space-md) 0" }}>
              {showInvalid ? "Link nicht gültig." : "Fast geschafft."}
            </h1>
          </div>

          {showInvalid ? (
            <div
              style={{
                border: "1px solid var(--hairline-cloud)",
                borderRadius: "var(--rounded-xl)",
                padding: "var(--space-xxl)",
                boxShadow: "var(--shadow-2)",
                textAlign: "center",
              }}
            >
              <p style={{ font: "var(--type-body-md)", color: "var(--color-ink-deep)", margin: "0 0 var(--space-xl)" }}>
                Dieser Link ist abgelaufen oder wurde schon verwendet. Fordere einfach einen neuen an.
              </p>
              <Button variant="primary" href="/passwort-vergessen">
                Neuen Link anfordern
              </Button>
            </div>
          ) : (
            <form
              action={resetPassword}
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
              <input type="hidden" name="code" value={code} />
              <Field label="Neues Passwort">
                <Input type="password" name="password" required minLength={8} autoComplete="new-password" />
              </Field>
              <Field label="Passwort wiederholen">
                <Input type="password" name="passwordRepeat" required minLength={8} autoComplete="new-password" />
              </Field>
              <p style={{ font: "var(--type-caption)", color: "var(--color-accent-violet-mid)", margin: 0 }}>
                Mindestens 8 Zeichen.
              </p>

              {error && (
                <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)" }}>{error}</div>
              )}

              <Button variant="primary" type="submit">
                Passwort speichern
              </Button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
