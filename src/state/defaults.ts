import type { AppState } from "../shared/schema";

export function initialState(): AppState {
  return {
    schemaVersion: 1,
    pet: { name: "Inu", adopted: false, mood: "idle" },
    settings: { muted: false },
    commitments: [], quests: [], memories: [],
    ownedItems: [], equippedItem: null, rewardedQuestIds: [],
  };
}
