import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin-emails";

export async function GET() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  return NextResponse.json({
    loggedIn: !!auth.user,
    isAdmin: isAdminEmail(auth.user?.email),
  });
}