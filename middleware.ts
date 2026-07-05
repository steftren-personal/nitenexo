import { NextResponse, type NextRequest } from "next/server";

// Legally required pages stay reachable during coming-soon (Impressumspflicht
// §5 ECG; Datenschutzerklärung wegen Cookie-Banner/DSGVO).
const ALLOWED_PATHS = ["/coming-soon", "/impressum", "/datenschutz"];

export function middleware(request: NextRequest) {
  if (
    process.env.NEXT_PUBLIC_COMING_SOON === "true" &&
    !ALLOWED_PATHS.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/coming-soon", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
