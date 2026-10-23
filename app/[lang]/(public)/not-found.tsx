import { Compass } from "lucide-react";
import Link from "next/link";
import { lang } from "next/root-params";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function NotFound() {
  const currentLang = await lang();
  const locale = isLocale(currentLang) ? currentLang : "en";
  const dict = getDictionary(locale);

  return (
    <section className="site-container py-16 sm:py-24">
      <EmptyState
        icon={<Compass aria-hidden="true" />}
        eyebrow={dict.notFound.eyebrow}
        title={dict.notFound.title}
        description={dict.notFound.description}
        action={
          <>
            <Button asChild>
              <Link href={`/${locale}`}>{dict.actions.backHome}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/${locale}/destinations`}>
                {dict.actions.exploreDestinations}
              </Link>
            </Button>
          </>
        }
      />
    </section>
  );
}
