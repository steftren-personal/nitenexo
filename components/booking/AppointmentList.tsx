"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Appointment = {
  id: string;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  slots: { starts_at: string; ends_at: string } | { starts_at: string; ends_at: string }[] | null;
};

const STATUS_LABEL: Record<Appointment["status"], string> = {
  confirmed: "Bestätigt",
  cancelled: "Storniert",
  completed: "Abgeschlossen",
  no_show: "Nicht erschienen",
};

function getSlot(appointment: Appointment) {
  return Array.isArray(appointment.slots) ? appointment.slots[0] : appointment.slots;
}

export function AppointmentList({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cancel = async (appointmentId: string) => {
    setCancellingId(appointmentId);
    setError(null);

    const res = await fetch("/api/appointments/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId }),
    });
    const body = await res.json();

    setCancellingId(null);
    if (!res.ok) {
      setError(body.error ?? "Stornieren fehlgeschlagen.");
      return;
    }

    router.refresh();
  };

  return (
    <Card polarity="dark">
      <div style={{ font: "var(--type-heading-sm)", marginBottom: "var(--space-lg)" }}>Deine Termine</div>

      {error && (
        <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)", marginBottom: "var(--space-md)" }}>
          {error}
        </div>
      )}

      {appointments.length === 0 && (
        <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)" }}>
          Du hast noch keinen Termin gebucht.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
        {appointments.map((appointment) => {
          const slot = getSlot(appointment);
          if (!slot) return null;
          const start = new Date(slot.starts_at);
          const when = start.toLocaleString("de-AT", { dateStyle: "medium", timeStyle: "short" });

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
                <div style={{ font: "var(--type-body-md)" }}>{when}</div>
                <div style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>
                  {STATUS_LABEL[appointment.status]}
                </div>
              </div>
              {appointment.status === "confirmed" && (
                <Button
                  variant="ghost-on-dark"
                  disabled={cancellingId === appointment.id}
                  onClick={() => cancel(appointment.id)}
                  style={{ cursor: cancellingId === appointment.id ? "wait" : "pointer" }}
                >
                  {cancellingId === appointment.id ? "Storniere…" : "Stornieren"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}