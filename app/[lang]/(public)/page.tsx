import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Castle,
  CircleCheck,
  Compass,
  CreditCard,
  FileText,
  Gem,
  Languages,
  Landmark,
  ListChecks,
  Mountain,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Trees,
  UtensilsCrossed,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { CategoryCard } from "@/components/marketing/category-card";
import { DestinationSearchForm } from "@/components/marketing/destination-search-form";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollRail } from "@/components/ui/scroll-rail";
import { TextLink } from "@/components/ui/text-link";
import { categoryKeys, type CategoryKey } from "@/lib/content/categories";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";
import { buildLocaleMetadata } from "@/lib/i18n/metadata";
import { localizedPath } from "@/lib/i18n/paths";

const categoryIcons: Record<CategoryKey, LucideIcon> = {
  religious: Landmark,
  heritage: Sparkles,
  cities: Building2,
  luxury: Gem,
  mountains: Mountain,
  parks: Trees,
  water: Waves,
  historical: Castle,
  adventure: Compass,
  community: Users,
  food: UtensilsCrossed,
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  return buildLocaleMetadata({
    locale: lang,
    title: dict.meta.title,
    description: dict.meta.description,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const destinationsHref = localizedPath(lang, "/destinations");

  const trustItems = [
    {
      Icon: Languages,
      ...dict.home.trust.bilingual,
    },
    {
      Icon: ReceiptText,
      ...dict.home.trust.pricing,
    },
    {
      Icon: ShieldCheck,
      ...dict.home.trust.rules,
    },
  ];

  const steps = [
    {
      Icon: Compass,
      ...dict.home.steps.one,
    },
    {
      Icon: ListChecks,
      ...dict.home.steps.two,
    },
    {
      Icon: CreditCard,
      ...dict.home.steps.three,
    },
  ];

  const transparencyItems = [
    {
      Icon: FileText,
      ...dict.home.transparency.rules,
    },
    {
      Icon: ShieldCheck,
      ...dict.home.transparency.payments,
    },
    {
      Icon: CircleCheck,
      ...dict.home.transparency.audit,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70 bg-ivory">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="pattern-grid absolute inset-0 opacity-50" />
          <div className="absolute -right-44 -top-52 size-[36rem] rounded-full bg-gold-200/30 blur-3xl" />
          <div className="absolute -left-40 bottom-0 size-[26rem] rounded-full bg-forest-100/80 blur-3xl" />
        </div>

        <div className="site-container relative grid items-center gap-12 py-14 sm:py-16 lg:grid-cols-[1.03fr_0.97fr] lg:gap-16 lg:py-24">
          <div>
            <Badge
              variant="gold"
              className="animate-slide-up border-gold-300/70 bg-gold-100/85"
            >
              <Sparkles aria-hidden="true" className="size-3.5" />
              {dict.home.eyebrow}
            </Badge>

            <h1 className="mt-6 max-w-2xl font-display text-[2.7rem] font-semibold leading-[1.03] tracking-[-0.035em] text-forest-950 sm:text-6xl lg:text-[4.2rem]">
              <span className="block">{dict.home.title}</span>
              <span className="relative mt-1 inline-block text-forest-700">
                <span className="relative z-10">{dict.home.titleAccent}</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-1 h-3 -rotate-1 rounded-full bg-gold-300/55"
                />
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {dict.home.description}
            </p>

            <DestinationSearchForm
              locale={lang}
              label={dict.home.searchLabel}
              placeholder={dict.home.searchPlaceholder}
              submitLabel={dict.home.searchSubmit}
              hint={dict.home.searchHint}
              errorShort={dict.home.searchErrorShort}
              errorLong={dict.home.searchErrorLong}
            />

            <ul className="mt-9 grid max-w-xl gap-x-5 gap-y-4 sm:grid-cols-3">
              {trustItems.map(({ Icon, title, description }) => (
                <li key={title} className="flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-forest-200 bg-white text-forest-700 shadow-xs [&_svg]:size-4">
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-5 text-forest-950">
                      {title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Reveal className="lg:pl-4">
            <HeroVisual
              label={dict.home.heroAlt}
              regionLabel={dict.home.heroVisual.regionLabel}
              note={dict.home.heroVisual.note}
              languageLabel={dict.home.heroVisual.languageLabel}
            />
          </Reveal>
        </div>
      </section>

      <section
        aria-labelledby="categories-heading"
        className="border-b border-border/70 bg-background py-16 sm:py-20"
      >
        <div className="site-container">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                titleId="categories-heading"
                eyebrow={dict.home.categories.eyebrow}
                title={dict.home.categories.title}
                description={dict.home.categories.description}
              />
              <TextLink href={destinationsHref} showArrow className="shrink-0">
                {dict.actions.exploreDestinations}
              </TextLink>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="mt-9">
            <ScrollRail
              ariaLabel={dict.a11y.categoryRail}
              previousLabel={dict.a11y.previous}
              nextLabel={dict.a11y.next}
              autoScroll={false}
            >
              {categoryKeys.map((key) => {
                const Icon = categoryIcons[key];
                const category = dict.categories[key];

                return (
                  <CategoryCard
                    key={key}
                    href={`${destinationsHref}?category=${key}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex size-11 items-center justify-center rounded-2xl border border-forest-200 bg-forest-50 text-forest-700 transition-colors group-hover:bg-white">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 text-forest-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </div>
                    <h3 className="mt-6 font-display text-lg font-semibold leading-snug text-forest-950">
                      {category.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                      {category.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-forest-600">
                      {dict.home.categories.action}
                      <ArrowRight aria-hidden="true" className="size-3.5" />
                    </span>
                  </CategoryCard>
                );
              })}
            </ScrollRail>
          </Reveal>
        </div>
      </section>

      <section
        aria-labelledby="steps-heading"
        className="relative overflow-hidden bg-forest-950 py-16 text-ivory sm:py-20"
      >
        <div
          aria-hidden="true"
          className="pattern-grid-inverse pointer-events-none absolute inset-0 opacity-60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-16 size-80 rounded-full bg-gold-400/10 blur-3xl"
        />

        <div className="site-container relative">
          <Reveal>
            <SectionHeading
              titleId="steps-heading"
              eyebrow={dict.home.steps.eyebrow}
              title={dict.home.steps.title}
              description={dict.home.steps.description}
              tone="dark"
            />
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map(({ Icon, title, description }, index) => (
              <Reveal key={title} delay={index * 0.06}>
                <div className="h-full rounded-card border border-white/10 bg-white/[0.055] p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-gold-300 text-forest-950 shadow-gold [&_svg]:size-5">
                      <Icon aria-hidden="true" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-display text-4xl font-semibold tracking-tight text-white/10"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold text-ivory">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-forest-100/70">
                    {description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.18} className="mt-6">
            <div className="rounded-2xl border border-gold-300/25 bg-gold-300/[0.07] px-5 py-4 text-sm leading-6 text-forest-100/80">
              <span className="font-semibold text-gold-200">
                {dict.home.steps.eyebrow}:{" "}
              </span>
              {dict.home.steps.note}
            </div>
          </Reveal>
        </div>
      </section>

      <section
        aria-labelledby="bilingual-heading"
        className="border-b border-border/70 bg-cream py-16 sm:py-20"
      >
        <div className="site-container grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              titleId="bilingual-heading"
              eyebrow={dict.home.bilingual.eyebrow}
              title={dict.home.bilingual.title}
              description={dict.home.bilingual.description}
            />
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-forest-200 bg-white/65 p-4">
              <Languages
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-forest-600"
              />
              <p className="text-sm font-medium leading-6 text-forest-900">
                {dict.home.bilingual.publishRule}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-card border border-border bg-card p-5 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="secondary">EN</Badge>
                  <span className="text-sm font-semibold text-forest-900">
                    {dict.home.bilingual.englishLabel}
                  </span>
                </div>
                <p
                  lang="en"
                  className="mt-7 font-display text-xl font-medium leading-8 text-forest-950"
                >
                  &ldquo;{dict.home.bilingual.englishSample}&rdquo;
                </p>
              </div>

              <div className="rounded-card border border-gold-300/70 bg-gold-50 p-5 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="gold">አማ</Badge>
                  <span className="text-sm font-semibold text-gold-900">
                    {dict.home.bilingual.amharicLabel}
                  </span>
                </div>
                <p
                  lang="am"
                  className="mt-7 font-ethiopic text-xl font-medium leading-9 text-forest-950"
                >
                  &ldquo;{dict.home.bilingual.amharicSample}&rdquo;
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        aria-labelledby="transparency-heading"
        className="bg-background py-16 sm:py-20"
      >
        <div className="site-container">
          <Reveal>
            <SectionHeading
              titleId="transparency-heading"
              eyebrow={dict.home.transparency.eyebrow}
              title={dict.home.transparency.title}
              description={dict.home.transparency.description}
              align="center"
            />
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {transparencyItems.map(({ Icon, title, description }, index) => (
              <Reveal key={title} delay={index * 0.06}>
                <Card className="h-full border-border/80">
                  <CardContent className="p-6">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-forest-50 text-forest-700 [&_svg]:size-5">
                      <Icon aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-semibold text-forest-950">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="site-container">
          <Reveal>
            <div className="relative overflow-hidden rounded-panel bg-forest-900 px-6 py-12 text-ivory shadow-lifted sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-12">
              <div
                aria-hidden="true"
                className="pattern-grid-inverse pointer-events-none absolute inset-0 opacity-50"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-gold-300/15 blur-3xl"
              />
              <div className="relative max-w-2xl">
                <Badge variant="gold">{dict.home.cta.eyebrow}</Badge>
                <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-ivory sm:text-4xl">
                  {dict.home.cta.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-forest-100/75">
                  {dict.home.cta.description}
                </p>
              </div>
              <div className="relative mt-7 shrink-0 lg:mt-0">
                <Button asChild variant="accent" size="lg">
                  <Link href={destinationsHref}>
                    {dict.home.cta.button}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
