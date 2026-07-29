import type { Metadata } from "next";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { BOOKING_TIMEZONE, BUSINESS_HOURS, CLOSED_WEEKDAYS, DURATIONS_MINUTES } from "@/lib/booking-config";

export const metadata: Metadata = {
  title: "Terminverwaltung — NiteNexo Solutions",
};

const WEEKDAY_NAMES = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/u/0/r?cid=info@nitenexo.at";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

// Slot management (app/api/admin/slots) is gone — availability now comes
// straight from the Google Calendar, so there is nothing left to administer
// on this page beyond pointing admins at that calendar.
export default function AdminTerminePage() {
  const openHours = `${pad(BUSINESS_HOURS.startHour)}:${pad(BUSINESS_HOURS.startMinute)}–${pad(BUSINESS_HOURS.endHour)}:${pad(BUSINESS_HOURS.endMinute)}`;
  const openDays = WEEKDAY_NAMES.filter((_, index) => !CLOSED_WEEKDAYS.includes(index));
  const closedDays = CLOSED_WEEKDAYS.map((day) => WEEKDAY_NAMES[day]).join(", ");

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

          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <Card polarity="dark">
              <div style={{ font: "var(--type-heading-sm)", marginBottom: "var(--space-lg)" }}>
                Termine laufen jetzt über den Google Kalender
              </div>
              <p style={{ font: "var(--type-body-md)", color: "var(--on-dark-muted)", marginBottom: "var(--space-lg)" }}>
                Es gibt keine Slot-Verwaltung mehr. Verfügbarkeit ergibt sich direkt aus dem Google Kalender von{" "}
                <strong style={{ color: "var(--on-primary)" }}>info@nitenexo.at</strong>: Was dort einen Eintrag hat,
                ist blockiert. Freie Zeiten innerhalb der Sprechzeiten sind automatisch für Kund:innen buchbar —
                Termine legt ihr also einfach direkt im Kalender an oder entfernt sie dort.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-xs)",
                  marginBottom: "var(--space-xl)",
                  padding: "var(--space-lg)",
                  borderRadius: "var(--rounded-md)",
                  border: "1px solid var(--hairline-violet)",
                }}
              >
                <div style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>Sprechzeiten</div>
                <div style={{ font: "var(--type-body-md)" }}>
                  {openDays.join(", ")}: {openHours} Uhr ({BOOKING_TIMEZONE.replace("Europe/", "")})
                </div>
                <div style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>
                  Geschlossen: {closedDays}
                </div>
                <div style={{ font: "var(--type-caption)", color: "var(--on-dark-muted)" }}>
                  Buchbare Termindauer: {DURATIONS_MINUTES.join(" oder ")} Minuten
                </div>
              </div>

              <a
                href={GOOGLE_CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  font: "var(--type-button-cap)",
                  letterSpacing: "var(--tracking-caps)",
                  textTransform: "uppercase",
                  color: "var(--on-primary)",
                  background: "var(--color-accent-violet-mid)",
                  padding: "var(--space-md) var(--space-lg)",
                  borderRadius: "var(--rounded-md)",
                  textDecoration: "none",
                }}
              >
                Google Kalender öffnen
              </a>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
