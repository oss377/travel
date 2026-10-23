"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ScrollRailProps = {
  ariaLabel: string;
  previousLabel: string;
  nextLabel: string;
  children: React.ReactNode;
  className?: string;
  autoScroll?: boolean;
  autoScrollIntervalMs?: number;
};

/**
 * Accessible horizontal rail.
 *
 * Automatic scrolling is opt-in, always disabled for reduced-motion users and
 * stops permanently after a manual interaction. Hover and keyboard focus pause
 * it temporarily. Native touch scrolling and keyboard scrolling remain intact.
 */
export function ScrollRail({
  ariaLabel,
  previousLabel,
  nextLabel,
  children,
  className,
  autoScroll = false,
  autoScrollIntervalMs = 5200,
}: ScrollRailProps) {
  const railRef = React.useRef<HTMLDivElement>(null);
  const pausedRef = React.useRef(false);
  const interactedRef = React.useRef(false);
  const shouldReduceMotion = useReducedMotion();
  const [canScrollStart, setCanScrollStart] = React.useState(false);
  const [canScrollEnd, setCanScrollEnd] = React.useState(true);

  const updateScrollState = React.useCallback(() => {
    const node = railRef.current;

    if (!node) {
      return;
    }

    const maxScroll = node.scrollWidth - node.clientWidth;
    setCanScrollStart(node.scrollLeft > 8);
    setCanScrollEnd(maxScroll > 8 && node.scrollLeft < maxScroll - 8);
  }, []);

  React.useEffect(() => {
    const node = railRef.current;

    if (!node) {
      return;
    }

    updateScrollState();
    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateScrollState);
    resizeObserver?.observe(node);

    return () => {
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      resizeObserver?.disconnect();
    };
  }, [updateScrollState]);

  React.useEffect(() => {
    if (!autoScroll || shouldReduceMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      const node = railRef.current;

      if (
        !node ||
        pausedRef.current ||
        interactedRef.current ||
        document.hidden
      ) {
        return;
      }

      const maxScroll = node.scrollWidth - node.clientWidth;

      if (maxScroll <= 8) {
        return;
      }

      if (node.scrollLeft >= maxScroll - 8) {
        node.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      node.scrollBy({
        left: Math.max(280, Math.round(node.clientWidth * 0.75)),
        behavior: "smooth",
      });
    }, autoScrollIntervalMs);

    return () => window.clearInterval(interval);
  }, [autoScroll, autoScrollIntervalMs, shouldReduceMotion]);

  function scrollByDirection(direction: "previous" | "next") {
    const node = railRef.current;

    if (!node) {
      return;
    }

    interactedRef.current = true;
    const distance = Math.max(280, Math.round(node.clientWidth * 0.8));
    node.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }

  function markManualInteraction() {
    interactedRef.current = true;
  }

  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-4 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => scrollByDirection("previous")}
          disabled={!canScrollStart}
          aria-label={previousLabel}
          className="hidden sm:inline-flex"
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => scrollByDirection("next")}
          disabled={!canScrollEnd}
          aria-label={nextLabel}
          className="hidden sm:inline-flex"
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>

      <div
        ref={railRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        onPointerEnter={() => {
          pausedRef.current = true;
        }}
        onPointerLeave={() => {
          pausedRef.current = false;
        }}
        onFocusCapture={() => {
          pausedRef.current = true;
        }}
        onBlurCapture={() => {
          pausedRef.current = false;
        }}
        onPointerDown={markManualInteraction}
        onTouchStart={markManualInteraction}
        onWheel={markManualInteraction}
        onKeyDown={(event) => {
          if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight" ||
            event.key === "Home" ||
            event.key === "End"
          ) {
            markManualInteraction();
          }
        }}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 pt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 sm:-mx-1 sm:px-1"
      >
        {children}
      </div>
    </div>
  );
}
