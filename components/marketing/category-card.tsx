"use client";

import * as React from "react";
import Link from "next/link";
import { m } from "framer-motion";

type CategoryCardProps = {
  href: string;
  children: React.ReactNode;
};

export function CategoryCard({ href, children }: CategoryCardProps) {
  return (
    <m.div
      data-slot="category-card"
      className="h-full w-[17rem] shrink-0 snap-start sm:w-[18rem]"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    >
      <Link
        href={href}
        className="group flex h-full min-h-[15rem] flex-col rounded-card border border-border/90 bg-card p-5 shadow-soft transition-colors hover:border-forest-300 hover:bg-forest-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {children}
      </Link>
    </m.div>
  );
}
