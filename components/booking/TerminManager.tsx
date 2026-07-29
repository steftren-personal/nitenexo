"use client";

import React, { useCallback, useState } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { AppointmentList } from "@/components/booking/AppointmentList";

// Orchestrates the booking flow and the customer's appointment list: booking
// a new appointment bumps `refreshToken` so the list re-fetches and shows
// the new entry without a full page reload.
export function TerminManager() {
  const [refreshToken, setRefreshToken] = useState(0);
  const bump = useCallback(() => setRefreshToken((n) => n + 1), []);

  return (
    <div
      className="bw-termine-grid"
      style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "var(--space-section)", alignItems: "start" }}
    >
      <BookingFlow onBooked={bump} />
      <AppointmentList refreshToken={refreshToken} />
    </div>
  );
}
