// Access to the NiteNexo Google Calendar (info@nitenexo.at) via OAuth
// refresh token. See docs/GOOGLE-KALENDER-SETUP.md for how the credentials
// were created. Plain `fetch` is enough for the handful of endpoints we
// need, so no `googleapis` dependency.

type GoogleCalendarConfig = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  calendarId: string;
};

// Read and validate config from env vars. Returns null if incomplete —
// mirrors getSmtpConfig() in lib/mailer.ts. Cheap, so no caching needed here;
// only the access token (below) is worth caching.
export function getGoogleCalendarConfig(): GoogleCalendarConfig | null {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN,
    GOOGLE_CALENDAR_ID,
  } = process.env;

  if (
    !GOOGLE_CLIENT_ID ||
    !GOOGLE_CLIENT_SECRET ||
    !GOOGLE_REFRESH_TOKEN ||
    !GOOGLE_CALENDAR_ID
  ) {
    return null;
  }

  return {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    refreshToken: GOOGLE_REFRESH_TOKEN,
    calendarId: GOOGLE_CALENDAR_ID,
  };
}

// --- access token (cached, refreshed just before it expires) --------------

type CachedToken = { accessToken: string; expiresAt: number };
let cachedToken: CachedToken | null = null;

// Refresh 60s before actual expiry so a slow request never uses a token
// that expires mid-flight.
const EXPIRY_SAFETY_MARGIN_MS = 60_000;

async function getAccessToken(config: GoogleCalendarConfig): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt - now > EXPIRY_SAFETY_MARGIN_MS) {
    return cachedToken.accessToken;
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    // Never log the response body — it can echo back client_id/secret context.
    throw new Error(`Google OAuth token refresh failed (status ${response.status})`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };
  return cachedToken.accessToken;
}

// --- calendar event types ---------------------------------------------

export type GoogleCalendarEventTime = {
  date?: string; // all-day events
  dateTime?: string; // timed events, includes UTC offset
  timeZone?: string;
};

export type GoogleCalendarEvent = {
  id: string;
  status: "confirmed" | "tentative" | "cancelled" | string;
  summary?: string;
  description?: string;
  start: GoogleCalendarEventTime;
  end: GoogleCalendarEventTime;
  extendedProperties?: { private?: Record<string, string> };
};

function calendarEventsUrl(calendarId: string, suffix = "") {
  return `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events${suffix}`;
}

async function calendarFetch(
  config: GoogleCalendarConfig,
  path: string,
  init?: RequestInit
): Promise<Response> {
  const accessToken = await getAccessToken(config);
  return fetch(path, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

// List events overlapping [timeMinIso, timeMaxIso). Includes cancelled
// events (status: "cancelled") — callers that care about availability must
// filter those out themselves (see lib/availability.ts).
export async function listCalendarEvents(
  timeMinIso: string,
  timeMaxIso: string
): Promise<GoogleCalendarEvent[]> {
  const config = getGoogleCalendarConfig();
  if (!config) {
    throw new Error("Google Calendar configuration is missing or incomplete");
  }

  const params = new URLSearchParams({
    timeMin: timeMinIso,
    timeMax: timeMaxIso,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "2500",
    showDeleted: "false",
  });

  const response = await calendarFetch(
    config,
    `${calendarEventsUrl(config.calendarId)}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Google Calendar list request failed (status ${response.status})`);
  }

  const data = (await response.json()) as { items?: GoogleCalendarEvent[] };
  return data.items ?? [];
}

// List only the events booked by one user. Google filters server-side on the
// private extended property, so another user's appointments never leave the
// API — safer than fetching everything and filtering here.
export async function listEventsForUser(
  userId: string,
  timeMinIso: string,
  timeMaxIso: string
): Promise<GoogleCalendarEvent[]> {
  const config = getGoogleCalendarConfig();
  if (!config) {
    throw new Error("Google Calendar configuration is missing or incomplete");
  }

  const params = new URLSearchParams({
    timeMin: timeMinIso,
    timeMax: timeMaxIso,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "250",
    showDeleted: "false",
    privateExtendedProperty: `userId=${userId}`,
  });

  const response = await calendarFetch(
    config,
    `${calendarEventsUrl(config.calendarId)}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Google Calendar list request failed (status ${response.status})`);
  }

  const data = (await response.json()) as { items?: GoogleCalendarEvent[] };
  return data.items ?? [];
}

export async function getCalendarEvent(eventId: string): Promise<GoogleCalendarEvent | null> {
  const config = getGoogleCalendarConfig();
  if (!config) {
    throw new Error("Google Calendar configuration is missing or incomplete");
  }

  const response = await calendarFetch(config, calendarEventsUrl(config.calendarId, `/${encodeURIComponent(eventId)}`));

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Google Calendar get request failed (status ${response.status})`);
  }

  return (await response.json()) as GoogleCalendarEvent;
}

export type CreateCalendarEventInput = {
  summary: string;
  description?: string;
  startIso: string;
  endIso: string;
  timeZone: string;
  /** Stored as extendedProperties.private — not shown anywhere in the Google Calendar UI. */
  privateProperties?: Record<string, string>;
};

export async function createCalendarEvent(
  input: CreateCalendarEventInput
): Promise<GoogleCalendarEvent> {
  const config = getGoogleCalendarConfig();
  if (!config) {
    throw new Error("Google Calendar configuration is missing or incomplete");
  }

  const response = await calendarFetch(config, calendarEventsUrl(config.calendarId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: input.summary,
      description: input.description,
      start: { dateTime: input.startIso, timeZone: input.timeZone },
      end: { dateTime: input.endIso, timeZone: input.timeZone },
      extendedProperties: input.privateProperties
        ? { private: input.privateProperties }
        : undefined,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Calendar create request failed (status ${response.status})`);
  }

  return (await response.json()) as GoogleCalendarEvent;
}

export type UpdateCalendarEventInput = Partial<{
  summary: string;
  status: "confirmed" | "cancelled";
}>;

export async function updateCalendarEvent(
  eventId: string,
  patch: UpdateCalendarEventInput
): Promise<GoogleCalendarEvent> {
  const config = getGoogleCalendarConfig();
  if (!config) {
    throw new Error("Google Calendar configuration is missing or incomplete");
  }

  const response = await calendarFetch(config, calendarEventsUrl(config.calendarId, `/${encodeURIComponent(eventId)}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });

  if (!response.ok) {
    throw new Error(`Google Calendar update request failed (status ${response.status})`);
  }

  return (await response.json()) as GoogleCalendarEvent;
}

// Permanently removes an event — only used by the throwaway test script to
// clean up after itself. Not used by any API route (cancellations mark
// events as "cancelled" instead, per the client's requirement).
export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const config = getGoogleCalendarConfig();
  if (!config) {
    throw new Error("Google Calendar configuration is missing or incomplete");
  }

  const response = await calendarFetch(config, calendarEventsUrl(config.calendarId, `/${encodeURIComponent(eventId)}`), {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 410 && response.status !== 404) {
    throw new Error(`Google Calendar delete request failed (status ${response.status})`);
  }
}
