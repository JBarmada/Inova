import type { Action } from "../shared/actions";
import type { AppState } from "../shared/schema";
import { qualifyingCostumes } from "../shared/costumeUnlocks";
import { classifyQuest, type QuestCategory } from "../shared/questClassification";

function completedCategories(state: AppState, rewarded: Set<string>, questId: string) {
  const counts = new Map<QuestCategory, number>();
  const seen = new Set<string>();
  for (const quest of state.quests) {
    if (seen.has(quest.id) || !rewarded.has(quest.id) || (quest.id !== questId && quest.status !== "completed")) continue;
    seen.add(quest.id);
    for (const category of classifyQuest(quest, state.commitments)) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }
  return counts;
}

export function completeQuest(state: AppState, id: string, completedAt?: string): AppState {
  const quest = state.quests.find((entry) => entry.id === id);
  if (!quest || quest.status !== "accepted" || state.rewardedQuestIds.includes(id)) return state;
  const rewardedQuestIds = [...state.rewardedQuestIds, id];
  const rewarded = new Set(rewardedQuestIds);
  const ownedItems = new Set(state.ownedItems);
  ownedItems.add("notebook");
  if (rewarded.size >= 3) ownedItems.add("bandana");
  for (const item of qualifyingCostumes(rewarded.size, completedCategories(state, rewarded, id))) ownedItems.add(item);
  return {
    ...state, rewardedQuestIds, ownedItems: [...ownedItems],
    chat: { ...state.chat, pendingReflections: [...state.chat.pendingReflections, id] },
    quests: state.quests.map((entry) => entry.id === id ? { ...entry, status: "completed", ...(completedAt ? { completedAt } : {}) } : entry),
  };
}

export function changeQuestStatus(state: AppState, action: Extract<Action, { type: "quest-status" }>): AppState {
  return {
    ...state,
    quests: state.quests.map((quest) => {
      if (quest.id !== action.id || quest.status === "completed" || quest.status === "dismissed") return quest;
      return { ...quest, status: action.status, ...(action.status !== "accepted" ? { plan: undefined } : {}) };
    }),
  };
}
