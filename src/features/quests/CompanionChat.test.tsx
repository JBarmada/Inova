import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { initialState } from "../../state/defaults";
import { reduce } from "../../state/reducer";
import { CompanionChat } from "./CompanionChat";

it("uses one message entry and lets a saved message start quest planning", () => {
  let state = reduce(initialState(), { type: "chat-share", text: "I need to prepare for my class" });
  const chat = renderToStaticMarkup(<CompanionChat state={state} />);
  expect(chat).toContain("Message your dog");
  expect(chat).toContain("Make a quest");
  expect(chat.match(/<input\b(?![^>]*type="checkbox")/g)).toHaveLength(1);
  state = reduce(state, { type: "chat-plan-message", messageIndex: 0, originalText: "I need to prepare for my class" });
  const clarification = renderToStaticMarkup(<CompanionChat state={state} />);
  expect(clarification).toContain("Anything else?");
  expect(clarification).not.toContain("Message your dog");
  expect(clarification.match(/<input\b(?![^>]*type="checkbox")/g)).toHaveLength(1);
  state = reduce(state, { type: "chat-skip" });
  expect(renderToStaticMarkup(<CompanionChat state={state} />)).toContain("Make a new plan");
});
