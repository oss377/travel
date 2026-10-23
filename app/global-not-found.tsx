import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import { geistMono, geistSans, notoEthiopic } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found | Lucky Travel Ethiopia",
  description: "The page you are looking for does not exist or has moved.",
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} ${notoEthiopic.variable} antialiased`}
    >
      <body className="bg-forest-950 text-ivory">
        <a href="#main" className="skip-link">
          Skip to content / ወደ ዋና ይዘት ዝለል
        </a>
        <main
          id="main"
          className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-16"
        >
          <div
            aria-hidden="true"
            className="pattern-grid-inverse pointer-events-none absolute inset-0 opacity-50"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-0 size-96 rounded-full bg-gold-300/10 blur-3xl"
          />

          <div className="relative w-full max-w-2xl rounded-panel border border-white/10 bg-white/[0.05] p-7 text-center shadow-lifted backdrop-blur sm:p-12">
            <BrandMark className="mx-auto size-14" />
            <p className="mt-7 text-7xl font-semibold tracking-tight text-gold-300 sm:text-8xl">
              404
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ivory sm:text-4xl">
              Page not found
            </h1>
            <p className="mt-2 font-ethiopic text-2xl font-semibold leading-10 text-ivory">
              ገጹ አልተገኘም
            </p>

            <div className="mt-5 space-y-3 text-sm leading-7 text-forest-100/70">
              <p>The page you are looking for does not exist or has moved.</p>
              <p lang="am" className="font-ethiopic leading-8">
                የፈለጉት ገጽ የለም ወይም ተንቀሳቅሷል።
              </p>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="accent" size="lg">
                <Link href="/en">Continue in English</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 bg-transparent text-ivory hover:border-white/35 hover:bg-white/10 hover:text-ivory"
              >
                <Link href="/am" lang="am" hrefLang="am">
                  በአማርኛ ይቀጥሉ
                </Link>
              </Button>
            </div>

            <p className="mt-8 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-forest-100/45">
              Lucky Travel Ethiopia
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
