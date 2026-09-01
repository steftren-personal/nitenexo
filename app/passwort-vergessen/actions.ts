"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "");

  // Note: the Supabase email template (email-templates/supabase-passwort-zuruecksetzen.html)
  // now builds its own link straight to /auth/confirm and no longer reads
  // {{ .ConfirmationURL }} or {{ .RedirectTo }} — see app/auth/confirm/route.ts
  // for why. `redirectTo` below has no effect on that template, but it's kept
  // as a harmless fallback in case the dashboard still has the old template
  // pasted in (e.g. right after this change, before someone updates it).
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const redirectTo = `${siteUrl}/passwort-neu`;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  // Never reveal whether the address exists — log server-side only, show the
  // same success message no matter what happened.
  if (error) {
    console.error("resetPasswordForEmail failed:", error.message);
  }

  redirect("/passwort-vergessen?sent=1");
}
