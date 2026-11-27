import { describe, expect, it } from "vitest";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import { stateSchema } from "../shared/schema";

describe("developer item unlock", () => {
  it("rejects unlocks unless developer mode is enabled", () => {
    expect(() => reduce(initialState(), { type: "dev-unlock-item", item: "notebook" })).toThrow(/developer mode/i);
  });
  it("unlocks once without changing the worn outfit and survives reload", () => {
    const start = { ...initialState(), settings: { ...initialState().settings, devMode: true } };
    const next = reduce(start, { type: "dev-unlock-item", item: "notebook" });
    const repeated = reduce(next, { type: "dev-unlock-item", item: "notebook" });
    expect(repeated.ownedItems).toEqual(["notebook"]);
    expect(repeated.equipment).toEqual(start.equipment);
    expect(stateSchema.parse(JSON.parse(JSON.stringify(repeated))).ownedItems).toEqual(["notebook"]);
  });
});
