# Energy (dashboard)

A synthetic daily electricity curve for one building with three sample sites: switch the period, read the peak, total and quietest hour, see every hour as a chart or a table, and compare sites. No meter is connected.

The page is the pilot of the Dashboard shell; see [DASHBOARD.md](DASHBOARD.md).

Live: https://energy.bookchaowalit.com (Vercel deploys every push to `main`).

## What it does not do

- No meter, utility or IoT data, alerts, history or export. All readings are synthetic.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: curve windows and summaries, mounted page (period, table, sites), Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (with a line-coverage gate) and the shared security
scan on every push and PR to `main`.

## Code map

- `app/page.tsx`: the page on the Dashboard shell (period switch, stats, chart/table, sites).
- `app/dashboard-shell.css` + `components/dashboard-shell.tsx`: the shared Dashboard shell, see `DASHBOARD.md`.
- `lib/energy.ts`: the sample curve and sites, `readingFor`, `peakOf`, `lowOf`, `totalOf`, `shareOf`, `hourLabels`, `findSite`.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped; off when `NEXT_PUBLIC_SENTRY_DSN` is unset.
