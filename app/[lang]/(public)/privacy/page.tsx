import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPlaceholderPage } from "@/components/system/public-placeholder-page";
import { isLocale } from "@/lib/i18n/config";
import { buildPublicPageMetadata } from "@/lib/i18n/page-metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;

  if (!isLocale(lang)) {
    return {};
  }

  return buildPublicPageMetadata(lang, "/privacy", "privacy");
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return <PublicPlaceholderPage locale={lang} pageKey="privacy" />;
}
