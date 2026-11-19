// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Home from "@/app/page";
import { linePoints } from "@/components/dashboard-shell";

// Mounted tests for the energy page on the Dashboard shell: period switch, stats, chart/table and sites.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let host: HTMLDivElement;
const $ = <T extends Element = HTMLElement>(selector: string) => host.querySelector(selector) as T | null;
const button = (text: string) => [...host.querySelectorAll("button")].find((b) => b.textContent?.trim().startsWith(text)) as HTMLButtonElement;
const press = (el: Element) => act(() => { el.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
const stats = () => [...host.querySelectorAll(".ds-stat")].map((tile) => tile.textContent);

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  act(() => root.render(<Home />));
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("energy dashboard", () => {
  it("opens on today with the peak, total and quietest hour of the sample curve", () => {
    expect($("h1")?.textContent).toBe("Electricity load");
    expect(button("Today").getAttribute("aria-pressed")).toBe("true");
    expect(stats()).toEqual(["Peak94kWhat 13:00", "Total1,159kWhover 24 hours", "Quietest hour9kWhat 04:00", "Top site48%North workshop, of 3 sites"]);
    expect($(".ds-head p")?.textContent).toContain("3 sample sites");
    expect($(".ds-chart-unit")?.textContent).toBe("kWh");
    expect($(".ds-chart-peak-row span")?.textContent).toBe("Peak 94 kWh · 13:00");
    expect($(".ds-pill")?.textContent).toBe("Sample data");
    expect($("svg")?.getAttribute("aria-label")).toBe("Hourly load, today: lowest 9 kWh at 04:00, peak 94 kWh at 13:00.");
    expect(host.textContent).toContain("No meter, utility or IoT connection");
  });

  it("switches the period and recomputes every figure", () => {
    press(button("Week avg"));
    expect(button("Week avg").getAttribute("aria-pressed")).toBe("true");
    expect(button("Today").getAttribute("aria-pressed")).toBe("false");
    expect(stats()[0]).toBe("Peak79kWhat 13:00");
    // The week average is one average day, so the tile says so rather than "Total".
    expect(stats()[1]).toBe("Daily average973kWhaverage day, 24 hours");
    const loads = () => [...host.querySelectorAll(".ds-row-value")].map((cell) => cell.textContent);
    expect(loads()).toEqual(["154", "107", "62"]);
    expect($(".ds-head p")?.textContent).toContain("Week avg · hourly, in kWh");
    press(button("Yesterday"));
    expect(stats()[2]).toBe("Quietest hour7kWhat 03:00");
    expect(stats()[1]).toBe("Total1,130kWhover 24 hours");
    // The sites follow the period too.
    expect($('[aria-labelledby="sites-heading"] .ds-panel-head p')?.textContent).toBe("Load per site, kWh · yesterday");
    expect(loads()).toEqual(["179", "125", "72"]);
    press(button("Today"));
    expect(loads()).toEqual(["184", "128", "74"]);
  });

  it("shows every hour as a table and back as a chart", () => {
    const details = $("details.ds-chart-switch") as HTMLDetailsElement;
    const summary = details.querySelector("summary") as HTMLElement;
    press(summary);
    expect(details.open).toBe(true);
    const rows = [...host.querySelectorAll(".ds-table tbody tr")];
    expect(rows).toHaveLength(24);
    expect(rows[13].textContent).toBe("13:0094 (peak)");
    expect(rows[13].getAttribute("data-peak")).toBe("true");
    expect(summary.textContent).toBe("Show tableShow chart");
    press(summary);
    expect(details.open).toBe(false);
    expect($("svg")).not.toBeNull();
    expect([...host.querySelectorAll(".ds-chart-x span")].map((s) => s.textContent)).toEqual(["00:00", "06:00", "12:00", "18:00", "23:00"]);
    // Labels use the line's x scale: hour 12 of 0–23 is 52.17%, not the middle.
    const left = [...host.querySelectorAll<HTMLElement>(".ds-chart-x span")].map((s) => s.style.left);
    expect(left[0]).toBe("0%");
    expect(parseFloat(left[2])).toBeCloseTo((12 / 23) * 100, 3);
    expect(left[4]).toBe("100%");
  });

  it("selects a site and shows its note", () => {
    const rows = () => [...host.querySelectorAll(".ds-row")];
    expect(rows().map((row) => row.getAttribute("aria-pressed"))).toEqual(["true", "false", "false"]);
    expect(rows()[0].textContent).toContain("48% of all sites");
    // Each site's dot and share bar carry the same tone.
    expect([...host.querySelectorAll(".ds-row .ds-meter")].map((m) => m.getAttribute("data-tone"))).toEqual(["amber", "blue", "green"]);
    press(button("Learning hall"));
    expect(rows().map((row) => row.getAttribute("aria-pressed"))).toEqual(["false", "true", "false"]);
    expect($(".ds-callout")?.textContent).toBe("Learning hallCheck cooling after 13:00, when the building peaks.");
  });

  it("has a skip link to a focusable main", () => {
    expect($(".ds-skip")?.getAttribute("href")).toBe("#main");
    expect($("#main")?.getAttribute("tabindex")).toBe("-1");
  });
});

describe("linePoints", () => {
  it("maps 0 and max to the bottom and top, clamps outside values and copes with one point", () => {
    expect(linePoints([0, 50, 100], 100)).toBe("0,100 500,50 1000,0");
    expect(linePoints([150, -5], 100)).toBe("0,0 1000,100");
    expect(linePoints([4], 0)).toBe("0,0");
  });
});
