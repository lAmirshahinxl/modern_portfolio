import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

const localChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const testPort = process.env.PLAYWRIGHT_PORT ?? "3000";
const testBaseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${testPort}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: testBaseURL,
    trace: "on-first-retry",
    launchOptions: existsSync(localChrome)
      ? {
          executablePath: localChrome,
          args: [
            "--disable-background-networking",
            "--disable-component-update",
            "--disable-default-apps",
            "--no-first-run",
          ],
        }
      : undefined,
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 1,
      },
    },
  ],
  webServer: {
    command: `npm run start -- -p ${testPort}`,
    url: testBaseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
