import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className={cn("size-10 shrink-0", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="14" fill="#0A3B2B" />
      <circle cx="34.5" cy="14" r="4.25" fill="#E3C874" />
      <path
        d="M10 31.5C15 24.5 19.2 24.5 24 31.5C28.8 24.5 33 24.5 38 31.5"
        stroke="#FBF9F3"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 36.5H35.5"
        stroke="#8BC0A9"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        d="M17.5 20.5L24 13L30.5 20.5"
        stroke="#E3C874"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
