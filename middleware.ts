import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/admin-emails";

// Legally required pages stay reachable during coming-soon (Impressumspflicht
// §5 ECG; Datenschutzerklärung wegen Cookie-Banner/DSGVO).
const COMING_SOON_ALLOWED = ["/coming-soon", "/impressum", "/datenschutz"];

const PROTECTED_PREFIXES = ["/termine", "/konto", "/admin"];

export async function middleware(request: NextRequest) {
  // Coming-soon gate runs first: while it is on nothing else is reachable
  // anyway, so there is no point authenticating the request.
  if (
    process.env.NEXT_PUBLIC_COMING_SOON === "true" &&
    !COMING_SOON_ALLOWED.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/coming-soon", request.url));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );

  if (isProtected && !data.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (request.nextUrl.pathname.startsWith("/admin") && !isAdminEmail(data.user?.email)) {
    return NextResponse.redirect(new URL("/termine", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
