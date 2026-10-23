import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

export function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  const safeTotal = Math.max(1, Math.floor(totalPages));
  const safeCurrent = Math.min(Math.max(1, Math.floor(currentPage)), safeTotal);

  if (safeTotal <= 1) {
    return [1];
  }

  if (safeTotal <= 7) {
    return Array.from({ length: safeTotal }, (_, index) => index + 1);
  }

  const start = Math.max(2, safeCurrent - 1);
  const end = Math.min(safeTotal - 1, safeCurrent + 1);
  const items: PaginationItem[] = [1];

  if (start > 2) {
    items.push("ellipsis-start");
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < safeTotal - 1) {
    items.push("ellipsis-end");
  }

  items.push(safeTotal);

  return items;
}

type PaginationLabels = {
  navigation: string;
  previous: string;
  next: string;
  page: (page: number) => string;
};

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  labels: PaginationLabels;
  className?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  buildHref,
  labels,
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const safeCurrent = Math.min(Math.max(1, currentPage), totalPages);
  const items = getPaginationItems(safeCurrent, totalPages);
  const previousPage = Math.max(1, safeCurrent - 1);
  const nextPage = Math.min(totalPages, safeCurrent + 1);

  return (
    <nav aria-label={labels.navigation} className={cn("w-full", className)}>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {safeCurrent > 1 ? (
            <Link
              href={buildHref(previousPage)}
              rel="prev"
              aria-label={labels.previous}
              className={buttonVariants({ variant: "outline", size: "icon-sm" })}
            >
              <ChevronLeft aria-hidden="true" />
            </Link>
          ) : (
            <span
              aria-disabled="true"
              aria-label={labels.previous}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon-sm" }),
                "pointer-events-none opacity-40",
              )}
            >
              <ChevronLeft aria-hidden="true" />
            </span>
          )}
        </li>

        {items.map((item) => (
          <li key={item}>
            {typeof item === "number" ? (
              item === safeCurrent ? (
                <span
                  aria-current="page"
                  aria-label={labels.page(item)}
                  className={buttonVariants({ variant: "primary", size: "icon-sm" })}
                >
                  {item}
                </span>
              ) : (
                <Link
                  href={buildHref(item)}
                  aria-label={labels.page(item)}
                  className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                >
                  {item}
                </Link>
              )
            ) : (
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center text-muted-foreground"
              >
                &hellip;
              </span>
            )}
          </li>
        ))}

        <li>
          {safeCurrent < totalPages ? (
            <Link
              href={buildHref(nextPage)}
              rel="next"
              aria-label={labels.next}
              className={buttonVariants({ variant: "outline", size: "icon-sm" })}
            >
              <ChevronRight aria-hidden="true" />
            </Link>
          ) : (
            <span
              aria-disabled="true"
              aria-label={labels.next}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon-sm" }),
                "pointer-events-none opacity-40",
              )}
            >
              <ChevronRight aria-hidden="true" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
