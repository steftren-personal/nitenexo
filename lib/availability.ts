// Computes bookable start times for a given day, based on what's already
// on the Google Calendar. This is the piece most likely to break subtly —
// see the timezone and buffer notes below before changing anything.

import {
  BOOKING_TIMEZONE,
  BUSINESS_HOURS,
  BUFFER_MINUTES,
  CLOSED_WEEKDAYS,
  SLOT_STEP_MINUTES,
  type DurationMinutes,
} from "@/lib/booking-config";
import { listCalendarEvents, type GoogleCalendarEvent } from "@/lib/google-calendar";

export type TimeSlot = {
  startIso: string;
  endIso: string;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateString(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  // Reject e.g. 2026-02-30 — Date normalizes overflowing days/months instead
  // of erroring, so we check the round-trip matches.
  const check = new Date(Date.UTC(year, month - 1, day));
  return (
    check.getUTCFullYear() === year &&
    check.getUTCMonth() === month - 1 &&
    check.getUTCDate() === day
  );
}

function parseDateString(value: string): [number, number, number] {
  const [year, month, day] = value.split("-").map(Number);
  return [year, month, day];
}

// --- timezone helpers ---------------------------------------------------
//
// Vienna is UTC+1 in winter and UTC+2 in summer (CEST). We must never
// hard-code that offset — the switch date moves every year and getting it
// wrong silently shifts every appointment by an hour. Instead we ask the
// platform's IANA timezone database (via Intl) what the real offset is for
// the specific date in question.

// For a given UTC instant, what is the wall-clock offset of `timeZone`
// relative to UTC, in minutes?
function getTimeZoneOffsetMinutes(instant: Date, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = formatter.formatToParts(instant);
  const map: Record<string, string> = {};
  for (const part of parts) map[part.type] = part.value;

  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );
  return (asUtc - instant.getTime()) / 60_000;
}

// Converts a wall-clock date/time as observed in `timeZone` into the
// correct UTC instant. Resolves the offset twice so it's correct even right
// at a DST transition (the offset near the target instant can differ from
// the offset at our first guess).
function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const offset1 = getTimeZoneOffsetMinutes(guess, timeZone);
  let utc = new Date(guess.getTime() - offset1 * 60_000);
  const offset2 = getTimeZoneOffsetMinutes(utc, timeZone);
  if (offset2 !== offset1) {
    utc = new Date(guess.getTime() - offset2 * 60_000);
  }
  return utc;
}

// The inverse: given a UTC instant, what are its wall-clock date parts in
// `timeZone`? Used to figure out which Vienna calendar day an ISO instant
// falls on (e.g. when re-validating a booking request).
export function getZonedDateParts(
  instant: Date,
  timeZone: string
): { year: number; month: number; day: number; hour: number; minute: number } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = formatter.formatToParts(instant);
  const map: Record<string, string> = {};
  for (const part of parts) map[part.type] = part.value;
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
  };
}

// Day-of-week is intrinsic to a Gregorian calendar date and does not depend
// on timezone — 0 = Sunday .. 6 = Saturday, matching Date#getUTCDay().
function getWeekday(year: number, month: number, day: number): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

// --- busy interval computation ------------------------------------------

type BusyInterval = { start: number; end: number };

// Turns a calendar event into the time range (epoch ms) it blocks,
// including the 15-minute buffer before and after. Returns null for events
// that don't block anything (cancelled) or that can't be interpreted.
function timedEventToBusyInterval(event: GoogleCalendarEvent): BusyInterval | null {
  if (!event.start.dateTime || !event.end.dateTime) return null;
  const start = new Date(event.start.dateTime).getTime() - BUFFER_MINUTES * 60_000;
  const end = new Date(event.end.dateTime).getTime() + BUFFER_MINUTES * 60_000;
  return { start, end };
}

/**
 * Returns the bookable start/end times for one Vienna calendar day.
 *
 * Rules applied (see task spec for the reasoning):
 * - Sunday (and any other configured closed weekday) → no slots.
 * - Only within business hours (10:00–18:00 Vienna time).
 * - Every existing, non-cancelled event blocks its own time plus a
 *   15-minute buffer on both sides.
 * - An all-day event blocks the entire day.
 * - Cancelled events (status: "cancelled") never block anything.
 * - Times that have already passed (relative to the real current time)
 *   are never returned, including "today, but earlier than now".
 */
