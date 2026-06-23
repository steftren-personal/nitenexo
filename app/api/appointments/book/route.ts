import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendBookingConfirmation } from "@/lib/email";

console.log("[api/appointments/book] handler loaded");

export async function POST(request: Request) {
  console.log("[api/appointments/book] request received");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    console.log("[api/appointments/book] rejected: no session");
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  const { slotId } = await request.json();
  if (!slotId) {
    return NextResponse.json({ error: "slotId fehlt." }, { status: 400 });
  }

  const { data: slot, error: slotError } = await supabase
    .from("slots")
    .select("id, starts_at, ends_at, is_booked")
    .eq("id", slotId)
    .single();

  if (slotError || !slot) {
    return NextResponse.json({ error: "Slot nicht gefunden." }, { status: 404 });
  }

  const { error: insertError } = await supabase
    .from("appointments")
    .insert({ user_id: auth.user.id, slot_id: slotId, status: "confirmed" });

  if (insertError) {
    const alreadyBooked = insertError.code === "23505";
    console.log("[api/appointments/book] insert failed", insertError.code);
    return NextResponse.json(
      { error: alreadyBooked ? "Slot bereits vergeben." : "Buchung fehlgeschlagen." },
      { status: alreadyBooked ? 409 : 500 }
    );
  }

  await createAdminClient().from("slots").update({ is_booked: true }).eq("id", slotId);

  if (auth.user.email) {
    await sendBookingConfirmation(auth.user.email, slot.starts_at, slot.ends_at);
  }

  console.log("[api/appointments/book] booking confirmed");
  return NextResponse.json({ ok: true });
}