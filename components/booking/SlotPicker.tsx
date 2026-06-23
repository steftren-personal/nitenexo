"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Slot = { id: string; starts_at: string; ends_at: string };

function formatSlot(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const date = start.toLocaleDateString("de-AT", { weekday: "short", day: "2-digit", month: "2-digit" });
  const time = `${start.toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })}–${end.toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })}`;
  return `${date}, ${time}`;
}

export function SlotPicker({ slots }: { slots: Slot[] }) {
  const router = useRouter();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const book = async (slotId: string) => {
    setBookingId(slotId);
    setError(null);

    const res = await fetch("/api/appointments/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId }),
    });
    const body = await res.json();

    setBookingId(null);
    if (!res.ok) {
      setError(body.error ?? "Buchung fehlgeschlagen.");
      router.refresh();
      return;
    }

    router.refresh();
  };

  return (
    <Card polarity="light">
      <div style={{ font: "var(--type-heading-sm)", marginBottom: "var(--space-lg)" }}>Freie Slots</div>

      {slots.length === 0 && (
        <p style={{ font: "var(--type-body-md)", color: "var(--color-accent-violet-mid)" }}>
          Aktuell sind keine Slots frei. Schau später nochmal vorbei oder schreib uns direkt.
        </p>
      )}

      {error && (
        <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)", marginBottom: "var(--space-md)" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
        {slots.map((slot) => (
          <div
            key={slot.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-md)",
              padding: "var(--space-md)",
              borderRadius: "var(--rounded-md)",
              border: "1px solid var(--hairline-cool)",
            }}
          >
            <span style={{ font: "var(--type-body-md)" }}>{formatSlot(slot.starts_at, slot.ends_at)}</span>
            <Button
              variant="primary"
              disabled={bookingId === slot.id}
              onClick={() => book(slot.id)}
              style={{ cursor: bookingId === slot.id ? "wait" : "pointer" }}
            >
              {bookingId === slot.id ? "Buche…" : "Buchen"}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}