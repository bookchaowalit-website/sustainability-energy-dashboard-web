import { describe, expect, it } from "vitest";
import { HOURS, SITES, WINDOWS, chartPoints, findSite, peakOf, readingFor } from "@/lib/energy";

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

describe("chartPoints", () => {
  it("spreads points across the board and maps 0 and 100 kWh to the bottom and top lines", () => {
    expect(chartPoints([0, 50, 100])).toBe("0,280 500,170 1000,60");
  });

  it("clamps values above 100 to the top line and copes with a single point", () => {
    expect(chartPoints([150])).toBe("0,60");
  });
});

describe("findSite", () => {
  it("finds a site by name and falls back to the first", () => {
    expect(findSite("Garden office").load).toBe(74);
    expect(findSite("Nope")).toBe(SITES[0]);
  });
});
