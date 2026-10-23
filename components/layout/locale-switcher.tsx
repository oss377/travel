"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Globe2 } from "lucide-react";
import {
  localeDetails,
  locales,
  type Locale,
} from "@/lib/i18n/config";
import { switchLocalePath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  locale: Locale;
  label: string;
  compact?: boolean;
  tone?: "light" | "dark";
  className?: string;
};

type LocaleSwitcherContentProps = LocaleSwitcherProps & {
  queryString?: string;
};

const toneStyles = {
  light: {
    container: "border-border bg-white/75",
    active: "bg-primary text-primary-foreground shadow-soft",
    inactive: "text-forest-800/75 hover:bg-forest-50 hover:text-forest-900",
    icon: "text-forest-600",
  },
  dark: {
    container: "border-white/15 bg-white/10",
    active: "bg-gold-300 text-forest-950",
    inactive: "text-ivory/75 hover:bg-white/10 hover:text-ivory",
    icon: "text-gold-300",
  },
} as const;

function LocaleSwitcherContent({
  locale,
  label,
  compact = false,
  tone = "light",
  className,
  queryString = "",
}: LocaleSwitcherContentProps) {
  const pathname = usePathname();
  const styles = toneStyles[tone];

  return (
    <nav
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border p-1",
        styles.container,
        className,
      )}
    >
      <Globe2
        aria-hidden="true"
        className={cn("ml-1.5 size-3.5 shrink-0", styles.icon)}
      />
      {locales.map((targetLocale) => {
        const isActive = targetLocale === locale;
        const details = localeDetails[targetLocale];
        const target = `${switchLocalePath(pathname, targetLocale)}${queryString}`;

        return (
          <Link
            key={targetLocale}
            href={target}
            hrefLang={details.htmlLang}
            lang={details.htmlLang}
            aria-current={isActive ? "true" : undefined}
            title={details.label}
            className={cn(
              "inline-flex h-7 items-center justify-center rounded-full px-2.5 text-[0.7rem] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive ? styles.active : styles.inactive,
            )}
          >
            {compact ? details.shortLabel : details.label}
          </Link>
        );
      })}
    </nav>
  );
}

function LocaleSwitcherFallback(props: LocaleSwitcherProps) {
  return <LocaleSwitcherContent {...props} />;
}

function LocaleSwitcherWithQuery(props: LocaleSwitcherProps) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  return (
    <LocaleSwitcherContent
      {...props}
      queryString={query ? `?${query}` : ""}
    />
  );
}

export function LocaleSwitcher(props: LocaleSwitcherProps) {
  return (
    <Suspense fallback={<LocaleSwitcherFallback {...props} />}>
      <LocaleSwitcherWithQuery {...props} />
    </Suspense>
  );
}
