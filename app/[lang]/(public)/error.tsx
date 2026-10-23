"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Home, RotateCcw, TriangleAlert } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import { errorMessages } from "@/lib/i18n/system-messages";

export default function PublicError({ reset }: { reset: () => void }) {
  const params = useParams<{ lang: string }>();
  const locale: Locale = params.lang === "am" ? "am" : "en";
  const copy = errorMessages[locale];

  return (
    <section
      role="alert"
      className="site-container flex min-h-[60vh] items-center py-16 sm:py-24"
    >
      <div className="mx-auto w-full max-w-xl rounded-panel border border-border bg-card p-6 text-center shadow-soft sm:p-10">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-destructive">
          <TriangleAlert aria-hidden="true" className="size-3.5" />
          {copy.eyebrow}
        </div>
        <BrandMark className="mx-auto mt-6 size-12" />
        <h1 className="mt-5 font-display text-2xl font-semibold leading-tight text-forest-950 sm:text-3xl">
          {copy.title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
          {copy.description}
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            <RotateCcw aria-hidden="true" />
            {copy.retry}
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}`}>
              <Home aria-hidden="true" />
              {copy.backHome}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
