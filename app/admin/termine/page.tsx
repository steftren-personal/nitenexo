import type { Metadata } from "next";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { createAdminClient } from "@/lib/supabase/admin";
import { SlotForm } from "@/components/booking/SlotForm";
import { AdminSlotList } from "@/components/booking/AdminSlotList";

export const metadata: Metadata = {
  title: "Terminverwaltung — NiteNexo Solutions",
};

export const dynamic = "force-dynamic";

export default async function AdminTerminePage() {
  const admin = createAdminClient();

  const { data: slots } = await admin
    .from("slots")
    .select("id, starts_at, ends_at, is_booked")
    .order("starts_at", { ascending: true });

  const { data: appointments } = await admin
    .from("appointments")
    .select("id, slot_id, status, user_id, profiles ( full_name )")
    .eq("status", "confirmed");

  const bookingBySlot = new Map(
    (appointments ?? []).map((a) => [
      a.slot_id,
      { appointmentId: a.id, name: (a.profiles as unknown as { full_name: string } | null)?.full_name ?? "Unbekannt" },
    ])
  );

  return (
    <>
      <NavBar polarity="light" />
      <div style={{ background: "var(--surface-canvas-light)", color: "var(--ink)", minHeight: "100vh" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-xxl) var(--space-xl) var(--space-section)" }}>
          <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto var(--space-xxl)" }}>
            <Eyebrow polarity="light">Admin</Eyebrow>
            <h1 style={{ font: "var(--type-heading-xl)", fontSize: "clamp(30px, 4.4vw, 48px)", margin: "var(--space-md) 0 var(--space-md)" }}>
              Terminverwaltung.
            </h1>
          </div>

          <div
            className="bw-admin-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "var(--space-section)", alignItems: "start" }}
          >
            <SlotForm />
            <AdminSlotList
              slots={(slots ?? []).map((slot) => ({
                ...slot,
                booking: bookingBySlot.get(slot.id) ?? null,
              }))}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}