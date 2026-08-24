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

test("renders the redesigned landing page at the root route", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Amir Abasi — Full Stack Developer \| Flutter & React Specialist/);
  await expect(page.getByRole("heading", { level: 1, name: /I build software that feels clear/ })).toBeVisible();
  await expect(page.locator(".parallax")).toHaveCount(1);
  await expect(page.locator("[data-parallax-layer]")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: /A calm hand for/ })).toBeVisible();
  await expect(page.locator(".landing-project")).toHaveCount(6);
  await expect(page.getByRole("link", { name: "Open developer view" })).toHaveAttribute("href", "/developer-view");
  await expect(page.locator(".ide")).toHaveCount(0);
});

test("keeps the original IDE portfolio at the developer view route", async ({ page }) => {
  await page.goto("/developer-view");

  await expect(page.getByRole("heading", { level: 1, name: "Amir Abasi." })).toBeVisible();
  await expect(page.locator(".ide")).toHaveCount(1);
  await expect(page.getByRole("tab", { name: /profile\.md/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tab")).toHaveCount(3);
});

test("opens a developer document from the explorer", async ({ page }) => {
  await page.goto("/developer-view");

  await openExplorerFile(page, /contact\.sh/);
  await expect(page).toHaveURL("/developer-view/contact");
  await expect(page.getByRole("heading", { level: 1, name: "Let's build something together." })).toBeVisible();
  await expect(page.getByRole("tab", { name: /contact\.sh/ })).toHaveAttribute("aria-selected", "true");
});

test("navigates between developer tabs and keeps history working", async ({ page }) => {
  await page.goto("/developer-view");

  await page.getByRole("tab", { name: /projects\.dir/ }).click();
  await expect(page).toHaveURL("/developer-view/projects");
  await expect(page.getByRole("heading", { name: "Bitimen Crypto Currency Application" })).toBeVisible();

  await openExplorerFile(page, /contact\.sh/);
  await expect(page).toHaveURL("/developer-view/contact");
  await expect(page.getByRole("link", { name: /contact@amirabasi\.info/ })).toHaveAttribute(
    "href",
    "mailto:contact@amirabasi.info",
  );

  await page.goBack();
  await expect(page).toHaveURL("/developer-view/projects");
  await page.goForward();
  await expect(page).toHaveURL("/developer-view/contact");
});

test("closes the active developer tab and returns to the previous file", async ({ page }) => {
  await page.goto("/developer-view");

  await openExplorerFile(page, /contact\.sh/);
  await page.getByRole("button", { name: "Close contact.sh" }).click();
  await expect(page).toHaveURL("/developer-view");
  await expect(page.getByRole("tab", { name: /contact\.sh/ })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: /profile\.md/ })).toHaveAttribute("aria-selected", "true");
});

test("opens each developer file as a deep link", async ({ page }) => {
  const routes = [
    { path: "/developer-view/experience", heading: "Experience & approach.", tab: /experience\.tsx/ },
    { path: "/developer-view/projects", heading: "Projects.", tab: /projects\.dir/ },
    { path: "/developer-view/skills", heading: "skills.json", tab: /skills\.json/ },
    { path: "/developer-view/peer-reviews", heading: "peer_reviews.log", tab: /peer_reviews\.log/ },
    { path: "/developer-view/coding-activity", heading: "coding_activity.log", tab: /coding_activity\.log/ },
    { path: "/developer-view/contact", heading: "Let's build something together.", tab: /contact\.sh/ },
  ];

  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
    await expect(page.getByRole("tab", { name: route.tab })).toHaveAttribute("aria-selected", "true");
    await page.reload();
    await expect(page).toHaveURL(route.path);
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
  }
});

test("keeps the public page and developer routes inside the viewport", async ({ page }) => {
  for (const route of ["/", "/developer-view", "/developer-view/projects", "/experience", "/projects"]) {
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
  await page.goto("/developer-view/experience");

  await expect(page.getByText("130+", { exact: true })).toBeVisible();
  await expect(page.getByText("Full-stack means owning the path from API to pixel, not handing off half the problem.")).toBeVisible();

  await page.getByRole("tab", { name: /projects\.dir/ }).click();
  await expect(page).toHaveURL("/developer-view/projects");
  await expect(page.getByRole("heading", { name: "ZalTV Television Application" })).toBeVisible();
});

test("follows the browser color scheme in the developer view", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/developer-view");

  await expect(page.locator(".ide")).not.toHaveAttribute("data-theme");
  await expect(page.locator(".ide")).toHaveCSS("background-color", "rgb(24, 25, 24)");

  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator(".ide")).toHaveAttribute("data-theme", "light");
});

test("supports mobile explorer navigation in the developer view", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only navigation behavior");
  await page.goto("/developer-view");

  await page.getByRole("button", { name: "Toggle explorer" }).click();
  await expect(page.locator(".mobile-explorer")).toBeVisible();
  await page.locator(".mobile-explorer").getByRole("link", { name: /projects\.dir/ }).click();

  await expect(page).toHaveURL("/developer-view/projects");
  await expect(page.locator(".mobile-explorer")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: "Projects." })).toBeVisible();
});
