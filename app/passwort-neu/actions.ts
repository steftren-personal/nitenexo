"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function resetPassword(formData: FormData) {
  const code = String(formData.get("code") ?? "");
  const password = String(formData.get("password") ?? "");
  const passwordRepeat = String(formData.get("passwordRepeat") ?? "");

  if (password.length < 8) {
    redirect(`/passwort-neu?code=${encodeURIComponent(code)}&error=${encodeURIComponent("Das Passwort muss mindestens 8 Zeichen haben.")}`);
  }

  if (password !== passwordRepeat) {
    redirect(`/passwort-neu?code=${encodeURIComponent(code)}&error=${encodeURIComponent("Die Passwörter stimmen nicht überein.")}`);
  }

  const supabase = await createClient();

  // The recovery link carries a PKCE code (this project's @supabase/ssr
  // clients default to the PKCE flow). Exchanging it here, inside a Server
  // Action, lets Supabase write the resulting session cookies — Server
  // Components can't do that.
  //
  // A code can only be redeemed once. If the first attempt already exchanged
  // it and then failed further down (e.g. the password was rejected), the
  // retry must reuse the session it created instead of burning the code
  // again — otherwise a recoverable error would force the user to request a
  // whole new link.
  const { data: existing } = await supabase.auth.getUser();

  if (!existing.user) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("exchangeCodeForSession failed:", exchangeError.message);
      redirect("/passwort-neu?invalid=1");
    }
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });

  if (updateError) {
    console.error("updateUser failed:", updateError.message);
    redirect(`/passwort-neu?code=${encodeURIComponent(code)}&error=${encodeURIComponent("Das Passwort konnte nicht gespeichert werden. Versuch es erneut.")}`);
  }

  redirect("/login?success=" + encodeURIComponent("Dein Passwort wurde geändert. Du kannst dich jetzt einloggen."));
}
