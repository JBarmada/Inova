import { describe, expect, it } from "vitest";
import { stateSchema } from "../shared/schema";
import { initialState } from "./defaults";
import { reduce } from "./reducer";

describe("companion settings", () => {
  it("loads existing version-one saves with developer controls hidden", () => {
    const existing = { ...initialState(), settings: { muted: true } };
    const loaded = stateSchema.parse(existing);
    expect(loaded.settings).toEqual({ muted: true, devMode: false, showStatus: false, localModel: "gemma3:12b" });
  });

  it("keeps sound and developer settings independent across save reloads", () => {
    const developer = reduce(initialState(), { type: "dev-mode", enabled: true });
    const muted = reduce(developer, { type: "mute", muted: true });
    const loaded = stateSchema.parse(JSON.parse(JSON.stringify(muted)));
    expect(loaded.settings).toEqual({ devMode: true, muted: true, showStatus: false, localModel: "gemma3:12b" });
    expect(reduce(loaded, { type: "dev-mode", enabled: false }).settings).toEqual({ devMode: false, muted: true, showStatus: false, localModel: "gemma3:12b" });
  });

  it("persists the optional status bar without changing sound or developer mode", () => {
    const visible = reduce(initialState(), { type: "status-bar", enabled: true });
    const loaded = stateSchema.parse(JSON.parse(JSON.stringify(visible)));
    expect(loaded.settings).toEqual({ muted: false, devMode: false, showStatus: true, localModel: "gemma3:12b" });
    expect(reduce(loaded, { type: "mute", muted: true }).settings.showStatus).toBe(true);
    expect(reduce(loaded, { type: "status-bar", enabled: false }).settings.showStatus).toBe(false);
  });
});

it("keeps the selected local model after reload and rejects unsupported model names", () => {
  const state = reduce(initialState(), { type: "local-model", model: "gemma3:4b" });
  expect(stateSchema.parse(JSON.parse(JSON.stringify(state))).settings.localModel).toBe("gemma3:4b");
  expect(stateSchema.safeParse({ ...state, settings: { ...state.settings, localModel: "untrusted-model" } }).success).toBe(false);
});
