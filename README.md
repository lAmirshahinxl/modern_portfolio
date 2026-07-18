# Modern portfolio

A responsive IDE-inspired portfolio built with Next.js, TypeScript, Motion, and custom CSS. Content is sourced from [amirabasi.info](https://amirabasi.info/).

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Available commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run deploy
npm run test:e2e
```

Playwright uses the locally installed Google Chrome on macOS when available. On another system, run `npx playwright install chromium` before running browser tests.

## Deploy

Deploy the current working tree to the production VPS with:

```bash
npm run deploy
```

The deployment script validates the app locally, uploads the source into an isolated timestamped directory, and builds it on the Ubuntu server so native dependencies match the VPS. It then packages the standalone output, smoke-tests it on a temporary port, and switches the `portfolio` PM2 process. If the new origin fails its health check, the script automatically restarts the previous release. PM2's reboot state is saved after a successful switch.

The defaults match the current production setup:

- SSH host: `turkeyVps`
- Domain: `amirabasi.info`
- PM2 application: `portfolio`
- Release directory: `/var/www/modern-portfolio-releases`
- Temporary smoke-test port: `3100`

Defaults can be overridden for a single deployment:

```bash
DEPLOY_HOST=anotherHost DEPLOY_DOMAIN=example.com npm run deploy
```

Supported overrides are `DEPLOY_HOST`, `DEPLOY_DOMAIN`, `DEPLOY_APP_NAME`, `DEPLOY_RELEASE_ROOT`, and `DEPLOY_CANDIDATE_PORT`. Previous releases are retained on the server for manual rollback.

## Content

Portfolio copy, metrics, availability, location, projects, and contact details live in `src/data/portfolio.ts`. Brand assets:

- `public/brand-mark.svg` — logo from amirabasi.info
- `src/app/icon.svg` — favicon
- `public/AmirAbasi.pdf` — résumé

Production domain is set via `portfolio.site.url` and used in:

- `src/app/layout.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`

## Interface

The desktop presentation recreates a lightweight code editor with a macOS title bar, explorer tree, open-file tabs, line-number gutter, profile document, terminal prompt, and status bar. The mobile layout keeps the file tabs and fixed status bar while moving the explorer into an animated drawer.

The file tree and editor tabs navigate between document sections. The title bar includes contact, résumé, LinkedIn, terminal, and light/dark theme controls. Motion is reduced when the visitor enables reduced motion in their operating system.
