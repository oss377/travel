import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  titleId?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
  titleId,
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-xs font-bold uppercase tracking-[0.2em]",
            isDark ? "text-gold-300" : "text-forest-600",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={titleId}
        className={cn(
          "font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem]",
          isDark ? "text-ivory" : "text-forest-950",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-7 sm:text-lg sm:leading-8",
            isDark ? "text-forest-100/80" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
