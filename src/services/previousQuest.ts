import type { AppState } from "../shared/schema";

export function previousQuestContext(state: AppState): { id: string; title?: string } | undefined {
  const id = state.chat.contextQuestId;
  if (!id) return undefined;
  const quest = state.quests.find((entry) => entry.id === id && entry.status === "completed");
  if (!quest) throw Error("The completed quest is no longer available. Please start again.");
  // Do not copy a title generated from memories into a new prompt without tracking those sources.
  return quest.sourceIds.some((source) => source !== quest.commitmentId) ? { id } : { id, title: quest.title };
}
