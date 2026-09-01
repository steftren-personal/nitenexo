import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Redemption endpoint for Supabase's password-recovery and signup-confirmation
 * emails.
 *
 * Supabase's `{{ .ConfirmationURL }}` template variable builds a link to
 * Supabase's own hosted `/auth/v1/verify` endpoint: that endpoint redeems the
 * one-time token itself and then 303-redirects back into the app. Two things
 * can go wrong with that, even once the redirect target is correctly
 * allow-listed in the Supabase dashboard:
 *
 *  1. Email security scanners (e.g. Microsoft Defender "Safe Links", some
 *     corporate/university spam filters) "click" links in incoming mail to
 *     scan them before the user does. Because the token is single-use, the
 *     scanner's visit burns it — the real user then lands on an
 *     expired/invalid-token error.
 *  2. That hosted endpoint validates its `redirect_to` query param against
 *     the Redirect URLs allow-list, which is an easy step to miss or typo
 *     ("requested path is invalid").
 *
 * Using `{{ .TokenHash }}` in the email template instead (see
 * email-templates/supabase-passwort-zuruecksetzen.html and
 * supabase-email-bestaetigen.html) and verifying it here — server-side, via
 * this route — avoids both problems: the link points straight at our own
 * domain (no Supabase redirect/allow-list involved at all), and simply
 * loading this URL doesn't redeem anything by itself; only the explicit
 * verifyOtp() call below does, which a link-scanning bot triggers just the
 * same as a real click would (there is no way around a bot "using up" a
 * single-use token by visiting it — but at least a real click never fails
 * because of an unrelated allow-list typo).
 */
export async function GET(request: NextRequest) {
  console.log("GET /auth/confirm called");

  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const rawNext = searchParams.get("next") ?? "/";

  // Only ever redirect within our own site — never follow an absolute URL or
  // a protocol-relative one (e.g. "//evil.com") that might end up in this param.
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

    if (!error) {
      console.log("GET /auth/confirm done: token verified, redirecting to", next);
      redirect(next);
    }

    console.error("verifyOtp failed:", error.message);
  }

  // Missing or expired/already-used token — send the user somewhere that
  // explains it in plain language instead of a raw Supabase error page.
  console.log("GET /auth/confirm done: invalid or missing token, type =", type);

  if (type === "signup") {
    redirect(
      `/registrieren?error=${encodeURIComponent(
        "Dieser Bestätigungslink ist ungültig oder abgelaufen. Bitte registriere dich erneut."
      )}`
    );
  }

  redirect("/passwort-neu?invalid=1");
}
