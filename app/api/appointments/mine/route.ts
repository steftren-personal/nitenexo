import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listEventsForUser } from "@/lib/google-calendar";

console.log("[api/appointments/mine] handler loaded");

// How far back and forward we look for a user's own appointments.
const PAST_DAYS = 90;
const FUTURE_DAYS = 365;

type Appointment = {
  id: string;
  startIso: string;
  endIso: string;
  cancelled: boolean;
};

// Returns the caller's own appointments. Google filters on the private
// extended property, so nobody else's entries are ever fetched — and the
// response carries only times and status, never titles or descriptions.
export async function GET() {
  console.log("[api/appointments/mine] request received");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    console.log("[api/appointments/mine] rejected: no session");
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  const now = Date.now();
  const timeMin = new Date(now - PAST_DAYS * 864e5).toISOString();
  const timeMax = new Date(now + FUTURE_DAYS * 864e5).toISOString();

  try {
    const events = await listEventsForUser(auth.user.id, timeMin, timeMax);

    const appointments: Appointment[] = events.flatMap((event) => {
      // All-day entries have `date` instead of `dateTime` — those are never
      // bookings made through the site, so they are skipped.
      const startIso = event.start.dateTime;
      const endIso = event.end.dateTime;
      if (!startIso || !endIso) return [];

      return [{ id: event.id, startIso, endIso, cancelled: event.status === "cancelled" }];
    });

    console.log("[api/appointments/mine] done", appointments.length);
    return NextResponse.json({ appointments });
  } catch (error) {
    console.log("[api/appointments/mine] failed", error);
    return NextResponse.json({ error: "Termine konnten nicht geladen werden." }, { status: 500 });
  }
}
