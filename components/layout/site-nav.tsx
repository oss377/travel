"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { stripLocalePath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

export type SiteNavLink = {
  href: string;
  label: string;
  path: string;
};

type SiteNavProps = {
  links: SiteNavLink[];
  label: string;
  className?: string;
};

export function SiteNav({ links, label, className }: SiteNavProps) {
  const pathname = usePathname();
  const currentPath = stripLocalePath(pathname);

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-0.5">
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
                data-active={isActive}
                className={cn(
                  "inline-flex rounded-full px-3 py-2 text-sm font-semibold text-forest-900/70 transition-colors hover:bg-forest-50 hover:text-forest-900 data-[active=true]:bg-forest-50 data-[active=true]:text-forest-900",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
