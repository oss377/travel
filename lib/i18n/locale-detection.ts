import { defaultLocale, isLocale, type Locale } from "./config";

type LocaleDetectionInput = {
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
};

/**
 * Choose a supported locale without trusting client-side state for anything
 * beyond presentation. Cookie preference wins, then the browser's ordered
 * Accept-Language list, then the default locale.
 */
export function detectLocale({
  cookieLocale,
  acceptLanguage,
}: LocaleDetectionInput): Locale {
  if (isLocale(cookieLocale)) {
    return cookieLocale;
  }

  if (!acceptLanguage) {
    return defaultLocale;
  }

  const preferences = acceptLanguage
    .split(",")
    .map((entry, index) => {
      const [rawTag, ...parameters] = entry.trim().split(";");
      const qualityParameter = parameters
        .map((parameter) => parameter.trim())
        .find((parameter) => parameter.startsWith("q="));
      const parsedQuality = qualityParameter
        ? Number.parseFloat(qualityParameter.slice(2))
        : 1;

      return {
        tag: rawTag.trim().toLowerCase(),
        quality: Number.isFinite(parsedQuality) ? parsedQuality : 0,
        index,
      };
    })
    .filter((preference) => preference.tag.length > 0)
    .sort(
      (left, right) =>
        right.quality - left.quality || left.index - right.index,
    );

  for (const preference of preferences) {
    if (preference.quality <= 0) {
      continue;
    }

    if (preference.tag === "am" || preference.tag.startsWith("am-")) {
      return "am";
    }

    if (preference.tag === "en" || preference.tag.startsWith("en-")) {
      return "en";
    }
  }

  return defaultLocale;
}
