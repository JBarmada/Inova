import { expect, it } from "vitest";
import { stateSchema } from "../shared/schema";
import { initialState } from "./defaults";
import { reduce } from "./reducer";

it("asks for remaining context once, survives reload, then moves to planning", () => {
  let state = reduce(initialState(), { type: "chat-goal", text: "Prepare a presentation" });
  state = reduce(state, { type: "chat-context", text: "Friday" });
  expect(state.chat.phase).toBe("context");
  expect(state.chat.messages.at(-1)?.text).toContain("What have you already done?");
  state = stateSchema.parse(JSON.parse(JSON.stringify(state)));
  state = reduce(state, { type: "chat-context", text: "I have an outline" });
  expect(state.chat.phase).toBe("ready");
  expect(state.chat.goal).toContain("Friday");
  expect(state.chat.goal).toContain("I have an outline");
  expect(state.quests).toEqual([]);
});

it("allows skipping the extra question and does not loop on unclear answers", () => {
  let state = reduce(initialState(), { type: "chat-goal", text: "Prepare a presentation" });
  state = reduce(state, { type: "chat-context", text: "I haven't started" });
  expect(state.chat.messages.at(-1)?.text).toContain("When is it due");
  expect(reduce(state, { type: "chat-skip" }).chat.phase).toBe("ready");
  expect(reduce(state, { type: "chat-context", text: "Not sure" }).chat.phase).toBe("ready");
  const unclear = reduce(reduce(initialState(), { type: "chat-goal", text: "Prepare a presentation" }), { type: "chat-context", text: "Maybe soon" });
  expect(unclear.chat.phase).toBe("ready");
});
