"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import type { SiteNavLink } from "@/components/layout/site-nav";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import { stripLocalePath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  locale: Locale;
  links: SiteNavLink[];
  brandName: string;
  tagline: string;
  menuLabel: string;
  openLabel: string;
  closeLabel: string;
  languageLabel: string;
  exploreLabel: string;
  exploreHref: string;
};

export function MobileNav({
  locale,
  links,
  brandName,
  tagline,
  menuLabel,
  openLabel,
  closeLabel,
  languageLabel,
  exploreLabel,
  exploreHref,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const currentPath = stripLocalePath(pathname);
  const shouldReduceMotion = useReducedMotion();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={openLabel}
          className="xl:hidden"
        >
          <Menu aria-hidden="true" className="size-5" />
        </Button>
      </DialogPrimitive.Trigger>

      <AnimatePresence>
        {open ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.2,
                  ease: "easeOut",
                }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content
              asChild
              forceMount
              aria-describedby={undefined}
            >
              <m.div
                className="fixed inset-y-0 right-0 z-50 flex w-[min(23rem,calc(100%-2rem))] flex-col overflow-y-auto border-l border-border bg-ivory p-5 shadow-lifted focus:outline-none"
                initial={{ x: shouldReduceMotion ? 0 : "100%" }}
                animate={{ x: 0 }}
                exit={{ x: shouldReduceMotion ? 0 : "100%" }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <DialogPrimitive.Title className="sr-only">
                  {menuLabel}
                </DialogPrimitive.Title>

                <div className="flex items-center justify-between gap-4">
                  <BrandLockup
                    name={brandName}
                    tagline={tagline}
                    showTagline={false}
                  />
                  <DialogPrimitive.Close
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={closeLabel}
                  >
                    <X aria-hidden="true" className="size-5" />
                  </DialogPrimitive.Close>
                </div>

                <nav aria-label={menuLabel} className="mt-10">
                  <ul className="flex flex-col gap-1">
                    {links.map((link) => {
                      const isActive =
                        link.path === "/"
                          ? currentPath === "/"
                          : currentPath === link.path ||
                            currentPath.startsWith(`${link.path}/`);

                      return (
                        <li key={link.path}>
                          <Link
                            href={link.href}
                            aria-current={isActive ? "page" : undefined}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-forest-900/80 transition-colors hover:bg-forest-50 hover:text-forest-900",
                              isActive &&
                                "bg-forest-50 text-forest-900",
                            )}
                          >
                            {link.label}
                            <span
                              aria-hidden="true"
                              className="text-forest-400"
                            >
                              &rarr;
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <div className="mt-auto space-y-5 border-t border-border pt-6">
                  <LocaleSwitcher
                    locale={locale}
                    label={languageLabel}
                    className="w-full justify-between"
                  />
                  <Button asChild className="w-full" size="lg">
                    <Link href={exploreHref} onClick={() => setOpen(false)}>
                      {exploreLabel}
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </m.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
