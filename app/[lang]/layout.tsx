import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Toaster } from "@/components/ui/toaster";
import { geistMono, geistSans, notoEthiopic } from "@/lib/fonts";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSiteUrl } from "@/lib/i18n/metadata";

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#041f16",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;

  if (!isLocale(lang)) {
    return {};
  }

  const dict = getDictionary(lang);

  return {
    metadataBase: getSiteUrl(),
    title: {
      default: dict.meta.title,
      template: `%s | ${dict.brand.name}`,
    },
    description: dict.meta.description,
    applicationName: dict.brand.name,
    formatDetection: {
      address: false,
      email: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      siteName: dict.brand.name,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: lang === "am" ? "am_ET" : "en_ET",
    },
  };
}

export default async function LocaleRootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  return (
    <html
      lang={lang}
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} ${notoEthiopic.variable} antialiased`}
    >
      <body className="min-h-dvh bg-background text-foreground">
        <a href="#main" className="skip-link">
          {dict.a11y.skipToContent}
        </a>
        <MotionProvider>{children}</MotionProvider>
        <Toaster />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
