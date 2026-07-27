import { NextResponse, type NextRequest } from "next/server";
import { getSmtpConfig, sendMail } from "@/lib/mailer";
import { renderEmailShell, escapeHtml } from "@/lib/email-template";

// Simple in-memory rate limit: max 3 requests per IP per 10 minutes.
// Good enough on Vercel (per-instance), backed up by the honeypot below.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

type ContactPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  service?: string;
  message?: string;
  consent?: boolean;
  website?: string; // honeypot — real users never fill this
};

const MAX_LEN = { name: 100, email: 200, company: 200, service: 100, message: 5000 };

function validate(p: ContactPayload): string | null {
  if (p.website) return "spam"; // honeypot tripped
  if (!p.consent) return "Bitte stimme der Datenschutzerklärung zu.";
  if (!p.firstName?.trim() || !p.lastName?.trim()) return "Bitte gib deinen Namen an.";
  if (!p.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return "Bitte gib eine gültige E-Mail-Adresse an.";
  if (p.firstName.length > MAX_LEN.name || p.lastName.length > MAX_LEN.name) return "Name ist zu lang.";
  if (p.email.length > MAX_LEN.email) return "E-Mail ist zu lang.";
  if ((p.company ?? "").length > MAX_LEN.company) return "Betriebsname ist zu lang.";
  if ((p.service ?? "").length > MAX_LEN.service) return "Ungültige Auswahl.";
  if ((p.message ?? "").length > MAX_LEN.message) return "Nachricht ist zu lang.";
  return null;
}

export async function POST(request: NextRequest) {
  console.log("[api/contact] request received");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    console.warn("[api/contact] rate limited:", ip);
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte versuch es in ein paar Minuten erneut." },
      { status: 429 }
    );
  }

  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const validationError = validate(payload);
  if (validationError === "spam") {
    // Pretend success so bots don't learn about the honeypot.
    console.warn("[api/contact] honeypot tripped:", ip);
    return NextResponse.json({ ok: true });
  }
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const smtpConfig = getSmtpConfig();
  if (!smtpConfig) {
    console.error("[api/contact] missing SMTP configuration");
    return NextResponse.json(
      { error: "Der Versand ist derzeit nicht verfügbar. Bitte schreib uns direkt an info@nitenexo.at." },
      { status: 503 }
    );
  }

  const text = [
    `Neue Anfrage über das Kontaktformular`,
    ``,
    `Name: ${payload.firstName} ${payload.lastName}`,
    `E-Mail: ${payload.email}`,
    `Betrieb: ${payload.company || "—"}`,
    `Leistung: ${payload.service || "—"}`,
    ``,
    `Nachricht:`,
    payload.message || "—",
  ].join("\n");

  // Escape every user-supplied value before it goes into raw HTML (cardHtml/bodyHtml
  // are inserted unescaped by renderEmailShell). Line breaks become <br> only AFTER escaping.
  const escapedMessage = escapeHtml(payload.message || "—").replace(/\n/g, "<br>");
  const cardHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#150f23;">
      <tr><td style="padding:4px 0; color:#79628c; width:100px;">Name</td><td style="padding:4px 0;">${escapeHtml(`${payload.firstName} ${payload.lastName}`)}</td></tr>
      <tr><td style="padding:4px 0; color:#79628c;">E-Mail</td><td style="padding:4px 0;">${escapeHtml(payload.email!)}</td></tr>
      <tr><td style="padding:4px 0; color:#79628c;">Betrieb</td><td style="padding:4px 0;">${escapeHtml(payload.company || "—")}</td></tr>
      <tr><td style="padding:4px 0; color:#79628c;">Leistung</td><td style="padding:4px 0;">${escapeHtml(payload.service || "—")}</td></tr>
    </table>
    <p style="margin:16px 0 0; font-size:14px; color:#150f23; line-height:1.6;">${escapedMessage}</p>
  `;

  const html = renderEmailShell({
    preheader: `Neue Anfrage von ${payload.firstName} ${payload.lastName}`,
    eyebrow: "Kontaktformular",
    heading: "Neue Anfrage",
    bodyHtml: `<p style="margin:0;">Über das Kontaktformular ist eine neue Anfrage eingegangen:</p>`,
    cardHtml,
    ctaLabel: "Direkt antworten",
    ctaHref: `mailto:${escapeHtml(payload.email!)}`,
  });

  try {
    await sendMail({
      to: smtpConfig.contactTo,
      replyTo: payload.email,
      subject: `Neue Anfrage von ${payload.firstName} ${payload.lastName}`,
      text,
      html,
    });
  } catch (err) {
    console.error("[api/contact] send failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Die Nachricht konnte nicht gesendet werden. Bitte versuch es später erneut oder schreib an info@nitenexo.at." },
      { status: 502 }
    );
  }

  // Auto-reply to the sender is best-effort — the main mail already arrived, so a
  // failure here must never turn into an error response for the user.
  if (process.env.CONTACT_AUTOREPLY !== "false") {
    const autoReplyText = [
      `Hallo ${payload.firstName},`,
      ``,
      `danke für deine Anfrage bei NiteNexo. Wir melden uns innerhalb eines Werktags bei dir.`,
      ``,
      `Liebe Grüße`,
      `Dein NiteNexo Team`,
    ].join("\n");

    const autoReplyHtml = renderEmailShell({
      preheader: "Danke für deine Anfrage bei NiteNexo — wir melden uns innerhalb eines Werktags.",
      eyebrow: "Bestätigung",
      heading: "Danke für deine Anfrage",
      bodyHtml: `
        <p style="margin:0 0 16px;">Hallo ${escapeHtml(payload.firstName!)},</p>
        <p style="margin:0 0 16px;">danke für deine Anfrage bei NiteNexo. Wir melden uns innerhalb eines Werktags bei dir.</p>
        <p style="margin:0;">Liebe Grüße<br>Dein NiteNexo Team</p>
      `,
    });

    try {
      await sendMail({
        to: payload.email!,
        subject: "Danke für deine Anfrage bei NiteNexo",
        text: autoReplyText,
        html: autoReplyHtml,
      });
    } catch (err) {
      console.error("[api/contact] auto-reply failed:", err instanceof Error ? err.message : err);
    }
  }

  console.log("[api/contact] mail sent");
  return NextResponse.json({ ok: true });
}
