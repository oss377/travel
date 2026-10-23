import { MapPin } from "lucide-react";

type HeroVisualProps = {
  label: string;
  regionLabel: string;
  note: string;
  languageLabel: string;
};

export function HeroVisual({
  label,
  regionLabel,
  note,
  languageLabel,
}: HeroVisualProps) {
  return (
    <div className="relative mx-auto w-full max-w-[34rem] lg:ml-auto">
      <div
        aria-hidden="true"
        className="absolute -inset-3 rounded-[2.4rem] border border-gold-200/70 sm:-inset-4"
      />
      <div className="relative overflow-hidden rounded-[2rem] border border-forest-800/30 bg-forest-900 shadow-lifted">
        <svg
          role="img"
          aria-label={label}
          viewBox="0 0 640 700"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hero-sky" x1="320" y1="0" x2="320" y2="700">
              <stop offset="0" stopColor="#176348" />
              <stop offset="0.62" stopColor="#0F4D38" />
              <stop offset="1" stopColor="#062B1F" />
            </linearGradient>
            <radialGradient id="hero-sun" cx="0.4" cy="0.35" r="0.7">
              <stop offset="0" stopColor="#F8EFD4" />
              <stop offset="0.55" stopColor="#E3C874" />
              <stop offset="1" stopColor="#B38A1E" />
            </radialGradient>
            <linearGradient id="hero-hill-back" x1="320" y1="330" x2="320" y2="620">
              <stop offset="0" stopColor="#237B5B" />
              <stop offset="1" stopColor="#0F4D38" />
            </linearGradient>
            <linearGradient id="hero-hill-mid" x1="320" y1="430" x2="320" y2="700">
              <stop offset="0" stopColor="#0F4D38" />
              <stop offset="1" stopColor="#0A3B2B" />
            </linearGradient>
            <linearGradient id="hero-hill-front" x1="320" y1="530" x2="320" y2="700">
              <stop offset="0" stopColor="#0A3B2B" />
              <stop offset="1" stopColor="#041F16" />
            </linearGradient>
          </defs>

          <rect width="640" height="700" fill="url(#hero-sky)" />
          <circle
            cx="468"
            cy="164"
            r="108"
            fill="none"
            stroke="#E3C874"
            strokeOpacity="0.18"
            strokeWidth="1.5"
          />
          <circle cx="468" cy="164" r="76" fill="url(#hero-sun)" />
          <circle cx="468" cy="164" r="90" fill="none" stroke="#F8EFD4" strokeOpacity="0.18" />

          <g fill="#F8EFD4" opacity="0.55">
            <circle cx="92" cy="96" r="1.5" />
            <circle cx="170" cy="132" r="1" />
            <circle cx="256" cy="74" r="1.2" />
            <circle cx="366" cy="118" r="1" />
            <circle cx="558" cy="84" r="1.4" />
            <circle cx="596" cy="206" r="1" />
          </g>

          <path
            d="M0 420C84 374 143 392 208 346C278 297 330 318 398 274C466 230 548 266 640 220V700H0Z"
            fill="url(#hero-hill-back)"
            opacity="0.9"
          />
          <path
            d="M0 476L104 362L190 438L294 326L402 448L514 336L640 446V700H0Z"
            fill="#176348"
            opacity="0.55"
          />
          <path
            d="M0 476L104 362L190 438L294 326L402 448L514 336L640 446"
            fill="none"
            stroke="#8BC0A9"
            strokeOpacity="0.28"
            strokeWidth="1.5"
          />
          <path
            d="M0 540C98 474 176 508 248 472C330 431 394 470 470 430C540 394 588 424 640 408V700H0Z"
            fill="url(#hero-hill-mid)"
          />
          <path
            d="M0 540C98 474 176 508 248 472C330 431 394 470 470 430C540 394 588 424 640 408"
            fill="none"
            stroke="#D0AA42"
            strokeOpacity="0.32"
            strokeWidth="1.5"
          />
          <path
            d="M0 612C88 570 164 606 246 570C326 534 402 566 474 540C548 514 596 538 640 516V700H0Z"
            fill="url(#hero-hill-front)"
          />
          <path
            d="M0 612C88 570 164 606 246 570C326 534 402 566 474 540C548 514 596 538 640 516"
            fill="none"
            stroke="#E3C874"
            strokeOpacity="0.22"
            strokeWidth="1.5"
          />

          <path
            d="M364 700C346 642 402 606 390 562C380 526 330 508 344 470"
            fill="none"
            stroke="#E3C874"
            strokeOpacity="0.5"
            strokeWidth="2"
            strokeDasharray="3 11"
            strokeLinecap="round"
          />

          <g>
            <path
              d="M102 620V522"
              stroke="#041F16"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M102 560C76 542 62 520 58 494"
              stroke="#041F16"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M102 548C128 526 142 506 146 484"
              stroke="#041F16"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="58" cy="486" r="28" fill="#041F16" />
            <circle cx="146" cy="476" r="34" fill="#041F16" />
            <circle cx="102" cy="470" r="40" fill="#041F16" />
            <circle cx="76" cy="516" r="26" fill="#041F16" />
            <circle cx="128" cy="520" r="24" fill="#041F16" />
          </g>

          <g stroke="#E3C874" strokeOpacity="0.5" strokeWidth="1" fill="none">
            <path d="M28 28H84" />
            <path d="M28 28V84" />
            <path d="M612 672H556" />
            <path d="M612 672V616" />
          </g>
        </svg>

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-forest-950/45 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ivory backdrop-blur sm:left-5 sm:top-5">
          <MapPin aria-hidden="true" className="size-3.5 text-gold-300" />
          {regionLabel}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 sm:bottom-5 sm:left-5 sm:right-5">
          <div className="max-w-[17rem] rounded-2xl border border-white/15 bg-forest-950/55 p-3.5 text-ivory backdrop-blur">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-gold-300">
              {languageLabel}
            </p>
            <p className="mt-1 text-sm font-medium leading-6">{note}</p>
          </div>
          <div
            aria-hidden="true"
            className="hidden size-14 items-center justify-center rounded-full border border-white/15 bg-forest-950/35 text-gold-300 backdrop-blur sm:flex"
          >
            <svg viewBox="0 0 32 32" className="size-7" fill="none">
              <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.2" />
              <path d="M16 9L18.5 16L16 23L13.5 16L16 9Z" fill="currentColor" opacity="0.8" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
