"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  await supabase.from("profiles").update({ full_name: fullName }).eq("id", auth.user.id);
  revalidatePath("/konto");
}

export async function changePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  if (password.length < 8) {
    redirect(`/konto?error=${encodeURIComponent("Das Passwort muss mindestens 8 Zeichen lang sein.")}`);
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    // Log the original Supabase error server-side for debugging, show a generic German message to the user
    console.error("changePassword: Supabase updateUser error:", error.message);
    redirect(`/konto?error=${encodeURIComponent("Passwort konnte nicht geändert werden. Bitte versuche es erneut.")}`);
  }
  redirect("/konto?passwordChanged=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}