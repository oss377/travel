import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteNav } from "@/components/layout/site-nav";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/paths";
import { primaryNavigation } from "@/lib/navigation";

type SiteHeaderProps = {
  locale: Locale;
  dict: Dictionary;
};

export function SiteHeader({ locale, dict }: SiteHeaderProps) {
  const links = primaryNavigation.map((item) => ({
    href: localizedPath(locale, item.path),
    label: dict.nav[item.key],
    path: item.path,
  }));
  const homeHref = localizedPath(locale);
  const exploreHref = localizedPath(locale, "/destinations");

  return (
    <>
      <div className="bg-forest-900 text-ivory">
        <div className="site-container flex min-h-9 items-center justify-center gap-2 py-2 text-center text-[0.68rem] font-semibold tracking-wide sm:text-xs">
          <Sparkles
            aria-hidden="true"
            className="size-3.5 shrink-0 text-gold-300"
          />
          <p>{dict.home.announcement}</p>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border/80 bg-ivory/90 backdrop-blur-xl supports-[backdrop-filter]:bg-ivory/80">
        <div className="site-container flex h-20 items-center justify-between gap-4">
          <Link
            href={homeHref}
            aria-label={dict.brand.name}
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
          >
            <BrandLockup
              name={dict.brand.name}
              tagline={dict.brand.tagline}
              showTagline={false}
            />
          </Link>

          <SiteNav
            links={links}
            label={dict.a11y.mainNavigation}
            className="hidden xl:block"
          />

          <div className="flex items-center gap-2">
            <LocaleSwitcher
              locale={locale}
              label={dict.a11y.languageSwitcher}
              compact
              className="hidden lg:inline-flex"
            />
            <Button
              asChild
              size="sm"
              className="hidden lg:inline-flex"
            >
              <Link href={exploreHref}>
                {dict.actions.exploreDestinations}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
            <MobileNav
              locale={locale}
              links={links}
              brandName={dict.brand.name}
              tagline={dict.brand.tagline}
              menuLabel={dict.a11y.mainNavigation}
              openLabel={dict.a11y.openMenu}
              closeLabel={dict.a11y.closeMenu}
              languageLabel={dict.a11y.languageSwitcher}
              exploreLabel={dict.actions.exploreDestinations}
              exploreHref={exploreHref}
            />
          </div>
        </div>
      </header>
    </>
  );
}
