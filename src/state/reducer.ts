import type { Action } from "../shared/actions";
import { stateSchema, type AppState } from "../shared/schema";
import { changeQuestStatus, completeQuest } from "./quests";
import { changeEquipment } from "./equipment";
import { planQuest, clearQuestPlan } from "./scheduling";

function apply(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "adopt":
      return { ...state, pet: { ...state.pet, name: action.name.trim(), adopted: true } };
    case "mood": return { ...state, pet: { ...state.pet, mood: action.mood } };
    case "mute": return { ...state, settings: { ...state.settings, muted: action.muted } };
    case "dev-mode": return { ...state, settings: { ...state.settings, devMode: action.enabled } };
    case "status-bar": return { ...state, settings: { ...state.settings, showStatus: action.enabled } };
    case "reduce-motion": return { ...state, settings: { ...state.settings, reduceMotion: action.enabled } };
    case "local-model": return { ...state, settings: { ...state.settings, localModel: action.model } };
    case "quest-minute-limit": return { ...state, settings: { ...state.settings, questMinuteLimit: action.minutes } };
    case "add-commitment":
      if (state.commitments.some((entry) => entry.id === action.commitment.id)) return state;
      return { ...state, commitments: [...state.commitments, action.commitment] };
    case "add-exploration": case "add-planned-quest":
      if (action.quest.commitmentId !== action.commitment.id || state.commitments.some((entry) => entry.id === action.commitment.id) || state.quests.some((entry) => entry.id === action.quest.id)) throw Error("This quest already exists or is invalid.");
      return apply(apply(state, { type: "add-commitment", commitment: action.commitment }), { type: "propose-quest", quest: action.quest, memorySnapshot: action.type === "add-planned-quest" ? action.memorySnapshot : undefined });
    case "propose-quest":
      if (state.quests.some((entry) => entry.id === action.quest.id)) return state;
      if ((action.quest.planner === "local" && !action.memorySnapshot) ||
        action.quest.sourceIds.filter((id) => id !== action.quest.commitmentId).some((id) =>
          !action.memorySnapshot?.some((snapshot) => snapshot.id === id))) {
        throw Error("Quest evidence is incomplete.");
      }
      if (action.memorySnapshot?.some((snapshot) => !state.memories.some((memory) =>
        memory.id === snapshot.id && memory.aiAllowed && memory.text === snapshot.text))) {
        throw Error("A reflection changed while planning. Please try again.");
      }
      if (!state.commitments.some((entry) => entry.id === action.quest.commitmentId)) throw Error("Unknown commitment.");
      if (state.commitments.some((entry) => entry.id === action.quest.commitmentId && entry.effortMinutes && action.quest.minutes > entry.effortMinutes))
        throw Error("Quest duration exceeds the estimated total effort.");
      if (action.quest.completedAt || action.quest.plan) throw Error("A proposed quest cannot have a completion date or plan.");
      if (action.quest.status !== "proposed") throw Error("New quests must be proposals.");
      if (state.settings.questMinuteLimit && action.quest.minutes > state.settings.questMinuteLimit) throw Error("This quest exceeds your current length limit. Please plan again.");
      if (!action.quest.sourceIds.includes(action.quest.commitmentId)) throw Error("Quest must cite its commitment.");
      if (action.quest.sourceIds.some((id) => id !== action.quest.commitmentId && !state.memories.some((memory) => memory.id === id && memory.aiAllowed))) throw Error("Quest refers to unavailable evidence.");
      return { ...state, quests: [...state.quests, action.quest] };
    case "edit-quest": {
      const title = action.title.trim();
      if (!title || title.length > 4000) throw Error("Quest title must contain 1–4000 characters.");
      if (action.minutes !== undefined && (!Number.isInteger(action.minutes) || action.minutes < 1 || action.minutes > 120)) throw Error("Duration must be 1–120 whole minutes.");
      const quest = state.quests.find((entry) => entry.id === action.id);
      if (!quest || quest.status === "completed" || quest.status === "dismissed") throw Error("This quest cannot be edited.");
      return { ...state, quests: state.quests.map((entry) => entry.id === action.id ? { ...entry, title, minutes: action.minutes ?? entry.minutes, ...(action.minutes !== undefined && action.minutes !== entry.minutes ? { plan: undefined } : {}) } : entry) };
    }
    case "quest-status": return changeQuestStatus(state, action);
    case "complete-quest": return completeQuest(state, action.id, action.completedAt);
    case "plan-quest": return planQuest(state, action.id, action.request);
    case "clear-quest-plan": return clearQuestPlan(state, action.id);
    case "equip": case "unequip": case "equip-outfit": case "wardrobe-scenario": return changeEquipment(state, action);
    case "add-memory":
      if (state.memories.some((entry) => entry.id === action.memory.id)) return state;
      if (action.memory.questId && !state.quests.some((quest) => quest.id === action.memory.questId && quest.status === "completed")) {
        throw Error("A related adventure must be completed first.");
      }
      return { ...state, memories: [...state.memories, action.memory] };
    case "edit-memory": {
      const text = action.text.trim();
      if (!text || text.length > 4000) throw Error("Memory must contain 1–4000 characters.");
      const memory = state.memories.find((entry) => entry.id === action.id);
      if (!memory) throw Error("Memory no longer exists.");
      if (memory.text === text) return state;
      const cleared = forgetReference(state, action.id);
      return { ...cleared, memories: cleared.memories.map((entry) => entry.id === action.id ? { ...entry, text } : entry) };
    }
    case "memory-permission":
      return { ...forgetReference(state, action.allowed ? "" : action.id), memories: state.memories.map((entry) => entry.id === action.id ? { ...entry, aiAllowed: action.allowed } : entry) };
    case "delete-memory": return { ...forgetReference(state, action.id), memories: state.memories.filter((entry) => entry.id !== action.id) };
  }
}

function forgetReference(state: AppState, id: string): AppState {
  return { ...state, quests: state.quests.map((quest) => quest.sourceIds.includes(id)
    ? { ...quest, title: quest.planner === "local" ? "Review this quest" : quest.title, sourceIds: quest.sourceIds.filter((source) => source !== id), reason: "A supporting memory was removed from personalization." }
    : quest) };
}

export function reduce(state: AppState, action: Action): AppState {
  const next = apply(state, action);
  if (next.pet.adopted && !next.pet.name.trim()) throw Error("Give your dog a name.");
  return stateSchema.parse(next);
}
