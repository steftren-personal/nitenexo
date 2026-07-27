import { createEvent } from "ics";
import { renderEmailShell } from "./email-template";
import { getSmtpConfig, sendMail } from "./mailer";

// Booking mails go out over plain SMTP (see lib/mailer.ts) — no vendor API, so
// the provider can be swapped through env vars alone.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ORGANIZER_EMAIL = process.env.SMTP_USER ?? "info@nitenexo.at";

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
    organizer: { name: "NiteNexo Solutions", email: ORGANIZER_EMAIL },
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
  // No SMTP configured (e.g. local dev without secrets) — skip silently, the
  // booking itself already succeeded.
  if (!getSmtpConfig()) return;

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

  const text = [
    `Dein Beratungstermin steht.`,
    ``,
    `Datum & Uhrzeit: ${datum}, ${uhrzeit} Uhr`,
    ``,
    `Zum Google Kalender hinzufügen:`,
    buildGoogleCalendarUrl(startsAt, endsAt),
    ``,
    `Nutzt du Apple Mail oder Outlook? Der Termin liegt zusätzlich als Kalenderdatei im Anhang.`,
  ].join("\n");

  await sendMail({
    to,
    subject: "Dein Termin ist bestätigt",
    text,
    html,
    attachments: ics
      ? [{ filename: "termin.ics", content: Buffer.from(ics), contentType: "text/calendar" }]
      : undefined,
  });
}

export async function sendCancellationEmail(to: string, startsAt: string) {
  if (!getSmtpConfig()) return;

  const datum = new Date(startsAt).toLocaleString("de-AT", { dateStyle: "full", timeStyle: "short" });

  const html = renderEmailShell({
    preheader: "Dein Beratungstermin wurde storniert.",
    eyebrow: "Termin storniert",
    heading: "Dein Termin wurde storniert.",
    bodyHtml: `Dein Beratungstermin am <strong>${datum}</strong> wurde storniert. Du kannst jederzeit einen neuen Termin buchen.`,
    ctaLabel: "Neuen Termin buchen",
    ctaHref: `${SITE_URL}/termine`,
  });

  const text = [
    `Dein Termin wurde storniert.`,
    ``,
    `Dein Beratungstermin am ${datum} wurde storniert.`,
    `Du kannst jederzeit einen neuen Termin buchen: ${SITE_URL}/termine`,
  ].join("\n");

  await sendMail({
    to,
    subject: "Dein Termin wurde storniert",
    text,
    html,
  });
}