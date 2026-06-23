import type { Metadata } from "next";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { createClient } from "@/lib/supabase/server";
import { SlotPicker } from "@/components/booking/SlotPicker";
import { AppointmentList } from "@/components/booking/AppointmentList";

export const metadata: Metadata = {
  title: "Termine — NiteNexo Solutions",
};

export default async function TerminePage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  const { data: slots } = await supabase
    .from("slots")
    .select("id, starts_at, ends_at")
    .eq("is_booked", false)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, status, slots ( starts_at, ends_at )")
    .eq("user_id", auth.user!.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <NavBar polarity="light" />
      <div style={{ background: "var(--surface-canvas-light)", color: "var(--ink)", minHeight: "100vh" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-xxl) var(--space-xl) var(--space-section)" }}>
          <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto var(--space-xxl)" }}>
            <Eyebrow polarity="light">Termine</Eyebrow>
            <h1 style={{ font: "var(--type-heading-xl)", fontSize: "clamp(30px, 4.4vw, 48px)", margin: "var(--space-md) 0 var(--space-md)" }}>
              Buch dir einen Beratungstermin.
            </h1>
            <p style={{ font: "var(--type-body-md)", color: "var(--color-accent-violet-mid)", margin: 0 }}>
              Wähl einen freien Slot — du bekommst sofort eine Bestätigung per E-Mail.
            </p>
          </div>

          <div
            className="bw-termine-grid"
            style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "var(--space-section)", alignItems: "start" }}
          >
            <SlotPicker slots={slots ?? []} />
            <AppointmentList appointments={appointments ?? []} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}