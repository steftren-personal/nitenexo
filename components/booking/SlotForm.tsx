"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/ui/Button";

export function SlotForm() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    setSubmitting(true);
    setError(null);

    const startsAt = new Date(`${date}T${time}:00`);
    const endsAt = new Date(startsAt.getTime() + duration * 60_000);

    const res = await fetch("/api/admin/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString() }),
    });
    const body = await res.json();

    setSubmitting(false);
    if (!res.ok) {
      setError(body.error ?? "Konnte Slot nicht anlegen.");
      return;
    }

    setDate("");
    setTime("");
    router.refresh();
  };

  return (
    <Card polarity="light">
      <div style={{ font: "var(--type-heading-sm)", marginBottom: "var(--space-lg)" }}>Neuer Slot</div>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        <Field label="Datum">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </Field>
        <Field label="Uhrzeit">
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </Field>
        <Field label="Dauer (Minuten)">
          <Input
            type="number"
            min={15}
            step={15}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
          />
        </Field>
        {error && (
          <div style={{ font: "var(--type-caption)", color: "var(--color-accent-pink)" }}>{error}</div>
        )}
        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? "Lege an…" : "Slot anlegen"}
        </Button>
      </form>
    </Card>
  );
}