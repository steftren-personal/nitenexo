// Central place for NiteNexo's booking rules. Change opening hours,
// durations, or buffer time here only — nothing else in the codebase
// should hard-code these values.

export const BOOKING_TIMEZONE = "Europe/Vienna";

// Business hours in Vienna local time, Monday–Saturday.
export const BUSINESS_HOURS = {
  startHour: 10,
  startMinute: 0,
  endHour: 18,
  endMinute: 0,
};

// JS Date#getUTCDay() indices (0 = Sunday .. 6 = Saturday) that are closed.
export const CLOSED_WEEKDAYS = [0];

// The two durations customers can pick, in minutes.
export const DURATIONS_MINUTES = [30, 60] as const;
export type DurationMinutes = (typeof DURATIONS_MINUTES)[number];

export function isValidDuration(value: unknown): value is DurationMinutes {
  return (
    typeof value === "number" &&
    (DURATIONS_MINUTES as readonly number[]).includes(value)
  );
}

// Buffer required immediately before AND after every appointment.
export const BUFFER_MINUTES = 15;

// Granularity of offered start times (every half hour, e.g. 10:00, 10:30, ...).
export const SLOT_STEP_MINUTES = 30;
