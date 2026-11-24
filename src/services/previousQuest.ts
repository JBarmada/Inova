import type { AppState } from "../shared/schema";

export function previousQuestContext(state: AppState): { id: string; title?: string } | undefined {
  const id = state.chat.contextQuestId;
  if (!id) return undefined;
  const quest = state.quests.find((entry) => entry.id === id && entry.status === "completed");
  if (!quest) throw Error("The completed quest is no longer available. Please start again.");
  const sources = quest.sourceIds.filter((source) => source !== quest.commitmentId);
  const allowed = sources.length <= 3 && sources.every((source) => state.memories.some((memory) => memory.id === source && memory.aiAllowed));
  return allowed ? { id, title: quest.title } : { id };
}
