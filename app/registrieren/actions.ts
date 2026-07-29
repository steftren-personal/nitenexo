"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function register(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!fullName.trim()) {
    redirect(`/registrieren?error=${encodeURIComponent("Bitte gib deinen Namen an.")}`);
  }

  if (password.length < 8) {
    redirect(`/registrieren?error=${encodeURIComponent("Das Passwort muss mindestens 8 Zeichen lang sein.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    // Never let Supabase's raw message reach the page: "User already
    // registered" would let anyone probe which addresses have an account.
    // Only genuine input mistakes get a specific message; everything else
    // ends on the same confirmation screen as a successful sign-up.
    console.error("register: Supabase signUp error:", error.message);

    const message = error.message.toLowerCase();
    if (message.includes("email") && message.includes("valid")) {
      redirect(`/registrieren?error=${encodeURIComponent("Bitte gib eine gültige E-Mail-Adresse an.")}`);
    }
    if (message.includes("password")) {
      redirect(`/registrieren?error=${encodeURIComponent("Das Passwort erfüllt die Anforderungen nicht. Bitte wähle ein längeres.")}`);
    }
  }

  redirect("/registrieren/bestaetigen");
}
