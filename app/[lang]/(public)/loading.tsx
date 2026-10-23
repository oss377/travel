import { lang } from "next/root-params";
import { Skeleton } from "@/components/ui/skeleton";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function PublicLoading() {
  const currentLang = await lang();
  const locale = isLocale(currentLang) ? currentLang : "en";
  const label = getDictionary(locale).a11y.loading;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="site-container py-16 sm:py-24"
    >
      <span className="sr-only">{label}</span>
      <div className="grid items-center gap-12 lg:grid-cols-[1.03fr_0.97fr]">
        <div>
          <Skeleton className="h-8 w-40 rounded-full" />
          <Skeleton className="mt-7 h-14 w-full max-w-xl" />
          <Skeleton className="mt-3 h-14 w-4/5 max-w-lg" />
          <Skeleton className="mt-7 h-5 w-full max-w-md" />
          <Skeleton className="mt-2 h-5 w-3/4 max-w-sm" />
          <Skeleton className="mt-8 h-20 w-full max-w-xl rounded-2xl" />
          <div className="mt-9 grid max-w-xl gap-4 sm:grid-cols-3">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        </div>
        <Skeleton className="aspect-[5/6] w-full max-w-[34rem] rounded-[2rem] lg:ml-auto" />
      </div>
    </div>
  );
}
