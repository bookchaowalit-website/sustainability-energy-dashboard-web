"use client";

import { useMemo, useState } from "react";
import { SITES, WINDOWS, chartPoints, findSite, peakOf, readingFor, type WindowName } from "@/lib/energy";

export default function Home() {
  const [windowName, setWindowName] = useState<WindowName>("TODAY");
  const [selectedSite, setSelectedSite] = useState("North workshop");
  const reading = useMemo(() => readingFor(windowName), [windowName]);
  const { value: peak, hour: peakHour } = peakOf(reading);
  const points = chartPoints(reading);
  const selected = findSite(selectedSite);

  return (
    <main className="load-page"><div className="load-shell">
      <header className="load-header"><div className="load-brand"><span className="load-symbol">∿</span><span>LOAD ROOM / 24</span></div><span>SITE / SAMPLE-03</span><span className="load-state"><i /> READ-ONLY SIGNAL</span></header>
      <section className="load-hero"><div><p className="load-kicker">find the hour that changed the room</p><h1>Where does<br /><em>the load live?</em></h1><p className="load-deck">A small monitoring surface for reading one building&apos;s synthetic electricity rhythm without mistaking a sample for a meter.</p></div><div className="load-clock"><span>NOW / LOCAL</span><strong>14:00</strong><small>Tuesday / warm day<br />source: sample curve</small></div></section>
      <section className="load-controls" aria-label="Dashboard time window"><span>READING WINDOW</span>{WINDOWS.map((item) => <button type="button" key={item} aria-pressed={windowName === item} className={windowName === item ? "is-active" : ""} onClick={() => setWindowName(item)}>{item}</button>)}<span className="control-note">NO METER CONNECTED</span></section>
      <section className="load-overview"><div className="load-chart-panel"><div className="panel-heading"><div><span className="panel-label">HOURLY CURVE / {windowName}</span><h2>Electricity load</h2></div><strong>{peak} <small>kWh peak</small></strong></div><div className="chart-wrap"><svg viewBox="0 0 1000 330" role="img" aria-label={`Synthetic hourly load curve with a peak of ${peak} kilowatt hours`} preserveAspectRatio="none"><g className="chart-grid">{[60, 115, 170, 225, 280].map((y) => <line key={y} x1="0" x2="1000" y1={y} y2={y} />)}</g><polyline className="chart-area" points={`0,280 ${points} 1000,280`} /><polyline className="chart-line" points={points} />{[0, 6, 12, 18, 23].map((hour) => <text key={hour} x={(hour / 23) * 1000} y="316">{String(hour).padStart(2, "0")}:00</text>)}</svg></div><div className="chart-legend"><span><i /> kWh / synthetic</span><span>Peak at {peakHour} · {windowName.toLowerCase()} window</span></div></div><aside className="site-panel"><div className="panel-label">SITES / COMPARE</div><h2>Three rooms<br /><em>one signal.</em></h2>{SITES.map((site) => <button type="button" key={site.name} className={`site-row ${site.name === selected.name ? "is-active" : ""}`} onClick={() => setSelectedSite(site.name)}><span className={`site-marker ${site.tint}`} /><span><strong>{site.name}</strong><small>{site.detail}</small></span><b>{site.load}<small> kWh</small></b></button>)}</aside></section>
      <section className="load-readout"><div><span>SELECTED SITE</span><strong>{selected.name}</strong><small>{selected.detail} · synthetic sample</small></div><div><span>LAST OBSERVED</span><strong>{selected.load} kWh</strong><small>site total / not a bill</small></div><div><span>OPERATOR NOTE</span><strong>Check cooling after 13:00.</strong><small>an observation prompt, not an alert</small></div></section>
      <footer className="load-footer"><span>BOOKCHAOWALIT / ENERGY DASHBOARD</span><span>SYNTHETIC READINGS · NO UTILITY OR IOT CONNECTION</span></footer>
    </div></main>
  );
}
