import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";

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

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    console.error("[api/contact] missing SMTP configuration");
    return NextResponse.json(
      { error: "Der Versand ist derzeit nicht verfügbar. Bitte schreib uns direkt an info@nitenexo.at." },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    secure: Number(SMTP_PORT ?? 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

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

  try {
    await transporter.sendMail({
      from: `"NiteNexo Website" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: payload.email,
      subject: `Neue Anfrage von ${payload.firstName} ${payload.lastName}`,
      text,
    });
  } catch (err) {
    console.error("[api/contact] send failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Die Nachricht konnte nicht gesendet werden. Bitte versuch es später erneut oder schreib an info@nitenexo.at." },
      { status: 502 }
    );
  }

  console.log("[api/contact] mail sent");
  return NextResponse.json({ ok: true });
}
