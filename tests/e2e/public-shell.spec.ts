import { expect, test } from "@playwright/test";

test.describe("bilingual public shell", () => {
  test("redirects the root, switches language, and remembers the choice", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Ethiopia is calling/i,
      }),
    ).toBeVisible();

    await page.locator('a[hreflang="am"]:visible').first().click();

    await expect(page).toHaveURL(/\/am$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "am");
    await expect(
      page.getByRole("heading", { level: 1, name: /ኢትዮጵያ/ }),
    ).toBeVisible();

    await page.goto("/");
    await expect(page).toHaveURL(/\/am$/);
  });

  test("uses locale-aware destination search and validation", async ({ page }) => {
    await page.goto("/en");

    const searchInput = page.getByRole("searchbox", {
      name: "Search destinations",
    });
    const searchButton = page.getByRole("button", {
      name: "Search",
      exact: true,
    });

    await searchButton.click();
    await expect(page.getByText("Enter at least 2 characters.")).toBeVisible();

    await searchInput.fill("Lalibela");
    await searchButton.click();

    await expect(page).toHaveURL(/\/en\/destinations\?q=Lalibela$/);
    await expect(page.getByText("Your search")).toBeVisible();
    await expect(page.getByText(/Lalibela/)).toBeVisible();
  });

  test("provides skip navigation, landmarks and baseline security headers", async ({
    page,
  }) => {
    const response = await page.goto("/en");

    expect(response?.status()).toBe(200);
    await expect(page.locator("main#main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();

    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();

    const headers = response?.headers() ?? {};
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
    expect(headers["strict-transport-security"]).toContain("max-age=");
  });

  test("opens, labels and dismisses the mobile navigation", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile-chromium",
      "Mobile navigation is only visible below the xl breakpoint.",
    );

    await page.goto("/en");
    await page.getByRole("button", { name: "Open menu" }).click();

    const dialog = page.getByRole("dialog", { name: "Main navigation" });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("link", { name: /Destinations/ }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("renders a bilingual global 404 with a 404 status", async ({ page }) => {
    const response = await page.goto("/en/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Continue in English" })).toBeVisible();
  });
});
