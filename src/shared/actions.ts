import type { Commitment, ItemId, Memory, Quest, AppState, PlanRequest } from "./schema";
import type { Equipment, WearableSlot } from "./equipment";
import type { WardrobeScenarioId } from "./wardrobeScenarios";

export type Action =
  | { type: "adopt"; name: string }
  | { type: "mood"; mood: AppState["pet"]["mood"] }
  | { type: "mute"; muted: boolean }
  | { type: "dev-mode"; enabled: boolean }
  | { type: "status-bar"; enabled: boolean }
  | { type: "reduce-motion"; enabled: boolean }
  | { type: "local-model"; model: AppState["settings"]["localModel"] }
  | { type: "quest-minute-limit"; minutes: number }
  | { type: "add-commitment"; commitment: Commitment }
  | { type: "add-exploration"; commitment: Commitment; quest: Quest }
  | { type: "propose-quest"; quest: Quest; memorySnapshot?: { id: string; text: string }[] }
  | { type: "edit-quest"; id: string; title: string; minutes?: number }
  | { type: "quest-status"; id: string; status: "accepted" | "deferred" | "dismissed" }
  | { type: "complete-quest"; id: string; completedAt?: string }
  | { type: "plan-quest"; id: string; request: PlanRequest }
  | { type: "clear-quest-plan"; id: string }
  | { type: "equip"; item: ItemId | null }
  | { type: "unequip"; slot: WearableSlot }
  | { type: "equip-outfit"; equipment: Equipment }
  | { type: "wardrobe-scenario"; id: WardrobeScenarioId }
  | { type: "add-memory"; memory: Memory }
  | { type: "edit-memory"; id: string; text: string }
  | { type: "memory-permission"; id: string; allowed: boolean }
  | { type: "delete-memory"; id: string };

export const newId = (): string => crypto.randomUUID();
export const now = (): string => new Date().toISOString();
