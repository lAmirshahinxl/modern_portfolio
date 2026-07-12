import { expect, test, type Page } from "@playwright/test";

async function openExplorerFile(page: Page, name: RegExp) {
  const desktopLink = page.locator(".desktop-explorer").getByRole("link", { name });
  if (await desktopLink.isVisible()) {
    await desktopLink.click();
    return;
  }

  await page.getByRole("button", { name: "Toggle explorer" }).click();
  await page.locator(".mobile-explorer").getByRole("link", { name }).click();
}

test("renders the profile document at the root route", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Profile — Amir Abasi/);
  await expect(page.getByRole("heading", { level: 1, name: "Amir Abasi." })).toBeVisible();
  await expect(page.locator(".document-headline")).toContainText("Flutter");
  await expect(page.getByRole("heading", { name: "Experience & approach." })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Projects." })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: /profile\.md/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tab")).toHaveCount(3);
  await expect(page.getByRole("tab", { name: /experience\.tsx/ })).toBeVisible();
  await expect(page.getByRole("tab", { name: /projects\.dir/ })).toBeVisible();
  await expect(page.getByRole("tab", { name: /contact\.sh/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Close profile.md" })).toHaveCount(0);
});

test("opens a tab from the explorer and shows that document", async ({ page }) => {
  await page.goto("/");

  await openExplorerFile(page, /contact\.sh/);
  await expect(page).toHaveURL("/contact");
  await expect(page.getByRole("heading", { level: 1, name: "Let's work together." })).toBeVisible();
  await expect(page.getByRole("tab", { name: /contact\.sh/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tab")).toHaveCount(4);
});

test("changes the URL and document when tabs are selected", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: /projects\.dir/ }).click();
  await expect(page).toHaveURL("/projects");
  await expect(page.getByRole("heading", { level: 1, name: "Projects." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bitimen Crypto Currency Application" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Zaban PWA" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Amir Abasi." })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: /projects\.dir/ })).toHaveAttribute("aria-selected", "true");

  await openExplorerFile(page, /contact\.sh/);
  await expect(page).toHaveURL("/contact");
  await expect(page.getByRole("heading", { level: 1, name: "Let's work together." })).toBeVisible();
  await expect(page.getByRole("link", { name: /contact@amirabasi\.info/ })).toHaveAttribute(
    "href",
    "mailto:contact@amirabasi.info",
  );

  await page.goBack();
  await expect(page).toHaveURL("/projects");
  await expect(page.getByRole("heading", { level: 1, name: "Projects." })).toBeVisible();

  await page.goForward();
  await expect(page).toHaveURL("/contact");
  await expect(page.getByRole("heading", { level: 1, name: "Let's work together." })).toBeVisible();
});

test("closes the active tab and returns to the previous tab", async ({ page }) => {
  await page.goto("/");

  await openExplorerFile(page, /contact\.sh/);
  await expect(page.getByRole("tab", { name: /contact\.sh/ })).toHaveAttribute("aria-selected", "true");

  await page.getByRole("button", { name: "Close contact.sh" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("tab", { name: /contact\.sh/ })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: /profile\.md/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("button", { name: "Close profile.md" })).toHaveCount(0);
});

test("opens secondary explorer files as their own tabs", async ({ page }) => {
  await page.goto("/");

  await openExplorerFile(page, /skills\.json/);
  await expect(page).toHaveURL("/skills");
  await expect(page.getByRole("heading", { level: 1, name: "skills.json" })).toBeVisible();
  await expect(page.getByRole("tab", { name: /skills\.json/ })).toHaveAttribute("aria-selected", "true");

  await openExplorerFile(page, /peer_reviews\.log/);
  await expect(page).toHaveURL("/peer-reviews");
  await expect(page.getByRole("heading", { level: 1, name: "peer_reviews.log" })).toBeVisible();

  await openExplorerFile(page, /coding_activity\.log/);
  await expect(page).toHaveURL("/coding-activity");
  await expect(page.getByRole("heading", { level: 1, name: "coding_activity.log" })).toBeVisible();
});

test("supports direct visits and refreshes for every document", async ({ page }) => {
  const routes = [
    { path: "/experience", heading: "Experience & approach.", tab: /experience\.tsx/ },
    { path: "/projects", heading: "Projects.", tab: /projects\.dir/ },
    { path: "/skills", heading: "skills.json", tab: /skills\.json/ },
    { path: "/peer-reviews", heading: "peer_reviews.log", tab: /peer_reviews\.log/ },
    { path: "/coding-activity", heading: "coding_activity.log", tab: /coding_activity\.log/ },
    { path: "/contact", heading: "Let's work together.", tab: /contact\.sh/ },
  ];

  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
    await expect(page.getByRole("tab", { name: route.tab })).toHaveAttribute("aria-selected", "true");
    await page.reload();
    await expect(page).toHaveURL(route.path);
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
    await expect(page.getByRole("tab", { name: route.tab })).toHaveAttribute("aria-selected", "true");
  }
});

test("keeps every route inside the viewport", async ({ page }) => {
  for (const route of ["/", "/experience", "/projects", "/skills", "/peer-reviews", "/coding-activity", "/contact"]) {
    await page.goto(route);

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));

    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  }
});

test("supports reduced motion without hiding routed content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/experience");

  await expect(page.getByText("130+", { exact: true })).toBeVisible();
  await expect(page.getByText("Full-stack means owning the path from API to pixel, not handing off half the problem.")).toBeVisible();

  await page.getByRole("tab", { name: /projects\.dir/ }).click();
  await expect(page).toHaveURL("/projects");
  await expect(page.getByRole("heading", { name: "ZalTV Television Application" })).toBeVisible();
});

test("follows the browser color scheme and keeps a theme override during navigation", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  await expect(page.locator(".ide")).not.toHaveAttribute("data-theme");
  await expect(page.locator(".ide")).toHaveCSS("background-color", "rgb(24, 25, 24)");

  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator(".ide")).toHaveAttribute("data-theme", "light");

  await page.getByRole("tab", { name: /experience\.tsx/ }).click();
  await expect(page).toHaveURL("/experience");
  await expect(page.locator(".ide")).toHaveAttribute("data-theme", "light");
});

test("supports mobile explorer navigation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only navigation behavior");
  await page.goto("/");

  await page.getByRole("button", { name: "Toggle explorer" }).click();
  await expect(page.locator(".mobile-explorer")).toBeVisible();
  await page.locator(".mobile-explorer").getByRole("link", { name: /projects\.dir/ }).click();

  await expect(page).toHaveURL("/projects");
  await expect(page.locator(".mobile-explorer")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: "Projects." })).toBeVisible();

  await page.getByRole("button", { name: "Toggle explorer" }).click();
  await page.locator(".mobile-explorer").getByRole("link", { name: /contact\.sh/ }).click();
  await expect(page).toHaveURL("/contact");
  await expect(page.getByRole("tab", { name: /contact\.sh/ })).toHaveAttribute("aria-selected", "true");
});
