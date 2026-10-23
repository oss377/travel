export const locales = ["en", "am"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeCookieName = "lte_locale";
export const localeCookieMaxAge = 60 * 60 * 24 * 365;

export const localeDetails: Record<
  Locale,
  { label: string; shortLabel: string; htmlLang: string; openGraphLocale: string }
> = {
  en: {
    label: "English",
    shortLabel: "EN",
    htmlLang: "en",
    openGraphLocale: "en_ET",
  },
  am: {
    label: "አማርኛ",
    shortLabel: "አማ",
    htmlLang: "am",
    openGraphLocale: "am_ET",
  },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "am";
}

export function getLocaleLabel(locale: Locale): string {
  return localeDetails[locale].label;
}
