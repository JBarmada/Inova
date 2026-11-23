import type { Action } from "../shared/actions";
import type { AppState } from "../shared/schema";

export function completeQuest(state: AppState, id: string, completedAt?: string): AppState {
  const quest = state.quests.find((entry) => entry.id === id);
  if (!quest || quest.status !== "accepted" || state.rewardedQuestIds.includes(id)) return state;
  const rewardedQuestIds = [...state.rewardedQuestIds, id];
  const ownedItems = new Set(state.ownedItems);
  ownedItems.add("notebook");
  if (rewardedQuestIds.length >= 3) ownedItems.add("bandana");
  return {
    ...state, rewardedQuestIds, ownedItems: [...ownedItems],
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
