import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type TextLinkProps = React.ComponentProps<"a"> & {
  href: string;
  showArrow?: boolean;
  external?: boolean;
};

export function TextLink({
  className,
  children,
  showArrow = false,
  external = false,
  href,
  ...props
}: TextLinkProps) {
  const classes = cn(
    "inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-forest-700 underline-offset-4 transition-colors hover:text-forest-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      >
        {children}
        {showArrow ? <ArrowUpRight aria-hidden="true" className="size-4" /> : null}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
      {showArrow ? <ArrowUpRight aria-hidden="true" className="size-4" /> : null}
    </Link>
  );
}
