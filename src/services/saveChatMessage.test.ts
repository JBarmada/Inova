import { expect, it, vi } from "vitest";
import type { Action } from "../shared/actions";
import { initialState } from "../state/defaults";
import { reduce } from "../state/reducer";
import { saveChatMessage } from "./saveChatMessage";

it("saves the trimmed message before starting a reply", async () => {
  let state = initialState();
  const start = vi.fn((index: number, text: string) => {
    expect(state.chat.messages[index]).toEqual({ role: "user", text });
  });
  await saveChatMessage(" Hello ", state, async (action: Action) => { state = reduce(state, action); }, start);
  expect(start).toHaveBeenCalledWith(0, "Hello");
});

it("does not start a reply if saving fails", async () => {
  const start = vi.fn();
  await expect(saveChatMessage("Hello", initialState(), async () => { throw Error("save failed"); }, start)).rejects.toThrow("save failed");
  expect(start).not.toHaveBeenCalled();
});
