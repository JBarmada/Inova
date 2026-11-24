import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ChatMemory } from "./ChatMemory";

it("offers an explicit choice to update an existing memory", () => {
  const html = renderToStaticMarkup(<ChatMemory index={0} original="Sam likes coffee now" memories={[
    { id: "m", text: "Sam likes tea", aiAllowed: false, createdAt: "2026-11-23T00:00:00.000Z" },
  ]} onDone={() => {}} onCancel={() => {}} />);
  expect(html).toContain("A new memory");
  expect(html).toContain("Sam likes tea");
  expect(html).toContain("Sam likes coffee now");
});
