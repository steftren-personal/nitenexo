import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin-emails";

/**
 * Wer bin ich? Antwortet nur ueber den eigenen Nutzer und nur mit dem, was die
 * Oberflaeche wirklich braucht: Anmeldestatus, Adminrolle und — damit das
 * Kontaktformular nicht abtippen laesst, was das Konto schon weiss — Name und
 * E-Mail. Keine fremden Daten, kein Profil anderer Nutzer.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) {
    return NextResponse.json({ loggedIn: false, isAdmin: false });
  }

  // Der Name steht im Profil (von der Registrierung per Trigger befuellt);
  // die user_metadata ist der Rueckfall, falls die Zeile noch fehlt.
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const fullName =
    profile?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? "";

  return NextResponse.json({
    loggedIn: true,
    isAdmin: isAdminEmail(user.email),
    email: user.email ?? "",
    fullName,
  });
}
