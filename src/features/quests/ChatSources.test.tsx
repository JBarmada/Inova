import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ChatSources } from "./ChatSources";

it("shows only the permitted memories supplied with a reply", () => {
  const memories = [{ id: "a", text: "Alex likes astronomy", aiAllowed: true, createdAt: "2026-11-23T00:00:00.000Z" },
    { id: "b", text: "Private thought", aiAllowed: false, createdAt: "2026-11-23T00:00:00.000Z" },
    { id: "c", text: "Unrelated memory", aiAllowed: true, createdAt: "2026-11-23T00:00:00.000Z" }];
  const markup = renderToStaticMarkup(<ChatSources ids={["a", "b"]} memories={memories} />);
  expect(markup).toContain("Memories included (1)");
  expect(markup).toContain("Alex likes astronomy");
  expect(markup).not.toContain("Private thought");
  expect(markup).not.toContain("Unrelated memory");
  expect(renderToStaticMarkup(<ChatSources ids={["b"]} memories={memories} />)).toBe("");
});
