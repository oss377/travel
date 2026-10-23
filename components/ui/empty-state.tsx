import * as React from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: React.ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  eyebrow,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "mx-auto flex max-w-xl flex-col items-center rounded-panel border border-dashed border-forest-200 bg-forest-50/60 px-6 py-12 text-center sm:px-10",
        className,
      )}
    >
      {icon ? (
        <div className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-forest-200 bg-white text-forest-700 shadow-soft [&_svg]:size-6">
          {icon}
        </div>
      ) : null}
      {eyebrow ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-forest-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-2xl font-semibold leading-tight text-forest-900 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
        {description}
      </p>
      {action ? <div className="mt-7 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}
