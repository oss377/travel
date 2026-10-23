import en from "@/messages/en.json";
import am from "@/messages/am.json";
import type { Locale } from "./config";

export type Dictionary = typeof en;

const dictionaries = { en, am } satisfies Record<Locale, Dictionary>;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
