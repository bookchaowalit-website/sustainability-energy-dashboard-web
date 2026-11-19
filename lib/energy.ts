// Load room: a synthetic 24-hour load curve, three sample sites and the chart maths. No meter, no API.

export type Site = { name: string; load: number; tint: "amber" | "blue" | "green"; detail: string; note: string };
export const SITES: Site[] = [
  { name: "North workshop", load: 184, tint: "amber", detail: "Late shift, machines", note: "Machines run past 20:00; most of the evening load is here." },
  { name: "Learning hall", load: 128, tint: "blue", detail: "Day classes, cooling", note: "Check cooling after 13:00, when the building peaks." },
  { name: "Garden office", load: 74, tint: "green", detail: "Small load, daylight", note: "Daylight keeps lighting low; little to change." },
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

/** Labels for the period switch. */
export const WINDOW_LABELS: Record<WindowName, string> = { TODAY: "Today", YESTERDAY: "Yesterday", "WEEK AVG": "Week avg" };

/** Hour labels 00:00 to 23:00 for a reading. */
export function hourLabels(reading: number[]): string[] {
  return reading.map((_, index) => `${String(index).padStart(2, "0")}:00`);
}

/** Sum of the hourly values, in kWh. */
export function totalOf(reading: number[]): number {
  return reading.reduce((sum, value) => sum + value, 0);
}

/** Lowest value and the first hour it happens, as HH:00. */
export function lowOf(reading: number[]): { value: number; hour: string } {
  const value = Math.min(...reading);
  return { value, hour: `${String(reading.indexOf(value)).padStart(2, "0")}:00` };
}

/** A site's share of all sites' load, as a whole percent (the same in every period, since each site scales alike). */
export function shareOf(site: Site, sites: Site[] = SITES): number {
  const all = totalOf(sites.map((entry) => entry.load));
  return all ? Math.round((site.load / all) * 100) : 0;
}

/** A site's load for a period: its sample load scaled by how that period's day compares with today's. */
export function siteLoadFor(site: Site, windowName: WindowName): number {
  const today = totalOf(HOURS);
  return today ? Math.round((site.load * totalOf(readingFor(windowName))) / today) : 0;
}

/** The site with the biggest share. */
export function topSite(sites: Site[] = SITES): Site {
  return sites.reduce((top, site) => (site.load > top.load ? site : top), sites[0]);
}

export function findSite(name: string): Site {
  return SITES.find((site) => site.name === name) ?? SITES[0];
}
