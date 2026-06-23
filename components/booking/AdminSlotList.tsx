"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Slot = {
  id: string;
  starts_at: string;
  ends_at: string;
  is_booked: boolean;
  booking: { appointmentId: string; name: string } | null;
};

export function AdminSlotList({ slots }: { slots: Slot[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const remove = async (slotId: string) => {
    setDeletingId(slotId);
    setError(null);

    const res = await fetch("/api/admin/slots", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId }),
    });
    const body = await res.json();

    setDeletingId(null);
    if (!res.ok) {
      setError(body.error ?? "Konnte Slot nicht löschen.");
      return;
    }
    router.refresh();
  };

  return (
    <Card polarity="dark">
      <div style={{ font: "var(--type-heading-sm)", marginBottom: "var(--space-lg)" }}>Alle Slots</div>

      {error && (
        <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)", marginBottom: "var(--space-md)" }}>
          {error}
        </div>
      )}

      {slots.length === 0 && (
        <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)" }}>Noch keine Slots angelegt.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
        {slots.map((slot) => {
          const start = new Date(slot.starts_at);
          const end = new Date(slot.ends_at);
          const when = `${start.toLocaleDateString("de-AT", { weekday: "short", day: "2-digit", month: "2-digit" })}, ${start.toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })}–${end.toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })}`;

          return (
            <div
              key={slot.id}
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
                  {slot.booking ? `Gebucht von ${slot.booking.name}` : "Frei"}
                </div>
              </div>
              {!slot.is_booked && (
                <Button
                  variant="ghost-on-dark"
                  disabled={deletingId === slot.id}
                  onClick={() => remove(slot.id)}
                  style={{ cursor: deletingId === slot.id ? "wait" : "pointer" }}
                >
                  {deletingId === slot.id ? "Lösche…" : "Löschen"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}