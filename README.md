# Load Room (energy dashboard)

A synthetic daily electricity curve for one building with three sample sites: switch the window, read the peak, compare sites. No meter is connected.

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
npm test           # Vitest: curve windows, peak and chart maths, home page render, Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (with a line-coverage gate) and the shared security
scan on every push and PR to `main`.

## Code map

- `lib/energy.ts`: the sample curve and sites, `readingFor`, `peakOf`, `chartPoints`, `findSite`.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped; off when `NEXT_PUBLIC_SENTRY_DSN` is unset.
