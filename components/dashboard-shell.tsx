import { useId, useState, type ReactNode } from "react";

/**
 * Dashboard shell building blocks (styles in app/dashboard-shell.css). Copy both files into the
 * next read-only data page; see DASHBOARD.md for the page structure.
 */

export type Tone = "green" | "amber" | "grey" | "red";

export function DashTop({ name, tagline }: { name: string; tagline: string }) {
  return (
    <header className="ds-top">
      <div className="ds-brand">{name}<small>{tagline}</small></div>
      <nav aria-label="Site">
        <a href="https://bookchaowalit.com/">Bookchaowalit</a>
      </nav>
    </header>
  );
}

export function DashFoot({ source }: { source: string }) {
  return (
    <footer className="ds-foot">
      <a href="https://bookchaowalit.com/">More projects</a>
      <a href={source}>Source</a>
      <a href="https://bookchaowalit.com/privacy">Privacy</a>
      <a href="https://monitor.bookchaowalit.com/">Status</a>
    </footer>
  );
}

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className="ds-pill" data-tone={tone}>{children}</span>;
}

/** The one period switch on a page. */
export function Segmented<T extends string>({ label, options, value, onChange }: { label: string; options: readonly { id: T; label: string }[]; value: T; onChange: (id: T) => void }) {
  return (
    <div className="ds-segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button key={option.id} type="button" aria-pressed={value === option.id} onClick={() => onChange(option.id)}>{option.label}</button>
      ))}
    </div>
  );
}

export function Stat({ label, value, unit, note }: { label: string; value: ReactNode; unit?: string; note?: ReactNode }) {
  return (
    <li className="ds-stat">
      <span className="ds-stat-label">{label}</span>
      <span className="ds-stat-value">{value}{unit ? <small>{unit}</small> : null}</span>
      {note ? <span className="ds-stat-note">{note}</span> : null}
    </li>
  );
}

/** Polyline points on a 1000 x 100 board, 0 at the bottom and `max` at the top. */
export function linePoints(values: number[], max: number): string {
  const last = Math.max(values.length - 1, 1);
  const top = max > 0 ? max : 1;
  return values.map((value, index) => `${(index / last) * 1000},${100 - (Math.min(Math.max(value, 0), top) / top) * 100}`).join(" ");
}

type ChartProps = {
  title: string;
  subtitle?: ReactNode;
  /** What the chart shows, read out instead of the drawing. */
  summary: string;
  values: number[];
  /** Label for each value, used by the table and the x axis. */
  labels: string[];
  /** Indexes of the labels shown under the chart. */
  ticks: number[];
  max: number;
  unit: string;
  /** Column heading for the labels in the table view. */
  labelHeading: string;
};

/** One line chart with a "Show table" switch, so every value can be read without the drawing. */
export function ChartPanel({ title, subtitle, summary, values, labels, ticks, max, unit, labelHeading }: ChartProps) {
  const [asTable, setAsTable] = useState(false);
  const headingId = useId();
  const points = linePoints(values, max);
  const peak = values.length ? values.indexOf(Math.max(...values)) : -1;
  const steps = [0, 0.25, 0.5, 0.75, 1].map((share) => Math.round(max * share));
  return (
    <section className="ds-panel" aria-labelledby={headingId}>
      <div className="ds-panel-head">
        <div>
          <h2 id={headingId}>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        <button type="button" className="ds-plain" aria-pressed={asTable} onClick={() => setAsTable(!asTable)}>{asTable ? "Show chart" : "Show table"}</button>
      </div>
      {asTable ? (
        <div className="ds-table-wrap" tabIndex={0} role="region" aria-label={`${title} as a table`}>
          <table className="ds-table">
            <thead><tr><th scope="col">{labelHeading}</th><th scope="col">{unit}</th></tr></thead>
            <tbody>
              {values.map((value, index) => (
                <tr key={labels[index]} data-peak={index === peak ? "true" : undefined}>
                  <th scope="row">{labels[index]}</th>
                  <td>{value}{index === peak ? " (peak)" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="ds-chart">
          <div className="ds-chart-y" aria-hidden="true">{steps.map((step) => <span key={step}>{step}</span>)}</div>
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none" role="img" aria-label={summary}>
            <g className="ds-chart-grid">{[0, 25, 50, 75, 100].map((y) => <line key={y} x1="0" x2="1000" y1={y} y2={y} />)}</g>
            <polygon className="ds-chart-area" points={`0,100 ${points} 1000,100`} />
            {peak >= 0 ? <line className="ds-chart-peak" x1={(peak / Math.max(values.length - 1, 1)) * 1000} x2={(peak / Math.max(values.length - 1, 1)) * 1000} y1="0" y2="100" /> : null}
            <polyline className="ds-chart-line" points={points} />
          </svg>
          <div className="ds-chart-x" aria-hidden="true">
            {ticks.map((tick) => {
              // Same x scale as linePoints, so each label sits under its own point.
              const at = tick / Math.max(values.length - 1, 1);
              return <span key={tick} style={{ left: `${at * 100}%` }} data-edge={at === 0 ? "start" : at === 1 ? "end" : undefined}>{labels[tick]}</span>;
            })}
          </div>
        </div>
      )}
    </section>
  );
}
