import type { AppState } from "../../shared/schema";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function recentRecap(state: AppState, now: number) {
  function isRecent(value: string) {
    const time = Date.parse(value);
    return Number.isFinite(time) && time <= now && time > now - WEEK_MS;
  }
  const quests = state.quests
    .filter((quest) => quest.status === "completed" && quest.completedAt && isRecent(quest.completedAt))
    .sort((a, b) => Date.parse(b.completedAt!) - Date.parse(a.completedAt!));
  const memories = state.memories.filter((memory) => isRecent(memory.createdAt));
  const undatedCount = state.quests.filter((quest) => quest.status === "completed" && !quest.completedAt).length;
  return { quests, memoryCount: memories.length, undatedCount };
}