export async function getAvailableSlots(
  dateStr: string,
  durationMinutes: DurationMinutes
): Promise<TimeSlot[]> {
  if (!isValidDateString(dateStr)) {
    throw new Error(`Invalid date string, expected YYYY-MM-DD: ${dateStr}`);
  }

  const [year, month, day] = parseDateString(dateStr);

  if (CLOSED_WEEKDAYS.includes(getWeekday(year, month, day))) {
    return [];
  }

  const businessStart = zonedTimeToUtc(
    year, month, day,
    BUSINESS_HOURS.startHour, BUSINESS_HOURS.startMinute,
    BOOKING_TIMEZONE
  );
  const businessEnd = zonedTimeToUtc(
    year, month, day,
    BUSINESS_HOURS.endHour, BUSINESS_HOURS.endMinute,
    BOOKING_TIMEZONE
  );

  // Fetch a full day of margin on each side — enough to catch buffer
  // overlap from an event that starts just before/after business hours,
  // and enough to see all-day events (which use exclusive `date` ranges).
  const fetchFrom = new Date(businessStart.getTime() - 24 * 60 * 60_000);
  const fetchTo = new Date(businessEnd.getTime() + 24 * 60 * 60_000);

  const events = await listCalendarEvents(fetchFrom.toISOString(), fetchTo.toISOString());

  const busyIntervals: BusyInterval[] = [];

  for (const event of events) {
    if (event.status === "cancelled") continue; // never blocks

    if (event.start.date && event.end.date) {
      // All-day event. `end.date` is exclusive per the Google Calendar API.
      const [sy, sm, sd] = event.start.date.split("-").map(Number);
      const [ey, em, ed] = event.end.date.split("-").map(Number);
      const allDayStart = zonedTimeToUtc(sy, sm, sd, 0, 0, BOOKING_TIMEZONE).getTime();
      const allDayEnd = zonedTimeToUtc(ey, em, ed, 0, 0, BOOKING_TIMEZONE).getTime();
      if (allDayStart < businessEnd.getTime() && allDayEnd > businessStart.getTime()) {
        return []; // the whole day is blocked
      }
      continue;
    }

    const interval = timedEventToBusyInterval(event);
    if (interval) busyIntervals.push(interval);
  }

  const now = Date.now();
  const durationMs = durationMinutes * 60_000;
  const stepMs = SLOT_STEP_MINUTES * 60_000;
  const slots: TimeSlot[] = [];

  for (
    let candidateStart = businessStart.getTime();
    candidateStart + durationMs <= businessEnd.getTime();
    candidateStart += stepMs
  ) {
    if (candidateStart < now) continue; // no slots in the past, including "today, earlier today"

    const candidateEnd = candidateStart + durationMs;
    const overlapsBusy = busyIntervals.some(
      (busy) => candidateStart < busy.end && candidateEnd > busy.start
    );
    if (overlapsBusy) continue;

    slots.push({
      startIso: new Date(candidateStart).toISOString(),
      endIso: new Date(candidateEnd).toISOString(),
    });
  }

  return slots;
}

/**
 * Re-checks whether one specific start time is still bookable. Used by the
 * booking route to guard against stale client data and race conditions —
 * never trust that a browser-supplied time is actually free.
 */
export async function isSlotAvailable(
  startIso: string,
  durationMinutes: DurationMinutes
): Promise<boolean> {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return false;
  if (start.getTime() < Date.now()) return false;

  const zoned = getZonedDateParts(start, BOOKING_TIMEZONE);
  const dateStr = `${zoned.year}-${String(zoned.month).padStart(2, "0")}-${String(zoned.day).padStart(2, "0")}`;

  const slots = await getAvailableSlots(dateStr, durationMinutes);
  return slots.some((slot) => slot.startIso === start.toISOString());
}

// Exported for the throwaway verification script only.
export const __internal = { zonedTimeToUtc, getTimeZoneOffsetMinutes };
