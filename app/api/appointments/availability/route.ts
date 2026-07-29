import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAvailableSlots, isValidDateString } from "@/lib/availability";
import { isValidDuration } from "@/lib/booking-config";

console.log("[api/appointments/availability] handler loaded");

// Returns bookable start times for one day. Only free/busy information is
// ever returned — never the title, attendees, or any other detail of
// existing calendar entries (explicit customer requirement).
export async function GET(request: Request) {
  console.log("[api/appointments/availability] request received");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    console.log("[api/appointments/availability] rejected: no session");
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? "";
  const durationParam = Number(searchParams.get("duration"));

  if (!isValidDateString(date)) {
    return NextResponse.json({ error: "Ungültiges Datum." }, { status: 400 });
  }
  if (!isValidDuration(durationParam)) {
    return NextResponse.json({ error: "Ungültige Termindauer." }, { status: 400 });
  }

  try {
    const slots = await getAvailableSlots(date, durationParam);
    console.log("[api/appointments/availability] done", date, durationParam, slots.length);
    return NextResponse.json({ date, durationMinutes: durationParam, slots });
  } catch (error) {
    console.log("[api/appointments/availability] failed", error);
    return NextResponse.json({ error: "Freie Zeiten konnten nicht geladen werden." }, { status: 500 });
  }
}
