import type { Metadata } from "next";
import type { Dictionary } from "./dictionaries";
import type { Locale } from "./config";
import { getDictionary } from "./dictionaries";
import { buildLocaleMetadata } from "./metadata";

export function buildPublicPageMetadata(
  locale: Locale,
  path: string,
  pageKey: keyof Dictionary["pages"],
): Metadata {
  const dict = getDictionary(locale);
  const page = dict.pages[pageKey];

  return buildLocaleMetadata({
    locale,
    path,
    title: page.title,
    description: page.description,
  });
}
