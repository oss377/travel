import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://127.0.0.1:3000/en", { waitUntil: "networkidle" });

const report = await page.evaluate(() => {
  const header = document.querySelector("header");
  const announcement = document.querySelector(".bg-forest-900");
  const skip = document.querySelector(".skip-link");
  const sheet = document.querySelector('link[rel="stylesheet"]');
  return {
    forcedColors: matchMedia("(forced-colors: active)").matches,
    prefersContrast: matchMedia("(prefers-contrast: more)").matches,
    colorScheme: matchMedia("(prefers-color-scheme: dark)").matches,
    stylesheet: sheet?.getAttribute("href"),
    styleSheets: Array.from(document.styleSheets).map((item) => ({
      href: item.href,
      rules: (() => {
        try {
          return item.cssRules.length;
        } catch {
          return "blocked";
        }
      })(),
    })),
    headerBackground: header ? getComputedStyle(header).backgroundColor : null,
    announcementBackground: announcement
      ? getComputedStyle(announcement).backgroundColor
      : null,
    bodyBackground: getComputedStyle(document.body).backgroundColor,
    skipTransform: skip ? getComputedStyle(skip).transform : null,
    skipPosition: skip ? getComputedStyle(skip).position : null,
    skipTop: skip ? getComputedStyle(skip).top : null,
  };
});

console.log(JSON.stringify(report, null, 2));
await page.screenshot({ path: "test-results/debug-home.png", fullPage: false });
await browser.close();
