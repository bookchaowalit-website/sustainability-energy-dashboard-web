# Dashboard shell

The shared calm, Apple-like look for read-only data pages (energy, status, uptime, link
analytics). Started 2026-11-15 with this app as the pilot. It is the fourth shell after the
Workbench (devtools), the sales page and the App shell (list apps). Each app is its own repo,
so the shell is copied in, not installed: take `app/dashboard-shell.css` and
`components/dashboard-shell.tsx`.

## Rules

- **One question per page**, asked by the `h1` ("Electricity load"). The line under it says
  the period, the unit, and a `Sample data` pill when the numbers are not real.
- **One period switch** (segmented control) at the top right; it changes every figure on the page.
- **At most four stat tiles**: label, value with its unit, and one line of context ("at 13:00").
  On phones they become one grouped card with the value on the right.
- **One main chart**, with a `Show table` switch so every value can be read without the drawing.
  The SVG only draws; axis labels are HTML, so they never stretch. The chart's `aria-label`
  says what it shows (low, peak).
- **Breakdown list** beside the chart: name, one line of detail, value and a share bar. When a
  row selects something it is a button with `aria-pressed`, and a callout under the list says
  what the selection means.
- **Colour is never the only signal**: dots sit next to names, the peak is named in text.
- **Say where the data comes from** in a note under the panels (sample, live, how fresh).
- **Floor:** text ≥ 12px, controls ≥ 44px, 3px focus ring, 4.5:1 text contrast and 3:1 chart
  lines in light and dark, no horizontal scroll at 320px.

## Pieces

| Piece | Where |
|---|---|
| Tokens `--ds-*` (light + dark, same palette as the App shell), top bar, head, segmented control, stat tiles, panels, line chart, table, breakdown rows, share bar, callout, pills, footer | `app/dashboard-shell.css` |
| `DashTop`, `DashFoot`, `Segmented`, `Stat`, `ChartPanel` (chart + table switch), `Pill`, `linePoints` | `components/dashboard-shell.tsx` |

Put the font variable on `<html>` (not `<body>`): the tokens are defined on `:root`, so a font
variable set lower down never reaches them.

## Moving an app onto the shell

1. Copy the two files; import `./dashboard-shell.css` from `globals.css` and drop the old theme.
2. Keep the app's `lib/` maths; add small helpers for the stats (total, low, share) there.
3. Rebuild the page as top bar → head (title, period line, period switch) → stat tiles →
   chart panel + breakdown panel → data note → footer.
4. Add `components/**/*.tsx` to the coverage `include` and write mounted (happy-dom) tests for
   the period switch, the table view and the breakdown selection.
5. Screenshot 320 / 375 / 768 / 1440 in light and dark, once with the table view open.
