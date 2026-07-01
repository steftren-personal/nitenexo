import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (
    process.env.NEXT_PUBLIC_COMING_SOON === "true" &&
    request.nextUrl.pathname !== "/coming-soon"
  ) {
    return NextResponse.redirect(new URL("/coming-soon", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
