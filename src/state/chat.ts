import type { Action } from "../shared/actions";
import type { AppState } from "../shared/schema";
import { chatPhrases } from "../shared/personality";
import { clarificationForClues, goalClarification, goalClues } from "../shared/goalClarification";
import { followUpIds } from "./followUps";

type ChatAction = Extract<Action, { type: "chat-goal" | "chat-share" | "chat-context-exclusion" | "chat-plan-message" | "dismiss-quest-suggestion" | "chat-context" | "chat-skip" | "chat-reset" | "chat-clear" | "chat-follow-up" }>;

export function changeChat(state: AppState, action: ChatAction): AppState {
  const chat = state.chat;
  if (action.type === "chat-context-exclusion") {
    const message = chat.messages[action.messageIndex];
    if (message?.role !== "user" || message.text !== action.originalText) throw Error("This conversation changed. Please choose the message again.");
    return { ...state, chat: { ...chat, messages: chat.messages.map((entry, index) => index === action.messageIndex ? { ...entry, contextExcluded: action.excluded } : entry) } };
  }
  if (action.type === "chat-plan-message") return planMessage(state, action);
  if (action.type === "dismiss-quest-suggestion") return clearQuestSuggestion(state, action.replyIndex, action.sourceIndex);
  if (action.type === "chat-clear") return { ...state, chat: { ...chat, phase: "goal", goal: "", messages: [], contextQuestId: undefined, clarificationTurns: undefined } };
  if (action.type === "chat-reset") return { ...state, chat: { ...chat, phase: "goal", goal: "", contextQuestId: undefined, clarificationTurns: undefined } };
  if (action.type === "chat-follow-up") {
    const quest = state.quests.find((entry) => entry.id === action.questId && entry.status === "completed");
    const commitment = state.commitments.find((entry) => entry.id === quest?.commitmentId);
    if (chat.phase !== "goal" || !quest || !commitment || !followUpIds(chat).includes(quest.id)) throw Error("That follow-up is no longer available.");
    if (commitment.title.length > 240) throw Error("This goal is too long. Please start a new one.");
    return { ...state, chat: { ...chat, phase: "ready", goal: commitment.title, contextQuestId: quest.id } };
  }
  if (action.type === "chat-skip") {
    if (chat.phase !== "context") throw Error("Start with a goal first.");
    if (chat.messages.length >= 200) throw Error("Conversation is full. Clear it to start a new one.");
    return { ...state, chat: { ...chat, phase: "ready", messages: [...chat.messages,
      { role: "dog" as const, text: chatPhrases(state.pet.personality).skip }] } };
  }
  const input = action.text.trim();
  if (!input || input.length > 240) throw Error("Enter up to 240 characters.");
  if (action.type === "chat-goal" && chat.phase !== "goal") throw Error("Finish or start over first.");
  if (action.type === "chat-context" && chat.phase !== "context") throw Error("Start with a goal first.");
  if (chat.messages.length > 198) throw Error("Conversation is full. Clear it to start a new one.");
  if (action.type === "chat-share") return { ...state, chat: { ...chat, messages: [...chat.messages,
    { role: "user", text: input }] } };
  const goal = action.type === "chat-goal" ? input : `${chat.goal}. ${input}`;
  if (goal.length > 240) throw Error("Together, your goal and details must fit within 240 characters.");
  const before = goalClues(chat.goal), after = goalClues(goal, input);
  const askAgain = action.type === "chat-context" && !chat.clarificationTurns &&
    (after.deadline !== before.deadline || after.progress !== before.progress) && after.deadline !== after.progress;
  const reply = action.type === "chat-goal"
    ? goalClarification(input, state.pet.personality)
    : askAgain ? clarificationForClues(after, state.pet.personality) : chatPhrases(state.pet.personality).ready;
  return { ...state, chat: { ...chat, phase: action.type === "chat-goal" || askAgain ? "context" : "ready", goal,
    clarificationTurns: askAgain ? 1 : undefined,
    messages: [...chat.messages, { role: "user" as const, text: input }, { role: "dog" as const, text: reply }] } };
}

function planMessage(state: AppState, action: Extract<Action, { type: "chat-plan-message" }>): AppState {
  const message = state.chat.messages[action.messageIndex];
  if (state.chat.phase !== "goal") throw Error("Finish or start over first.");
  if (!message || message.role !== "user" || message.text !== action.originalText) throw Error("This conversation changed. Please choose the message again.");
  if (!message.text.trim() || message.text.length > 240) throw Error("Choose a message of up to 240 characters.");
  if (state.chat.messages.length >= 200) throw Error("Conversation is full. Clear it to start a new one.");
  const cleared = action.suggestionReplyIndex === undefined ? state : clearQuestSuggestion(state, action.suggestionReplyIndex, action.messageIndex);
  return { ...cleared, chat: { ...cleared.chat, goal: message.text, phase: "context", contextQuestId: undefined, clarificationTurns: undefined,
    messages: [...cleared.chat.messages, { role: "dog", text: goalClarification(message.text, state.pet.personality) }] } };
}

function clearQuestSuggestion(state: AppState, replyIndex: number, sourceIndex: number): AppState {
  const reply = state.chat.messages[replyIndex];
  if (reply?.role !== "dog" || reply.questSuggestion?.sourceIndex !== sourceIndex) throw Error("This quest suggestion is no longer available.");
  return { ...state, chat: { ...state.chat, messages: state.chat.messages.map((entry, index) => index === replyIndex ? { ...entry, questSuggestion: undefined } : entry) } };
}
