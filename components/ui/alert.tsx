import * as React from "react";
import { CircleCheck, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const alertStyles = {
  info: {
    container: "border-forest-200 bg-forest-50 text-forest-900",
    icon: "text-forest-600",
    Icon: Info,
  },
  warning: {
    container: "border-gold-300 bg-gold-50 text-gold-900",
    icon: "text-gold-700",
    Icon: TriangleAlert,
  },
  success: {
    container: "border-forest-200 bg-forest-50 text-forest-900",
    icon: "text-success",
    Icon: CircleCheck,
  },
} as const;

type AlertProps = React.ComponentProps<"div"> & {
  variant?: keyof typeof alertStyles;
  title?: string;
};

export function Alert({
  className,
  variant = "info",
  title,
  children,
  ...props
}: AlertProps) {
  const style = alertStyles[variant];
  const Icon = style.Icon;

  return (
    <div
      data-slot="alert"
      role="note"
      className={cn(
        "flex gap-3 rounded-2xl border px-4 py-3 text-sm leading-6",
        style.container,
        className,
      )}
      {...props}
    >
      <Icon aria-hidden="true" className={cn("mt-0.5 size-5 shrink-0", style.icon)} />
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={cn(title && "mt-1 opacity-90")}>{children}</div>
      </div>
    </div>
  );
}
