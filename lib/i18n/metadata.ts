import type { Metadata } from "next";
import { localeDetails, type Locale } from "./config";

const fallbackSiteUrl = "http://localhost:3000";

export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL ?? fallbackSiteUrl;

  try {
    return new URL(configuredUrl);
  } catch {
    return new URL(fallbackSiteUrl);
  }
}

type LocaleMetadataInput = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
};

export function buildLocaleMetadata({
  locale,
  path = "/",
  title,
  description,
  absoluteTitle = false,
}: LocaleMetadataInput): Metadata {
  const normalizedPath = path === "/" ? "" : path;
  const alternateLocale: Locale = locale === "en" ? "am" : "en";

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: `/${locale}${normalizedPath}`,
      languages: {
        en: `/en${normalizedPath}`,
        am: `/am${normalizedPath}`,
        "x-default": `/en${normalizedPath}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Lucky Travel Ethiopia",
      title,
      description,
      locale: localeDetails[locale].openGraphLocale,
      alternateLocale: [localeDetails[alternateLocale].openGraphLocale],
      url: `/${locale}${normalizedPath}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
