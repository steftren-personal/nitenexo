"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function resetPassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const passwordRepeat = String(formData.get("passwordRepeat") ?? "");

  if (password.length < 8) {
    redirect(`/passwort-neu?error=${encodeURIComponent("Das Passwort muss mindestens 8 Zeichen haben.")}`);
  }

  if (password !== passwordRepeat) {
    redirect(`/passwort-neu?error=${encodeURIComponent("Die Passwörter stimmen nicht überein.")}`);
  }

  const supabase = await createClient();

  // The recovery link no longer carries a code that gets exchanged here: the
  // token is already redeemed by app/auth/confirm/route.ts (verifyOtp) before
  // the user ever reaches this page, and that route is what wrote the
  // session cookies. All that's left to check is whether that session exists —
  // if it doesn't, the link was invalid, expired, or already used.
  const { data: existing } = await supabase.auth.getUser();

  if (!existing.user) {
    redirect("/passwort-neu?invalid=1");
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });

  if (updateError) {
    console.error("updateUser failed:", updateError.message);
    redirect(`/passwort-neu?error=${encodeURIComponent("Das Passwort konnte nicht gespeichert werden. Versuch es erneut.")}`);
  }

  redirect("/login?success=" + encodeURIComponent("Dein Passwort wurde geändert. Du kannst dich jetzt einloggen."));
}
