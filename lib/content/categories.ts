/**
 * Seed taxonomy only. These are category definitions, not destination claims
 * or prices. Categories become database-managed in Phase 5/6.
 */
export const categoryKeys = [
  "religious",
  "heritage",
  "cities",
  "luxury",
  "mountains",
  "parks",
  "water",
  "historical",
  "adventure",
  "community",
  "food",
] as const;

export type CategoryKey = (typeof categoryKeys)[number];

export function isCategoryKey(value: string): value is CategoryKey {
  return (categoryKeys as readonly string[]).includes(value);
}
