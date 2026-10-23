import { BrandMark } from "@/components/brand/brand-mark";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  name: string;
  tagline?: string;
  tone?: "light" | "dark";
  showTagline?: boolean;
  className?: string;
};

export function BrandLockup({
  name,
  tagline,
  tone = "light",
  showTagline = true,
  className,
}: BrandLockupProps) {
  const isDark = tone === "dark";

  return (
    <span className={cn("flex min-w-0 items-center gap-3", className)}>
      <BrandMark className="size-10" />
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "max-w-[13rem] font-display text-sm font-semibold leading-tight tracking-tight sm:text-[0.95rem]",
            isDark ? "text-ivory" : "text-forest-950",
          )}
        >
          {name}
        </span>
        {showTagline && tagline ? (
          <span
            className={cn(
              "mt-1 text-[0.6rem] font-bold uppercase leading-tight tracking-[0.16em]",
              isDark ? "text-gold-300" : "text-forest-600",
            )}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
