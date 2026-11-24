import type { AppState, Quest } from "../shared/schema";

export function recordAcceptedPlan(state: AppState, quest: Quest): AppState {
  const sourceIds = quest.sourceIds.filter((id) => id !== quest.commitmentId);
  if (state.chat.messages.length >= 200 || sourceIds.length > 3) return state;
  const later = quest.futureSteps?.map((step) => step.title) ?? [];
  const summary = `${quest.planner === "sample" ? "Sample quest accepted" : "Quest accepted"}: ${quest.title}` +
    (later.length ? `\nSuggestions at acceptance: ${later.join("; ")}` : "");
  const text = summary.length > 4000 ? `${summary.slice(0, 3999)}…` : summary;
  return { ...state, chat: { ...state.chat, messages: [...state.chat.messages,
    { role: "dog", text, sourceIds, contextUnknown: true }] } };
}
