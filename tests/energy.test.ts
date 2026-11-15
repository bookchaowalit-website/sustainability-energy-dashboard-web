import { describe, expect, it } from "vitest";
import { HOURS, SITES, WINDOWS, WINDOW_LABELS, findSite, hourLabels, lowOf, peakOf, readingFor, shareOf, totalOf } from "@/lib/energy";

describe("sample curve", () => {
  it("has one value per hour of the day", () => {
    expect(HOURS).toHaveLength(24);
    expect(WINDOWS).toEqual(["TODAY", "YESTERDAY", "WEEK AVG"]);
  });

  it("derives the other windows from today", () => {
    expect(readingFor("TODAY")).toBe(HOURS);
    const yesterday = readingFor("YESTERDAY");
    expect(yesterday.slice(0, 3)).toEqual([14, 10, 8]);
    expect(yesterday[4]).toBe(7);
    expect(yesterday.slice(8)).toEqual(HOURS.slice(8));
    expect(readingFor("WEEK AVG")[13]).toBe(79);
  });
});

describe("peakOf", () => {
  it("finds the peak value and the hour it happens (13:00 for the sample, not 14:00)", () => {
    expect(peakOf(HOURS)).toEqual({ value: 94, hour: "13:00" });
  });

  it("reports the first hour when the peak repeats", () => {
    expect(peakOf([5, 9, 9, 1])).toEqual({ value: 9, hour: "01:00" });
  });
});

describe("summaries", () => {
  it("totals the day and finds the quietest hour", () => {
    expect(totalOf(HOURS)).toBe(1159);
    expect(totalOf([])).toBe(0);
    expect(lowOf(HOURS)).toEqual({ value: 9, hour: "04:00" });
    expect(lowOf([3, 1, 1])).toEqual({ value: 1, hour: "01:00" });
  });

  it("labels each hour and each window", () => {
    expect(hourLabels([1, 2, 3])).toEqual(["00:00", "01:00", "02:00"]);
    expect(hourLabels(HOURS).at(-1)).toBe("23:00");
    expect(WINDOW_LABELS["WEEK AVG"]).toBe("Week avg");
  });

  it("gives each site its share of all sites, and 0 when there is no load", () => {
    expect(SITES.map((site) => shareOf(site))).toEqual([48, 33, 19]);
    expect(shareOf({ ...SITES[0], load: 0 }, [{ ...SITES[0], load: 0 }])).toBe(0);
  });
});

describe("findSite", () => {
  it("finds a site by name and falls back to the first", () => {
    expect(findSite("Garden office").load).toBe(74);
    expect(findSite("Nope")).toBe(SITES[0]);
  });
});
