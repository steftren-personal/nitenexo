"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import {
  BOOKING_TIMEZONE,
  CLOSED_WEEKDAYS,
  DURATIONS_MINUTES,
  type DurationMinutes,
} from "@/lib/booking-config";

type TimeSlot = { startIso: string; endIso: string };

type DayOption = {
  dateStr: string; // YYYY-MM-DD, keyed to the Vienna calendar date
  label: string;
  closed: boolean;
};

const DAY_COUNT = 14;

// Vienna's current calendar date as {year, month, day}. The day list and the
// availability lookups both key off this, not the visitor's local date, so a
// customer browsing from abroad still sees the days NiteNexo is actually open.
function getViennaTodayParts(): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const map: Record<string, string> = {};
  for (const part of parts) map[part.type] = part.value;
  return { year: Number(map.year), month: Number(map.month), day: Number(map.day) };
}

function buildDayOptions(): DayOption[] {
  const today = getViennaTodayParts();
  const anchor = new Date(Date.UTC(today.year, today.month - 1, today.day));
  const days: DayOption[] = [];

  for (let i = 0; i < DAY_COUNT; i++) {
    // Calendar-date arithmetic in UTC-as-a-canvas — weekday is intrinsic to
    // the Gregorian date and doesn't depend on timezone (matches the
    // approach lib/availability.ts uses for the same reason).
    const d = new Date(anchor.getTime() + i * 86_400_000);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    const weekday = d.getUTCDay();
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const label = d.toLocaleDateString("de-AT", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      timeZone: "UTC",
    });
    days.push({ dateStr, label, closed: CLOSED_WEEKDAYS.includes(weekday) });
  }

  return days;
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("de-AT", {
    timeZone: BOOKING_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

// Dark-polarity chips: lime fill marks the selection (ink text for contrast),
// closed/disabled days stay muted with a strikethrough so they read as taken.
const chipStyle = (active: boolean, disabled = false): React.CSSProperties => ({
  font: "var(--type-body-md)",
  padding: "var(--space-sm) var(--space-md)",
  borderRadius: "var(--rounded-md)",
  border: active ? "1px solid var(--color-accent-lime)" : "1px solid var(--hairline-violet)",
  background: active ? "var(--color-accent-lime)" : "transparent",
  color: disabled ? "var(--on-dark-muted)" : active ? "var(--color-ink-deep)" : "var(--on-primary)",
  cursor: disabled ? "not-allowed" : "pointer",
  textDecoration: disabled ? "line-through" : "none",
});

export function BookingFlow({ onBooked }: { onBooked: () => void }) {
  const days = useMemo(buildDayOptions, []);
  const [duration, setDuration] = useState<DurationMinutes>(DURATIONS_MINUTES[0]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);
  const [bookSuccess, setBookSuccess] = useState<string | null>(null);

  // Re-fetch whenever the chosen day or duration changes — a 60-minute day
  // has fewer open times than a 30-minute one, so stale results would lie.
  useEffect(() => {
    if (!selectedDate) return;

    const day = days.find((d) => d.dateStr === selectedDate);
    if (day?.closed) {
      setSlots([]);
      setSlotsError(null);
      setLoadingSlots(false);
      return;
    }

    let cancelled = false;
    setLoadingSlots(true);
    setSlotsError(null);
    setSelectedStart(null);

    fetch(`/api/appointments/availability?date=${selectedDate}&duration=${duration}`)
      .then(async (res) => {
        const body = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setSlotsError(body.error ?? "Freie Zeiten konnten nicht geladen werden.");
          setSlots(null);
          return;
        }
        setSlots(body.slots ?? []);
      })
      .catch(() => {
        if (!cancelled) setSlotsError("Freie Zeiten konnten nicht geladen werden.");
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, duration, days]);

  const selectDuration = (value: DurationMinutes) => {
    setDuration(value);
    setBookSuccess(null);
  };

  const selectDay = (dateStr: string) => {
    setSelectedDate(dateStr);
    setBookSuccess(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStart || !address.trim()) return;

    setBooking(true);
    setBookError(null);
    setBookSuccess(null);

    const res = await fetch("/api/appointments/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startIso: selectedStart, durationMinutes: duration, address: address.trim() }),
    });
    const body = await res.json();

    setBooking(false);
    if (!res.ok) {
      setBookError(body.error ?? "Buchung fehlgeschlagen.");
      return;
    }

    setBookSuccess("Termin gebucht — du bekommst gleich eine Bestätigung per E-Mail.");
    setSelectedStart(null);
    setAddress("");
    onBooked();

    // The just-booked time is now taken — refresh so it disappears from the
    // list immediately instead of only after a manual reload.
    if (selectedDate) {
      setLoadingSlots(true);
      try {
        const refreshed = await fetch(`/api/appointments/availability?date=${selectedDate}&duration=${duration}`);
        const refreshedBody = await refreshed.json();
        if (refreshed.ok) setSlots(refreshedBody.slots ?? []);
      } finally {
        setLoadingSlots(false);
      }
    }
  };

  return (
    <Card polarity="dark">
      <div style={{ font: "var(--type-heading-sm)", marginBottom: "var(--space-lg)" }}>Termin buchen</div>

      <div style={{ marginBottom: "var(--space-xl)" }}>
        <div
          style={{
            font: "var(--type-caption)",
            color: "var(--color-accent-violet-mid)",
            marginBottom: "var(--space-sm)",
          }}
        >
          1. Dauer wählen
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          {DURATIONS_MINUTES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => selectDuration(value)}
              style={chipStyle(duration === value)}
            >
              {value} Minuten
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "var(--space-xl)" }}>
        <div
          style={{
            font: "var(--type-caption)",
            color: "var(--color-accent-violet-mid)",
            marginBottom: "var(--space-sm)",
          }}
        >
          2. Tag wählen
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
          {days.map((day) => (
            <button
              key={day.dateStr}
              type="button"
              disabled={day.closed}
              onClick={() => selectDay(day.dateStr)}
              title={day.closed ? "Sonntags geschlossen" : undefined}
              style={chipStyle(selectedDate === day.dateStr, day.closed)}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div
            style={{
              font: "var(--type-caption)",
              color: "var(--on-dark-muted)",
              marginBottom: "var(--space-sm)",
            }}
          >
            3. Uhrzeit wählen
          </div>

          {loadingSlots && <p style={{ font: "var(--type-body-md)" }}>Lade freie Zeiten…</p>}

          {!loadingSlots && slotsError && (
            <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)" }}>{slotsError}</div>
          )}

          {!loadingSlots && !slotsError && slots && slots.length === 0 && (
            <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)" }}>
              An diesem Tag ist nichts mehr frei. Wähl einen anderen Tag.
            </p>
          )}

          {!loadingSlots && !slotsError && slots && slots.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
              {slots.map((slot) => (
                <button
                  key={slot.startIso}
                  type="button"
                  onClick={() => setSelectedStart(slot.startIso)}
                  style={chipStyle(selectedStart === slot.startIso)}
                >
                  {formatTime(slot.startIso)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedStart && (
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <div
            style={{
              font: "var(--type-caption)",
              color: "var(--on-dark-muted)",
            }}
          >
            4. Adresse angeben
          </div>
          <Field label="Adresse" polarity="dark">
            <Input
              polarity="dark"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Straße, Hausnummer, PLZ, Ort"
              required
            />
          </Field>

          {bookError && <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)" }}>{bookError}</div>}

          <Button variant="inverted" type="submit" disabled={booking || !address.trim()}>
            {booking ? "Buche…" : "Termin buchen"}
          </Button>
        </form>
      )}

      {bookSuccess && (
        <div style={{ font: "var(--type-caption)", color: "var(--color-accent-lime)", marginTop: "var(--space-md)" }}>
          {bookSuccess}
        </div>
      )}
    </Card>
  );
}
