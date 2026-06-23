import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin-emails";

console.log("[api/admin/slots] handler loaded");

export async function POST(request: Request) {
  console.log("[api/admin/slots] request received");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!isAdminEmail(auth.user?.email)) {
    console.log("[api/admin/slots] rejected: not an admin");
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }

  const { startsAt, endsAt } = await request.json();
  if (!startsAt || !endsAt) {
    return NextResponse.json({ error: "startsAt und endsAt sind erforderlich." }, { status: 400 });
  }

  const { error } = await createAdminClient()
    .from("slots")
    .insert({ starts_at: startsAt, ends_at: endsAt });

  if (error) {
    console.log("[api/admin/slots] insert failed", error.message);
    return NextResponse.json({ error: "Slot konnte nicht angelegt werden." }, { status: 500 });
  }

  console.log("[api/admin/slots] slot created");
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!isAdminEmail(auth.user?.email)) {
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }

  const { slotId } = await request.json();
  if (!slotId) {
    return NextResponse.json({ error: "slotId fehlt." }, { status: 400 });
  }

  const { error } = await createAdminClient().from("slots").delete().eq("id", slotId).eq("is_booked", false);

  if (error) {
    return NextResponse.json({ error: "Slot konnte nicht gelöscht werden." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}