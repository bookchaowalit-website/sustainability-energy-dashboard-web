// Load room: a synthetic 24-hour load curve, three sample sites and the chart maths. No meter, no API.

export type Site = { name: string; load: number; tint: string; detail: string };
export const SITES: Site[] = [
  { name: "North workshop", load: 184, tint: "amber", detail: "late shift / machines" },
  { name: "Learning hall", load: 128, tint: "cyan", detail: "day class / cooling" },
  { name: "Garden office", load: 74, tint: "green", detail: "small load / daylight" },
];
/** Sample load per hour (00:00 to 23:00), in kWh. */
export const HOURS = [18, 14, 12, 10, 9, 11, 17, 34, 57, 69, 76, 82, 88, 94, 91, 83, 76, 68, 61, 54, 46, 38, 29, 22];
export const WINDOWS = ["TODAY", "YESTERDAY", "WEEK AVG"] as const;
export type WindowName = (typeof WINDOWS)[number];

/** The curve for a window: yesterday is a little lower overnight, the week average is 84% of today. */
export function readingFor(windowName: WindowName, hours: number[] = HOURS): number[] {
  if (windowName === "YESTERDAY") return hours.map((value, index) => Math.max(7, value - (index < 8 ? 4 : 0)));
  if (windowName === "WEEK AVG") return hours.map((value) => Math.round(value * 0.84));
  return hours;
}

/** Peak value and the first hour it happens, as HH:00. */
export function peakOf(reading: number[]): { value: number; hour: string } {
  const value = Math.max(...reading);
  return { value, hour: `${String(reading.indexOf(value)).padStart(2, "0")}:00` };
}

/** SVG polyline points on a 1000 x 330 board; 100 kWh reaches the top line. */
export function chartPoints(reading: number[]): string {
  const last = Math.max(reading.length - 1, 1);
  return reading.map((value, index) => `${(index / last) * 1000},${280 - (Math.min(value, 100) / 100) * 220}`).join(" ");
}

export function findSite(name: string): Site {
  return SITES.find((site) => site.name === name) ?? SITES[0];
}
