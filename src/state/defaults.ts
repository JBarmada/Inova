import type { AppState } from "../shared/schema";

export function initialState(): AppState {
  return {
    schemaVersion: 2,
    pet: { name: "Inu", adopted: false, mood: "idle" },
    settings: { muted: false, devMode: false, showStatus: false, localModel: "gemma3:12b" },
    commitments: [], quests: [], memories: [],
    ownedItems: [], equipment: { hat: null, glasses: null, socks: null, body: null }, rewardedQuestIds: [],
  };
}
