import type { Metadata } from "next";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TerminManager } from "@/components/booking/TerminManager";

export const metadata: Metadata = {
  title: "Termine — NiteNexo Solutions",
};

// Auth is enforced by middleware.ts (redirects to /login before this ever
// renders), and all booking data now comes from the Google Calendar-backed
// API routes, fetched client-side by TerminManager — so this page itself
// has nothing left to fetch.
export default function TerminePage() {
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
              Wähl Dauer, Tag und Uhrzeit — du bekommst sofort eine Bestätigung per E-Mail.
            </p>
          </div>

          <TerminManager />
        </div>
      </div>
      <Footer />
    </>
  );
}
