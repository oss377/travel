import { locales, type Locale } from "./config";

/**
 * Build an absolute, locale-prefixed path.
 * All public routes are locale-prefixed so metadata and links stay predictable.
 */
export function localizedPath(locale: Locale, path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

/**
 * Remove a supported locale prefix from a pathname.
 * Non-locale paths are returned unchanged.
 */
export function stripLocalePath(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) {
      return "/";
    }

    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1) || "/";
    }
  }

  return pathname;
}

export function switchLocalePath(pathname: string, locale: Locale): string {
  return localizedPath(locale, stripLocalePath(pathname));
}
