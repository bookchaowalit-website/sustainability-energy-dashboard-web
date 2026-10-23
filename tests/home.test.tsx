import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

const text = (html: string) => html.replace(/<!-- -->/g, "");

describe("home page", () => {
  it("renders the load room, the sites and the no-meter notice", () => {
    const html = text(renderToString(<Home />));
    expect(html).toContain("Where does");
    expect(html).toContain("North workshop");
    expect(html).toContain("NO METER CONNECTED");
    expect(html).toContain("SYNTHETIC READINGS · NO UTILITY OR IOT CONNECTION");
  });

  it("names the hour the sample curve actually peaks", () => {
    const html = text(renderToString(<Home />));
    expect(html).toContain("94 <small>kWh peak</small>");
    expect(html).toContain("Peak at 13:00 · today window");
  });
});
