import { expect, test } from "@playwright/test";

test("renders the portfolio content and navigation", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Amir Abasi/);
  await expect(page.getByRole("heading", { level: 1, name: "Amir Abasi." })).toBeVisible();
  await expect(page.locator(".document-headline")).toContainText("Flutter");
  await expect(page.getByRole("heading", { name: "By the numbers" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How I work" })).toBeVisible();
  await expect(page.getByRole("link", { name: /contact@amirabasi\.info/ })).toHaveAttribute(
    "href",
    "mailto:contact@amirabasi.info",
  );
});

test("keeps every section inside the viewport", async ({ page }) => {
  await page.goto("/");

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));

  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});

test("supports reduced motion without hiding content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByText("130+", { exact: true })).toBeVisible();
  await expect(page.getByText("Full-stack means owning the path from API to pixel, not handing off half the problem.")).toBeVisible();
});

test("follows the browser color scheme and allows theme toggle", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  await expect(page.locator(".ide")).not.toHaveAttribute("data-theme");
  await expect(page.locator(".ide")).toHaveCSS("background-color", "rgb(24, 25, 24)");

  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator(".ide")).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator(".ide")).toHaveAttribute("data-theme", "dark");
});

test("supports editor controls and mobile navigation", async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator(".ide")).toHaveAttribute("data-theme", "dark");

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Toggle explorer" }).click();
    await expect(page.locator(".mobile-explorer")).toBeVisible();
    await page.getByRole("button", { name: "Close explorer" }).click();
    await expect(page.locator(".mobile-explorer")).toHaveCount(0);
  }

  await page.getByRole("tab", { name: /contact\.sh/ }).click();
  await expect(page.getByRole("heading", { name: "04 · CONTACT" })).toBeInViewport();
});
