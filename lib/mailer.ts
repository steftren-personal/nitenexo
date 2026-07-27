import nodemailer from "nodemailer";

// Central mail helper — one nodemailer transport reused across requests
// instead of creating a new connection per call.

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  contactTo: string[];
};

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;
let cachedConfig: SmtpConfig | null = null;

// Parse a comma-separated recipient list, trimming whitespace and dropping empty entries.
function parseRecipients(value: string): string[] {
  return value
    .split(",")
    .map((addr) => addr.trim())
    .filter((addr) => addr.length > 0);
}

// Read and validate SMTP config from env vars. Returns null if incomplete.
export function getSmtpConfig(): SmtpConfig | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    return null;
  }
  const contactTo = parseRecipients(CONTACT_TO);
  if (contactTo.length === 0) {
    return null;
  }
  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    user: SMTP_USER,
    pass: SMTP_PASS,
    contactTo,
  };
}

function getTransporter(config: SmtpConfig) {
  // Reuse the transport across requests — only rebuild it if config actually changed.
  if (
    cachedTransporter &&
    cachedConfig &&
    cachedConfig.host === config.host &&
    cachedConfig.port === config.port &&
    cachedConfig.user === config.user &&
    cachedConfig.pass === config.pass
  ) {
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
  });
  cachedConfig = config;
  return cachedTransporter;
}

type Attachment = {
  filename: string;
  content: string | Buffer;
  contentType?: string;
};

type SendMailArgs = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: Attachment[];
};

// Send a mail using the shared transport. Throws on failure — callers decide how to handle it.
// `text` is always required as a fallback for clients that don't render HTML.
export async function sendMail({
  to,
  subject,
  text,
  html,
  replyTo,
  attachments,
}: SendMailArgs): Promise<void> {
  const config = getSmtpConfig();
  if (!config) {
    throw new Error("SMTP configuration is missing or incomplete");
  }

  const transporter = getTransporter(config);
  await transporter.sendMail({
    from: `"NiteNexo Solutions" <${config.user}>`,
    to,
    replyTo,
    subject,
    text,
    ...(html ? { html } : {}),
    ...(attachments?.length ? { attachments } : {}),
  });
}
