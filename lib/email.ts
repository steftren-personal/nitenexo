import { Resend } from "resend";
import { createEvent } from "ics";
import { renderEmailShell } from "./email-template";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Resend's shared test domain — works without DNS setup, but only delivers to
// the email address used to sign up for Resend. Switch to a verified
// @nitenexo.at address (via EMAIL_FROM) once the domain is bought and hosted.
const FROM = process.env.EMAIL_FROM ?? "NiteNexo Solutions <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function buildIcs(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const { value } = createEvent({
    title: "Beratungstermin — NiteNexo Solutions",
    description: "Dein Beratungstermin mit NiteNexo Solutions.",
    start: [start.getUTCFullYear(), start.getUTCMonth() + 1, start.getUTCDate(), start.getUTCHours(), start.getUTCMinutes()],
    end: [end.getUTCFullYear(), end.getUTCMonth() + 1, end.getUTCDate(), end.getUTCHours(), end.getUTCMinutes()],
    startInputType: "utc",
    endInputType: "utc",
    organizer: { name: "NiteNexo Solutions", email: "stef.tren@gmail.com" },
  });
  return value;
}

// One-click "add to calendar" for Google Calendar — opens pre-filled, no
// download/import step. The .ics attachment covers Apple/Outlook instead.
function buildGoogleCalendarUrl(startsAt: string, endsAt: string) {
  const toGoogleStamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Beratungstermin — NiteNexo Solutions",
    dates: `${toGoogleStamp(startsAt)}/${toGoogleStamp(endsAt)}`,
    details: "Beratungstermin mit NiteNexo Solutions.",
    location: "Schumanngasse 9/13, 1180 Wien",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export async function sendBookingConfirmation(to: string, startsAt: string, endsAt: string) {
  if (!resend) return;

  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const datum = start.toLocaleDateString("de-AT", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
  const uhrzeit = `${start.toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })}–${end.toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })}`;

  const html = renderEmailShell({
    preheader: "Dein Beratungstermin mit NiteNexo Solutions ist bestätigt.",
    eyebrow: "Termin bestätigt",
    heading: "Dein Beratungstermin steht.",
    bodyHtml: "Dein Termin mit NiteNexo Solutions ist fix. Wir freuen uns auf das Gespräch.",
    cardHtml: `<p style="margin:0 0 4px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#79628c;">Datum &amp; Uhrzeit</p>
               <p style="margin:0; font-size:18px; font-weight:600; color:#150f23;">${datum}, ${uhrzeit} Uhr</p>`,
    ctaLabel: "Zum Google Kalender hinzufügen",
    ctaHref: buildGoogleCalendarUrl(startsAt, endsAt),
    footerNote: "Nutzt du Apple Mail oder Outlook? Der Termin liegt zusätzlich als Kalenderdatei im Anhang.",
  });

  const ics = buildIcs(startsAt, endsAt);

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Dein Termin ist bestätigt",
    html,
    attachments: ics ? [{ filename: "termin.ics", content: Buffer.from(ics) }] : undefined,
  });
}

export async function sendCancellationEmail(to: string, startsAt: string) {
  if (!resend) return;

  const datum = new Date(startsAt).toLocaleString("de-AT", { dateStyle: "full", timeStyle: "short" });

  const html = renderEmailShell({
    preheader: "Dein Beratungstermin wurde storniert.",
    eyebrow: "Termin storniert",
    heading: "Dein Termin wurde storniert.",
    bodyHtml: `Dein Beratungstermin am <strong>${datum}</strong> wurde storniert. Du kannst jederzeit einen neuen Termin buchen.`,
    ctaLabel: "Neuen Termin buchen",
    ctaHref: `${SITE_URL}/termine`,
  });

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Dein Termin wurde storniert",
    html,
  });
}