"use client";

import { useState } from "react";
import { ChartPanel, DashFoot, DashTop, Pill, Segmented, Stat } from "@/components/dashboard-shell";
import { SITES, WINDOWS, WINDOW_LABELS, findSite, hourLabels, lowOf, peakOf, readingFor, shareOf, siteTotalsFor, topSite, totalOf, type WindowName } from "@/lib/energy";

const PERIODS = WINDOWS.map((id) => ({ id, label: WINDOW_LABELS[id] }));
// Each value is one hour's kWh, so it sits at the middle of its hour (buckets mode) and the ticks are hour edges:
// 0 = 00:00, 24 = the end of the day.
const TICKS = [0, 6, 12, 18, 24];
const TICK_LABELS = ["00:00", "06:00", "12:00", "18:00", "24:00"];

export default function Home() {
  const [windowName, setWindowName] = useState<WindowName>("TODAY");
  const [selectedSite, setSelectedSite] = useState(SITES[0].name);
  const reading = readingFor(windowName);
  const peak = peakOf(reading);
  const low = lowOf(reading);
  const total = totalOf(reading);
  const selected = findSite(selectedSite);
  const period = WINDOW_LABELS[windowName];
  const average = windowName === "WEEK AVG";
  const top = topSite();
  const siteTotals = siteTotalsFor(windowName);

  return (
    <div className="ds">
      <a className="ds-skip" href="#main">Skip to content</a>
      <DashTop name="Energy" tagline="One building, three sample sites" />

      <main id="main" tabIndex={-1} className="ds-main">
        <div className="ds-head">
          <div>
            <h1>Electricity load</h1>
            <p>{period} · hourly, in kWh · {SITES.length} sample sites <Pill tone="grey">Sample data</Pill></p>
          </div>
          <Segmented label="Period" options={PERIODS} value={windowName} onChange={setWindowName} />
        </div>

        <ul className="ds-stats" aria-label={`${period} at a glance`}>
          <Stat label="Peak" value={peak.value} unit="kWh" note={`at ${peak.hour}`} />
          <Stat label={average ? "Daily average" : "Total"} value={total.toLocaleString("en-US")} unit="kWh" note={average ? "average day, 24 hours" : "over 24 hours"} />
          <Stat label="Quietest hour" value={low.value} unit="kWh" note={`at ${low.hour}`} />
          <Stat label="Top site" value={`${shareOf(top)}%`} note={`${top.name}, of ${SITES.length} sites`} />
        </ul>

        <div className="ds-grid">
          <ChartPanel
            title="Hourly load"
            subtitle={`${period} · peak at ${peak.hour}`}
            summary={`Hourly load, ${period.toLowerCase()}: lowest ${low.value} kWh at ${low.hour}, peak ${peak.value} kWh at ${peak.hour}.`}
            values={reading}
            labels={hourLabels(reading)}
            ticks={TICKS}
            tickLabels={TICK_LABELS}
            buckets
            max={100}
            unit="kWh"
            yUnit="kWh"
            labelHeading="Hour"
          />

          <section className="ds-panel" aria-labelledby="sites-heading">
            <div className="ds-panel-head">
              <div>
                <h2 id="sites-heading">Sites</h2>
                <p>{average ? "kWh on an average day" : `kWh over 24 hours, ${period.toLowerCase()}`} · adds up to the {total.toLocaleString("en-US")} kWh total</p>
              </div>
            </div>
            <ul className="ds-rows">
              {SITES.map((site, index) => (
                <li key={site.name}>
                  <button type="button" className="ds-row" aria-pressed={site.name === selected.name} onClick={() => setSelectedSite(site.name)}>
                    <span className="ds-row-name"><span className="ds-dot" data-tone={site.tint} aria-hidden="true" />{site.name}</span>
                    <span className="ds-row-detail">{site.detail} · {shareOf(site)}% of all sites</span>
                    <span className="ds-row-value">{siteTotals[index].toLocaleString("en-US")}</span>
                    <span className="ds-meter" data-tone={site.tint} aria-hidden="true"><span style={{ width: `${shareOf(site)}%` }} /></span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="ds-callout" aria-live="polite">
              <strong>{selected.name}</strong>
              <span>{selected.note}</span>
            </div>
          </section>
        </div>

        <p className="ds-note">Sample readings for one building. No meter, utility or IoT connection, and not a bill.</p>
      </main>

      <DashFoot source="https://github.com/bookchaowalit-website/sustainability-energy-dashboard-web" />
    </div>
  );
}
