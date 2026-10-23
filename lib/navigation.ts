import type { Dictionary } from "@/lib/i18n/dictionaries";

export const primaryNavigation = [
  { key: "home", path: "/" },
  { key: "destinations", path: "/destinations" },
  { key: "travelPlans", path: "/travel-plans" },
  { key: "selectionEvents", path: "/selection-events" },
  { key: "results", path: "/results" },
  { key: "about", path: "/about" },
] as const satisfies ReadonlyArray<{
  key: keyof Dictionary["nav"];
  path: string;
}>;

export const footerNavigation = [
  {
    labelKey: "explore",
    items: [
      { key: "destinations", path: "/destinations" },
      { key: "travelPlans", path: "/travel-plans" },
      { key: "selectionEvents", path: "/selection-events" },
      { key: "results", path: "/results" },
    ],
  },
  {
    labelKey: "company",
    items: [
      { key: "about", path: "/about" },
      { key: "faq", path: "/faq" },
      { key: "contact", path: "/contact" },
    ],
  },
  {
    labelKey: "legal",
    items: [
      { key: "terms", path: "/terms" },
      { key: "privacy", path: "/privacy" },
    ],
  },
] as const satisfies ReadonlyArray<{
  labelKey: keyof Pick<Dictionary["footer"], "explore" | "company" | "legal">;
  items: ReadonlyArray<{ key: keyof Dictionary["nav"]; path: string }>;
}>;
