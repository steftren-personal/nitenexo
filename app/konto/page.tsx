import type { Metadata } from "next";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { updateProfile, changePassword, signOut } from "./actions";

export const metadata: Metadata = {
  title: "Konto — NiteNexo Solutions",
};

export default async function KontoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; passwordChanged?: string }>;
}) {
  const { error, passwordChanged } = await searchParams;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", auth.user!.id)
    .single();

  return (
    <>
      <NavBar polarity="light" />
      <div style={{ background: "var(--surface-canvas-light)", color: "var(--ink)", minHeight: "100vh" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "var(--space-xxl) var(--space-xl) var(--space-section)" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-xxl)" }}>
            <Eyebrow polarity="light">Konto</Eyebrow>
            <h1 style={{ font: "var(--type-heading-xl)", fontSize: "clamp(28px, 4vw, 40px)", margin: "var(--space-md) 0" }}>
              Dein Profil.
            </h1>
          </div>

          <form
            action={updateProfile}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-lg)",
              border: "1px solid var(--hairline-cloud)",
              borderRadius: "var(--rounded-xl)",
              padding: "var(--space-xxl)",
              boxShadow: "var(--shadow-2)",
              marginBottom: "var(--space-xl)",
            }}
          >
            <Field label="Name">
              <Input name="fullName" defaultValue={profile?.full_name ?? ""} required />
            </Field>
            <Field label="E-Mail">
              <Input defaultValue={auth.user?.email ?? ""} readOnly disabled />
            </Field>
            <Button variant="primary" type="submit">
              Speichern
            </Button>
          </form>

          <form
            action={changePassword}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-lg)",
              border: "1px solid var(--hairline-cloud)",
              borderRadius: "var(--rounded-xl)",
              padding: "var(--space-xxl)",
              boxShadow: "var(--shadow-2)",
              marginBottom: "var(--space-xl)",
            }}
          >
            <Field label="Neues Passwort">
              <Input type="password" name="password" required minLength={8} autoComplete="new-password" />
            </Field>
            {error && (
              <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)" }}>{error}</div>
            )}
            {passwordChanged && (
              <div style={{ font: "var(--type-caption)", color: "var(--color-accent-violet)" }}>
                Passwort wurde geändert.
              </div>
            )}
            <Button variant="primary" type="submit">
              Passwort ändern
            </Button>
          </form>

          <form action={signOut}>
            <Button variant="ghost-on-dark" type="submit" style={{ width: "100%", color: "var(--color-ink-deep)" }}>
              Ausloggen
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}