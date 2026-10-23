import type { Locale } from "./config";

export const errorMessages: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
    retry: string;
    backHome: string;
  }
> = {
  en: {
    eyebrow: "Something went wrong",
    title: "We could not load this page",
    description:
      "Please try again. If the problem continues, return home and try later.",
    retry: "Try again",
    backHome: "Back to home",
  },
  am: {
    eyebrow: "የሆነ ችግር ተፈጥሯል",
    title: "ይህን ገጽ ማምጣት አልቻልንም",
    description:
      "እባክዎ እንደገና ይሞክሩ። ችግሩ ከቀጠለ ወደ መነሻ ተመልሰው በኋላ ይሞክሩ።",
    retry: "እንደገና ሞክር",
    backHome: "ወደ መነሻ ተመለስ",
  },
};
