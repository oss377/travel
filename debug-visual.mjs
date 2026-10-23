import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const context = await browser.newContext({
  reducedMotion: "reduce",
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
await page.goto("http://127.0.0.1:3000/en", { waitUntil: "networkidle" });
await page.screenshot({ path: "test-results/en-desktop-reduced-full.png", fullPage: true });
await page.goto("http://127.0.0.1:3000/am", { waitUntil: "networkidle" });
await page.screenshot({ path: "test-results/am-desktop-reduced-full.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:3000/en", { waitUntil: "networkidle" });
await page.screenshot({ path: "test-results/en-mobile-reduced-full.png", fullPage: true });
await page.goto("http://127.0.0.1:3000/am", { waitUntil: "networkidle" });
await page.screenshot({ path: "test-results/am-mobile-reduced-full.png", fullPage: true });
await browser.close();
