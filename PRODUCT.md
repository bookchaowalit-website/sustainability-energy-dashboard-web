# Load Room (energy dashboard) — Product truth

> Inferred from the code and copy (no user interview). Checked against the portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`, row `energy-dashboard`) on 2026-10-23.

## What it is

A client-only dashboard over a synthetic 24-hour electricity load curve and three sample sites. No meter, utility or IoT connection.

## Who it is for

A portfolio visitor who wants to see a calm way to read one building's daily load rhythm.

## What works today

1. Switch the reading window (Today, Yesterday, Week avg); the curve, the peak value and the peak hour follow (yesterday is the curve a little lower overnight, the week average is 84% of today).
2. The peak hour shown under the chart is computed from the curve (13:00 for the sample).
3. Select a site to show its sample total in the readout.
4. Front-end and server errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No meter, utility, IoT or API: every figure is synthetic and labelled that way.
- "NOW / LOCAL 14:00 Tuesday" is fixed sample copy, not the visitor's clock. No alerts, history, export or billing.

## Live URL and deploy state

- Live: https://energy.bookchaowalit.com (HTTP 200 on 2026-10-23).
- The Vercel project `bookchaowalit-energy-dashboard-frontend` (domain energy.bookchaowalit.com) is Git-linked to this repository (`main`), so a push to `main` deploys to production. The CVE patch (commit d62d105) went out that way on 2026-10-23. If the Vercel free plan's daily deployment limit blocks a push, the coordinator redeploys the latest green `main` once the window resets. `NEXT_PUBLIC_SENTRY_DSN` is set on the Vercel project (Sentry project `sustainability-energy-dashboard-web`, org `personal-yu0`).

## Boundaries

- Browser-only static page; no API routes, storage or network calls of its own.
