import { describe, expect, it } from "vitest";
import am from "@/messages/am.json";
import en from "@/messages/en.json";
import { detectLocale } from "@/lib/i18n/locale-detection";
import {
  localizedPath,
  stripLocalePath,
  switchLocalePath,
} from "@/lib/i18n/paths";
import { buildLocaleMetadata } from "@/lib/i18n/metadata";

type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;
type JsonObject = { [key: string]: JsonValue };

function collectLeafPaths(value: JsonValue, prefix = ""): string[] {
  if (value === null || typeof value !== "object") {
    return [prefix];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry, index) =>
      collectLeafPaths(entry, `${prefix}[${index}]`),
    );
  }

  return Object.entries(value).flatMap(([key, entry]) =>
    collectLeafPaths(entry, prefix ? `${prefix}.${key}` : key),
  );
}

function collectStrings(value: JsonValue): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (value === null || typeof value !== "object") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectStrings);
  }

  return Object.values(value).flatMap(collectStrings);
}

describe("bilingual dictionaries", () => {
  it("has exactly the same leaf keys in English and Amharic", () => {
    const englishKeys = collectLeafPaths(en as JsonValue).sort();
    const amharicKeys = collectLeafPaths(am as JsonValue).sort();

    expect(amharicKeys).toEqual(englishKeys);
  });

  it("does not contain blank translations", () => {
    const englishStrings = collectStrings(en as JsonValue);
    const amharicStrings = collectStrings(am as JsonValue);

    expect(englishStrings.every((value) => value.trim().length > 0)).toBe(true);
    expect(amharicStrings.every((value) => value.trim().length > 0)).toBe(true);
  });

  it("keeps critical legal and selection copy explicit", () => {
    expect(en.home.steps.note).toMatch(/does not guarantee/i);
    expect(en.pages.selectionEvents.description).toMatch(/disabled/i);
    expect(en.pages.terms.title).toMatch(/not in force/i);
    expect(am.pages.selectionEvents.description).toMatch(/ተሰናክሏል/);
    expect(am.pages.terms.title).toMatch(/አይደሉም/);
  });
});

describe("locale detection", () => {
  it("prefers a supported cookie over headers", () => {
    expect(
      detectLocale({
        cookieLocale: "am",
        acceptLanguage: "en-US,en;q=0.9",
      }),
    ).toBe("am");
  });

  it("uses the highest-quality supported Accept-Language entry", () => {
    expect(
      detectLocale({
        acceptLanguage: "fr-FR,fr;q=0.9,am;q=0.8,en;q=0.7",
      }),
    ).toBe("am");
  });

  it("falls back to English for unsupported or invalid preferences", () => {
    expect(
      detectLocale({
        cookieLocale: "fr",
        acceptLanguage: "de-DE,de;q=0.9",
      }),
    ).toBe("en");
  });
});

describe("locale paths", () => {
  it("builds locale-prefixed paths", () => {
    expect(localizedPath("en")).toBe("/en");
    expect(localizedPath("am", "/destinations")).toBe("/am/destinations");
  });

  it("strips only supported locale prefixes", () => {
    expect(stripLocalePath("/en")).toBe("/");
    expect(stripLocalePath("/am/destinations")).toBe("/destinations");
    expect(stripLocalePath("/fr/destinations")).toBe("/fr/destinations");
  });

  it("switches locale without changing the page", () => {
    expect(switchLocalePath("/en/destinations", "am")).toBe(
      "/am/destinations",
    );
  });
});

describe("localized metadata", () => {
  it("emits canonical and hreflang alternates for every page", () => {
    const metadata = buildLocaleMetadata({
      locale: "am",
      path: "/about",
      title: "About",
      description: "About page",
    });

    expect(metadata.alternates?.canonical).toBe("/am/about");
    expect(metadata.alternates?.languages).toMatchObject({
      en: "/en/about",
      am: "/am/about",
      "x-default": "/en/about",
    });
  });
});
