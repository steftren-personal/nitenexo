import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { resetPassword } from "./actions";

export const metadata: Metadata = {
  title: "Neues Passwort — NiteNexo Solutions",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; invalid?: string }>;
}) {
  const { error, invalid } = await searchParams;

  // app/auth/confirm/route.ts already redeemed the recovery link and wrote
  // the session cookie before sending the user here — so a valid link means
  // a valid session. No session (or an explicit ?invalid=1) means the link
  // was missing, expired, or already used.
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const showInvalid = invalid === "1" || !data.user;

  return (
    <>
      <NavBar polarity="dark" />
      <div style={{ background: "var(--surface-canvas-dark)", color: "var(--on-primary)", minHeight: "100vh" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "var(--space-xxl) var(--space-xl) var(--space-section)" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-xxl)" }}>
            <Eyebrow polarity="dark">Neues Passwort</Eyebrow>
            <h1 style={{ font: "var(--type-heading-xl)", fontSize: "clamp(28px, 4vw, 40px)", margin: "var(--space-md) 0" }}>
              {showInvalid ? "Link nicht gültig." : "Fast geschafft."}
            </h1>
          </div>

          {showInvalid ? (
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
                Dieser Link ist abgelaufen oder wurde schon verwendet. Fordere einfach einen neuen an.
              </p>
              <Button variant="inverted" href="/passwort-vergessen">
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
                background: "var(--surface-night)",
                border: "1px solid var(--hairline-violet)",
                borderRadius: "var(--rounded-xl)",
                padding: "var(--space-xxl)",
                boxShadow: "var(--shadow-2)",
              }}
            >
              <Field label="Neues Passwort" polarity="dark">
                <Input polarity="dark" type="password" name="password" required minLength={8} autoComplete="new-password" />
              </Field>
              <Field label="Passwort wiederholen" polarity="dark">
                <Input polarity="dark" type="password" name="passwordRepeat" required minLength={8} autoComplete="new-password" />
              </Field>
              <p style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)", margin: 0 }}>
                Mindestens 8 Zeichen.
              </p>

              {error && (
                <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)" }}>{error}</div>
              )}

              <Button variant="inverted" type="submit">
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
