import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendCancellationEmail } from "@/lib/email";
import { getCalendarEvent, updateCalendarEvent } from "@/lib/google-calendar";

console.log("[api/appointments/cancel] handler loaded");

const CANCELLED_PREFIX = "ABGESAGT: ";

export async function POST(request: Request) {
  console.log("[api/appointments/cancel] request received");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    console.log("[api/appointments/cancel] rejected: no session");
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  const { eventId } = await request.json();
  if (typeof eventId !== "string" || eventId.length === 0) {
    return NextResponse.json({ error: "eventId fehlt." }, { status: 400 });
  }

  let event;
  try {
    event = await getCalendarEvent(eventId);
  } catch (error) {
    console.log("[api/appointments/cancel] lookup failed", error);
    return NextResponse.json({ error: "Termin konnte nicht geladen werden." }, { status: 500 });
  }

  if (!event) {
    return NextResponse.json({ error: "Termin nicht gefunden." }, { status: 404 });
  }

  // Ownership check: the user id is stored on the event's private extended
  // properties at booking time (see app/api/appointments/book/route.ts).
  // That property is never shown in the Google Calendar UI, so it's a safe
  // place to keep the Supabase user id without leaking it to anyone who
  // can see the calendar. A user may only cancel their own appointment.
  const ownerId = event.extendedProperties?.private?.userId;
  if (ownerId !== auth.user.id) {
    console.log("[api/appointments/cancel] rejected: not the owner");
    return NextResponse.json({ error: "Kein Zugriff auf diesen Termin." }, { status: 403 });
  }

  if (event.status === "cancelled") {
    return NextResponse.json({ error: "Termin ist bereits storniert." }, { status: 409 });
  }

  const alreadyPrefixed = event.summary?.startsWith(CANCELLED_PREFIX);
  const newSummary = alreadyPrefixed ? event.summary! : `${CANCELLED_PREFIX}${event.summary ?? ""}`;

  try {
    await updateCalendarEvent(eventId, { summary: newSummary, status: "cancelled" });
  } catch (error) {
    console.log("[api/appointments/cancel] update failed", error);
    return NextResponse.json({ error: "Stornieren fehlgeschlagen." }, { status: 500 });
  }

  const startsAt = event.start.dateTime ?? event.start.date;
  if (auth.user.email && startsAt) {
    await sendCancellationEmail(auth.user.email, startsAt);
  }

  console.log("[api/appointments/cancel] cancellation confirmed", eventId);
  return NextResponse.json({ ok: true });
}
