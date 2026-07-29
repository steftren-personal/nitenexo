"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BOOKING_TIMEZONE } from "@/lib/booking-config";

type Appointment = {
  id: string;
  startIso: string;
  endIso: string;
  cancelled: boolean;
};

const dateFormatter = new Intl.DateTimeFormat("de-AT", {
  timeZone: BOOKING_TIMEZONE,
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("de-AT", {
  timeZone: BOOKING_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
});

function formatWhen(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  return `${dateFormatter.format(start)}, ${timeFormatter.format(start)}–${timeFormatter.format(end)}`;
}

// `refreshToken` is bumped by the parent after a successful booking, so this
// list re-fetches without the caller needing to know our internal state.
export function AppointmentList({ refreshToken }: { refreshToken: number }) {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/appointments/mine");
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Termine konnten nicht geladen werden.");
        setAppointments(null);
        return;
      }
      setAppointments(body.appointments ?? []);
    } catch {
      setError("Termine konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshToken]);

  const cancel = async (appointment: Appointment) => {
    // A misclick must never cancel a real appointment — confirm first.
    const confirmed = window.confirm(
      `Termin am ${formatWhen(appointment.startIso, appointment.endIso)} wirklich absagen?`
    );
    if (!confirmed) return;

    setCancellingId(appointment.id);
    setCancelError(null);

    const res = await fetch("/api/appointments/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: appointment.id }),
    });
    const body = await res.json();

    setCancellingId(null);
    if (!res.ok) {
      setCancelError(body.error ?? "Stornieren fehlgeschlagen.");
      return;
    }

    await load();
  };

  const now = Date.now();
  const upcoming = (appointments ?? [])
    .filter((a) => new Date(a.startIso).getTime() >= now)
    .sort((a, b) => new Date(a.startIso).getTime() - new Date(b.startIso).getTime());
  const past = (appointments ?? [])
    .filter((a) => new Date(a.startIso).getTime() < now)
    .sort((a, b) => new Date(b.startIso).getTime() - new Date(a.startIso).getTime());

  const renderRow = (appointment: Appointment) => {
    const isUpcoming = new Date(appointment.startIso).getTime() >= now;
    return (
      <div
        key={appointment.id}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-md)",
          padding: "var(--space-md)",
          borderRadius: "var(--rounded-md)",
          border: "1px solid var(--hairline-violet)",
        }}
      >
        <div>
          <div style={{ font: "var(--type-body-md)" }}>{formatWhen(appointment.startIso, appointment.endIso)}</div>
          <div
            style={{
              font: "var(--type-caption)",
              color: appointment.cancelled ? "var(--color-accent-pink)" : "var(--on-dark-muted)",
            }}
          >
            {appointment.cancelled ? "Abgesagt" : "Bestätigt"}
          </div>
        </div>
        {isUpcoming && !appointment.cancelled && (
          <Button
            variant="ghost-on-dark"
            disabled={cancellingId === appointment.id}
            onClick={() => cancel(appointment)}
            style={{ cursor: cancellingId === appointment.id ? "wait" : "pointer" }}
          >
            {cancellingId === appointment.id ? "Storniere…" : "Stornieren"}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card polarity="dark">
      <div style={{ font: "var(--type-heading-sm)", marginBottom: "var(--space-lg)" }}>Deine Termine</div>

      {loading && <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)" }}>Lade deine Termine…</p>}

      {!loading && error && (
        <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)" }}>{error}</div>
      )}

      {cancelError && (
        <div
          style={{
            font: "var(--type-caption)",
            color: "var(--color-accent-pink)",
            marginBottom: "var(--space-md)",
          }}
        >
          {cancelError}
        </div>
      )}

      {!loading && !error && appointments && appointments.length === 0 && (
        <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)" }}>
          Du hast noch keinen Termin gebucht.
        </p>
      )}

      {!loading && !error && upcoming.length > 0 && (
        <div style={{ marginBottom: past.length > 0 ? "var(--space-xl)" : 0 }}>
          <div style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)", marginBottom: "var(--space-sm)" }}>
            Kommend
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            {upcoming.map(renderRow)}
          </div>
        </div>
      )}

      {!loading && !error && past.length > 0 && (
        <div>
          <div style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)", marginBottom: "var(--space-sm)" }}>
            Vergangen
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>{past.map(renderRow)}</div>
        </div>
      )}
    </Card>
  );
}
