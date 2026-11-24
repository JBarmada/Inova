import { expect, it } from "vitest";
import { initialState } from "../state/defaults";
import { followUpMemories } from "./followUpMemories";

const memory = (id: string, text: string, aiAllowed = true) => ({ id, text, aiAllowed, createdAt: "2026-11-23T00:00:00.000Z" });

it("retains the previous reply's permitted sources for a short opted-in follow-up", () => {
  const state = initialState();
  state.memories = [memory("friend", "My friend Sam likes tea"), memory("a", "I like music"), memory("b", "I like drawing"), memory("c", "I like walking")];
  state.chat.messages = [{ role: "user", text: "What does Sam like?" }, { role: "dog", text: "Sam likes tea. Does he still?", sourceIds: ["friend"] }, { role: "user", text: "Yes, he does." }];
  expect(followUpMemories("Yes, he does.", state, 2, true).map((entry) => entry.id)).toEqual(["friend", "c", "b"]);
  expect(followUpMemories("Yes, he does.", state, 2, false).map((entry) => entry.id)).not.toContain("friend");
  expect(followUpMemories("What music do I like?", state, 2, true)[0].id).toBe("a");
  state.memories[0].aiAllowed = false;
  expect(followUpMemories("Yes, he does.", state, 2, true).map((entry) => entry.id)).not.toContain("friend");
});
