import type { Action } from "../shared/actions";
import { stateSchema, type AppState } from "../shared/schema";
import { changeQuestStatus, completeQuest } from "./quests";
import { changeEquipment } from "./equipment";

function apply(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "adopt":
      return { ...state, pet: { ...state.pet, name: action.name.trim(), adopted: true } };
    case "mood": return { ...state, pet: { ...state.pet, mood: action.mood } };
    case "mute": return { ...state, settings: { ...state.settings, muted: action.muted } };
    case "dev-mode": return { ...state, settings: { ...state.settings, devMode: action.enabled } };
    case "status-bar": return { ...state, settings: { ...state.settings, showStatus: action.enabled } };
    case "add-commitment":
      if (state.commitments.some((entry) => entry.id === action.commitment.id)) return state;
      return { ...state, commitments: [...state.commitments, action.commitment] };
    case "propose-quest":
      if (state.quests.some((entry) => entry.id === action.quest.id)) return state;
      if (!state.commitments.some((entry) => entry.id === action.quest.commitmentId)) throw Error("Unknown commitment.");
      if (action.quest.status !== "proposed") throw Error("New quests must be proposals.");
      if (!action.quest.sourceIds.includes(action.quest.commitmentId)) throw Error("Quest must cite its commitment.");
      if (action.quest.sourceIds.some((id) => id !== action.quest.commitmentId && !state.memories.some((memory) => memory.id === id && memory.aiAllowed))) throw Error("Quest refers to unavailable evidence.");
      return { ...state, quests: [...state.quests, action.quest] };
    case "quest-status": return changeQuestStatus(state, action);
    case "complete-quest": return completeQuest(state, action.id);
    case "equip": case "unequip": case "wardrobe-scenario": return changeEquipment(state, action);
    case "add-memory":
      if (state.memories.some((entry) => entry.id === action.memory.id)) return state;
      return { ...state, memories: [...state.memories, action.memory] };
    case "memory-permission":
      return { ...forgetReference(state, action.allowed ? "" : action.id), memories: state.memories.map((entry) => entry.id === action.id ? { ...entry, aiAllowed: action.allowed } : entry) };
    case "delete-memory": return { ...forgetReference(state, action.id), memories: state.memories.filter((entry) => entry.id !== action.id) };
  }
}

function forgetReference(state: AppState, id: string): AppState {
  return { ...state, quests: state.quests.map((quest) => quest.sourceIds.includes(id)
    ? { ...quest, sourceIds: quest.sourceIds.filter((source) => source !== id), reason: "A supporting memory was removed from personalization." }
    : quest) };
}

export function reduce(state: AppState, action: Action): AppState {
  const next = apply(state, action);
  if (next.pet.adopted && !next.pet.name.trim()) throw Error("Give your dog a name.");
  return stateSchema.parse(next);
}
