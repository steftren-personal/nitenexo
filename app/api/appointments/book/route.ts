import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendBookingConfirmation } from "@/lib/email";
import { isSlotAvailable } from "@/lib/availability";
import { isValidDuration, type DurationMinutes } from "@/lib/booking-config";
import { createCalendarEvent } from "@/lib/google-calendar";

console.log("[api/appointments/book] handler loaded");

export async function POST(request: Request) {
  console.log("[api/appointments/book] request received");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    console.log("[api/appointments/book] rejected: no session");
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  const body = await request.json();
  const startIso: unknown = body?.startIso;
  const durationMinutes: unknown = body?.durationMinutes;
  const address: unknown = body?.address;

  if (typeof startIso !== "string" || Number.isNaN(new Date(startIso).getTime())) {
    return NextResponse.json({ error: "Ungültiger Zeitpunkt." }, { status: 400 });
  }
  if (!isValidDuration(durationMinutes)) {
    return NextResponse.json({ error: "Ungültige Termindauer." }, { status: 400 });
  }
  if (typeof address !== "string" || address.trim().length === 0) {
    return NextResponse.json({ error: "Adresse fehlt." }, { status: 400 });
  }

  const start = new Date(startIso);
  if (start.getTime() < Date.now()) {
    console.log("[api/appointments/book] rejected: start time in the past");
    return NextResponse.json({ error: "Der gewählte Zeitpunkt liegt in der Vergangenheit." }, { status: 400 });
  }

  // Never trust the browser — re-check against the real calendar right
  // before writing, so a stale UI or a race with another booking can't
  // create a double-booking.
  let stillAvailable: boolean;
  try {
    stillAvailable = await isSlotAvailable(startIso, durationMinutes as DurationMinutes);
  } catch (error) {
    console.log("[api/appointments/book] availability check failed", error);
    return NextResponse.json({ error: "Verfügbarkeit konnte nicht geprüft werden." }, { status: 500 });
  }

  if (!stillAvailable) {
    console.log("[api/appointments/book] rejected: slot no longer available");
    return NextResponse.json({ error: "Der gewählte Zeitpunkt ist nicht mehr verfügbar." }, { status: 409 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", auth.user.id)
    .single();

  const customerName = profile?.full_name || auth.user.email || "Unbekannt";
  const endIso = new Date(start.getTime() + (durationMinutes as DurationMinutes) * 60_000).toISOString();

  let event;
  try {
    event = await createCalendarEvent({
      summary: `Beratungstermin — ${customerName}`,
      description: [
        `Kunde: ${customerName}`,
        `Adresse: ${address.trim()}`,
        auth.user.email ? `E-Mail: ${auth.user.email}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      startIso: start.toISOString(),
      endIso,
      timeZone: "Europe/Vienna",
      privateProperties: {
        userId: auth.user.id,
        app: "nitenexo-termine",
      },
    });
  } catch (error) {
    console.log("[api/appointments/book] calendar create failed", error);
    return NextResponse.json({ error: "Termin konnte nicht angelegt werden." }, { status: 500 });
  }

  if (auth.user.email) {
    await sendBookingConfirmation(auth.user.email, start.toISOString(), endIso);
  }

  console.log("[api/appointments/book] booking confirmed", event.id);
  return NextResponse.json({ ok: true, eventId: event.id, startIso: start.toISOString(), endIso });
}
