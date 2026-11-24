import { expect, it } from "vitest";
import { initialState } from "../state/defaults";
import { recentChat, validRecentChat } from "./recentChat";

it("omits dog text with unavailable or untracked sources and limits prior context", () => {
  const state = initialState();
  state.chat.messages = [
    { role: "user", text: "One" },
    { role: "dog", text: "Untracked older reply" },
    { role: "dog", text: "Private derived reply", sourceIds: ["private"] },
    { role: "user", text: "Two" }, { role: "dog", text: "Safe response", sourceIds: [] },
    { role: "user", text: "Three" }, { role: "user", text: "Four" }, { role: "user", text: "Current" },
  ];
  const context = recentChat(state, 7, []);
  expect(context.map((entry) => entry.text)).toEqual(["Two", "Safe response", "Three", "Four"]);
  expect(validRecentChat(state, 7, context, [])).toBe(true);
  expect(validRecentChat(state, 7, [{ index: 2, role: "dog", text: "Private derived reply", sourceIds: ["private"] }], [])).toBe(false);
  expect(validRecentChat(state, 7, [{ index: 1, role: "dog", text: "Untracked older reply", sourceIds: [] }], [])).toBe(false);
});
