import Link from "next/link";
import {
  CalendarDays,
  Compass,
  FileQuestion,
  FileText,
  Mail,
  MapPin,
  Route,
  ShieldCheck,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryKeys, type CategoryKey } from "@/lib/content/categories";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedPath } from "@/lib/i18n/paths";

export type PublicPageKey = keyof Dictionary["pages"];

const pageIcons: Record<PublicPageKey, LucideIcon> = {
  destinations: MapPin,
  travelPlans: Route,
  selectionEvents: CalendarDays,
  results: Trophy,
  about: Compass,
  contact: Mail,
  faq: FileQuestion,
  terms: FileText,
  privacy: ShieldCheck,
};

type PublicPlaceholderPageProps = {
  locale: Locale;
  pageKey: PublicPageKey;
  searchTerm?: string;
  categoryKey?: CategoryKey;
};

export function PublicPlaceholderPage({
  locale,
  pageKey,
  searchTerm,
  categoryKey,
}: PublicPlaceholderPageProps) {
  const dict = getDictionary(locale);
  const page = dict.pages[pageKey];
  const Icon = pageIcons[pageKey];
  const homeHref = localizedPath(locale);
  const destinationsHref = localizedPath(locale, "/destinations");
  const category =
    categoryKey && (categoryKeys as readonly string[]).includes(categoryKey)
      ? dict.categories[categoryKey]
      : null;

  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="pattern-grid absolute inset-0 opacity-45" />
        <div className="absolute -right-40 -top-40 size-[30rem] rounded-full bg-gold-200/25 blur-3xl" />
        <div className="absolute -left-32 bottom-0 size-80 rounded-full bg-forest-100/70 blur-3xl" />
      </div>

      <div className="site-container relative py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-3xl border border-gold-300/60 bg-gold-50 text-gold-700 shadow-soft">
            <Icon aria-hidden="true" className="size-7" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-forest-600">
              {page.eyebrow}
            </p>
            <Badge variant="gold">{dict.common.comingSoon}</Badge>
          </div>

          <h1 className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-forest-950 sm:text-4xl lg:text-5xl">
            {page.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            {page.description}
          </p>

          {searchTerm || category ? (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {searchTerm ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-forest-200 bg-white px-4 py-2 text-sm text-forest-900">
                  <span className="font-semibold">{dict.common.searchTerm}:</span>
                  <span className="max-w-[18rem] truncate">&ldquo;{searchTerm}&rdquo;</span>
                </span>
              ) : null}
              {category ? (
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  {category.name}
                </Badge>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href={homeHref}>{dict.actions.backHome}</Link>
            </Button>
            {pageKey !== "destinations" ? (
              <Button asChild variant="outline">
                <Link href={destinationsHref}>
                  {dict.actions.exploreDestinations}
                </Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          <div className="rounded-card border border-border bg-card p-5 shadow-soft sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <div>
                <h2 className="font-display text-base font-semibold text-forest-950">
                  {dict.common.comingSoon}
                </h2>
                <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                  {page.detail}
                </p>
              </div>
            </div>
          </div>

          <Alert variant="warning">{dict.placeholder.note}</Alert>
        </div>
      </div>
    </section>
  );
}
