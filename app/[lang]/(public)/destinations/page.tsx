import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPlaceholderPage } from "@/components/system/public-placeholder-page";
import { isCategoryKey } from "@/lib/content/categories";
import { isLocale } from "@/lib/i18n/config";
import { buildPublicPageMetadata } from "@/lib/i18n/page-metadata";
import { destinationSearchSchema } from "@/lib/validation/search";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/destinations">): Promise<Metadata> {
  const { lang } = await params;

  if (!isLocale(lang)) {
    return {};
  }

  return buildPublicPageMetadata(lang, "/destinations", "destinations");
}

export default async function DestinationsPage({
  params,
  searchParams,
}: PageProps<"/[lang]/destinations">) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const { q, category } = await searchParams;
  const parsedSearch = destinationSearchSchema.safeParse({
    q: typeof q === "string" ? q : "",
  });
  const searchTerm = parsedSearch.success ? parsedSearch.data.q : undefined;
  const categoryKey =
    typeof category === "string" && isCategoryKey(category)
      ? category
      : undefined;

  return (
    <PublicPlaceholderPage
      locale={lang}
      pageKey="destinations"
      searchTerm={searchTerm}
      categoryKey={categoryKey}
    />
  );
}
