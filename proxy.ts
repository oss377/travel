import { NextResponse, type NextRequest } from "next/server";
import {
  isLocale,
  localeCookieMaxAge,
  localeCookieName,
} from "./lib/i18n/config";
import { detectLocale } from "./lib/i18n/locale-detection";

/**
 * Locale redirects live here and only here. Authorization must stay in the
 * server data-access layer; a proxy redirect is never an access-control check.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";
  const activeLocale = isLocale(firstSegment) ? firstSegment : null;

  if (activeLocale) {
    const response = NextResponse.next();

    if (request.cookies.get(localeCookieName)?.value !== activeLocale) {
      response.cookies.set(localeCookieName, activeLocale, {
        httpOnly: true,
        maxAge: localeCookieMaxAge,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  }

  const locale = detectLocale({
    cookieLocale: request.cookies.get(localeCookieName)?.value,
    acceptLanguage: request.headers.get("accept-language"),
  });
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  redirectUrl.search = search;

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(localeCookieName, locale, {
    httpOnly: true,
    maxAge: localeCookieMaxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.[^/]+$).*)",
  ],
};
