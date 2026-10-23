import Link from "next/link";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/paths";
import { footerNavigation } from "@/lib/navigation";

type SiteFooterProps = {
  locale: Locale;
  dict: Dictionary;
};

const footerLinkClass =
  "inline-flex w-fit rounded-sm text-sm leading-6 text-forest-100/70 transition-colors hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-4 focus-visible:ring-offset-forest-950";

export function SiteFooter({ locale, dict }: SiteFooterProps) {
  const homeHref = localizedPath(locale);

  return (
    <footer className="relative overflow-hidden bg-forest-950 text-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
      >
        <div className="pattern-grid-inverse h-full w-full" />
      </div>

      <div className="site-container relative py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
          <div className="max-w-sm">
            <Link
              href={homeHref}
              aria-label={dict.brand.name}
              className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-4 focus-visible:ring-offset-forest-950"
            >
              <BrandLockup
                name={dict.brand.name}
                tagline={dict.footer.tagline}
                tone="dark"
              />
            </Link>
            <p className="mt-5 text-sm leading-7 text-forest-100/70">
              {dict.footer.description}
            </p>
            <div className="mt-6 hidden lg:block">
              <LocaleSwitcher
                locale={locale}
                label={dict.a11y.languageSwitcher}
                tone="dark"
              />
            </div>
          </div>

          <nav aria-label={dict.a11y.footerNavigation} className="contents">
            {footerNavigation.map((group) => (
              <div key={group.labelKey}>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
                  {dict.footer[group.labelKey]}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={localizedPath(locale, item.path)}
                        className={footerLinkClass}
                      >
                        {dict.nav[item.key]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-xs leading-6 text-forest-100/65 sm:px-5">
          {dict.footer.disclaimer}
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-forest-100/55">
            {dict.footer.copyright}
          </p>
          <div className="lg:hidden">
            <LocaleSwitcher
              locale={locale}
              label={dict.a11y.languageSwitcher}
              tone="dark"
              compact
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
