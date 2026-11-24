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

it("keeps context for pronoun questions only when the previous reply is eligible", () => {
  const state = initialState();
  state.memories = [memory("friend", "My friend Sam likes tea"), memory("a", "I like music"), memory("b", "I like drawing"), memory("c", "I like walking")];
  state.chat.messages = [{ role: "user", text: "Tell me about Sam" },
    { role: "dog", text: "Sam likes tea.", sourceIds: ["friend"], contextUserIndices: [0] },
    { role: "user", text: "What about her?" }];
  for (const text of ["What about her?", "Does she?", "And them?"]) {
    expect(followUpMemories(text, state, 2, true)[0].id).toBe("friend");
    expect(followUpMemories(text, state, 2, false).map((entry) => entry.id)).not.toContain("friend");
  }
  state.chat.messages[0].contextExcluded = true;
  expect(followUpMemories("What about her?", state, 2, true).map((entry) => entry.id)).not.toContain("friend");
  state.chat.messages[0].contextExcluded = false;
  state.memories[0].aiAllowed = false;
  expect(followUpMemories("Does she?", state, 2, true).map((entry) => entry.id)).not.toContain("friend");
});
