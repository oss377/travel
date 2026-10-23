import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPlaceholderPage } from "@/components/system/public-placeholder-page";
import { isLocale } from "@/lib/i18n/config";
import { buildPublicPageMetadata } from "@/lib/i18n/page-metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params;

  if (!isLocale(lang)) {
    return {};
  }

  return buildPublicPageMetadata(lang, "/terms", "terms");
}

export default async function TermsPage({
  params,
}: PageProps<"/[lang]/terms">) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return <PublicPlaceholderPage locale={lang} pageKey="terms" />;
}
