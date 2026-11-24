import type { Action } from "../shared/actions";
import type { AppState } from "../shared/schema";

type ChatAction = Extract<Action, { type: "chat-goal" | "chat-context" | "chat-skip" | "chat-reset" | "chat-clear" }>;

export function changeChat(state: AppState, action: ChatAction): AppState {
  const chat = state.chat;
  if (action.type === "chat-clear") return { ...state, chat: { phase: "goal", goal: "", messages: [] } };
  if (action.type === "chat-reset") return { ...state, chat: { ...chat, phase: "goal", goal: "" } };
  if (action.type === "chat-skip") {
    if (chat.phase !== "context") throw Error("Start with a goal first.");
    if (chat.messages.length >= 200) throw Error("Conversation is full. Clear it to start a new one.");
    return { ...state, chat: { ...chat, phase: "ready", messages: [...chat.messages,
      { role: "dog" as const, text: "No problem. Let's make a small quest together." }] } };
  }
  const input = action.text.trim();
  if (!input || input.length > 240) throw Error("Enter up to 240 characters.");
  if (action.type === "chat-goal" && chat.phase !== "goal") throw Error("Finish or start over first.");
  if (action.type === "chat-context" && chat.phase !== "context") throw Error("Start with a goal first.");
  if (chat.messages.length > 198) throw Error("Conversation is full. Clear it to start a new one.");
  const goal = action.type === "chat-goal" ? input : `${chat.goal}. ${input}`;
  if (goal.length > 240) throw Error("Together, your goal and details must fit within 240 characters.");
  const reply = action.type === "chat-goal"
    ? "When is it due, and what have you already done? You can skip this."
    : "Thanks! Let's make a small quest together.";
  return { ...state, chat: { phase: action.type === "chat-goal" ? "context" : "ready", goal,
    messages: [...chat.messages, { role: "user" as const, text: input }, { role: "dog" as const, text: reply }] } };
}
