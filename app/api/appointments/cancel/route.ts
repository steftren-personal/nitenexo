import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendCancellationEmail } from "@/lib/email";

console.log("[api/appointments/cancel] handler loaded");

export async function POST(request: Request) {
  console.log("[api/appointments/cancel] request received");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  const { appointmentId } = await request.json();
  if (!appointmentId) {
    return NextResponse.json({ error: "appointmentId fehlt." }, { status: 400 });
  }

  const { data: appointment, error: fetchError } = await supabase
    .from("appointments")
    .select("id, slot_id, status, slots ( starts_at )")
    .eq("id", appointmentId)
    .eq("user_id", auth.user.id)
    .single();

  if (fetchError || !appointment) {
    return NextResponse.json({ error: "Termin nicht gefunden." }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", appointmentId)
    .eq("user_id", auth.user.id);

  if (updateError) {
    console.log("[api/appointments/cancel] update failed", updateError.message);
    return NextResponse.json({ error: "Stornieren fehlgeschlagen." }, { status: 500 });
  }

  await createAdminClient().from("slots").update({ is_booked: false }).eq("id", appointment.slot_id);

  const startsAt = (appointment.slots as unknown as { starts_at: string } | null)?.starts_at;
  if (auth.user.email && startsAt) {
    await sendCancellationEmail(auth.user.email, startsAt);
  }

  console.log("[api/appointments/cancel] cancellation confirmed");
  return NextResponse.json({ ok: true });
}