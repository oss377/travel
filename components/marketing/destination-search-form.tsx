"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/paths";
import {
  destinationSearchSchema,
  type DestinationSearchInput,
} from "@/lib/validation/search";

type DestinationSearchFormProps = {
  locale: Locale;
  label: string;
  placeholder: string;
  submitLabel: string;
  hint: string;
  errorShort: string;
  errorLong: string;
};

export function DestinationSearchForm({
  locale,
  label,
  placeholder,
  submitLabel,
  hint,
  errorShort,
  errorLong,
}: DestinationSearchFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DestinationSearchInput>({
    resolver: zodResolver(destinationSearchSchema),
    defaultValues: { q: "" },
    mode: "onSubmit",
  });

  const errorMessage =
    errors.q?.message === "search.tooLong" ? errorLong : errorShort;
  const hasError = Boolean(errors.q);
  const inputId = "destination-search";
  const errorId = "destination-search-error";
  const hintId = "destination-search-hint";

  function onSubmit(values: DestinationSearchInput) {
    const query = new URLSearchParams({ q: values.q });
    router.push(`${localizedPath(locale, "/destinations")}?${query.toString()}`);
  }

  return (
    <form
      role="search"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 max-w-xl"
    >
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="flex flex-col gap-2 rounded-2xl border border-forest-200 bg-card p-2 shadow-soft sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-forest-500"
          />
          <Input
            id={inputId}
            type="search"
            autoComplete="off"
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${errorId} ${hintId}` : hintId}
            className="h-12 border-0 bg-transparent pl-11 shadow-none focus-visible:ring-0"
            {...register("q")}
          />
        </div>
        <Button type="submit" size="lg" className="sm:min-w-32">
          {submitLabel}
        </Button>
      </div>
      {hasError ? (
        <p
          id={errorId}
          role="alert"
          className="mt-2 pl-2 text-sm font-medium text-destructive"
        >
          {errorMessage}
        </p>
      ) : null}
      <p id={hintId} className="mt-2 pl-2 text-xs leading-5 text-muted-foreground">
        {hint}
      </p>
    </form>
  );
}
