import type { Commitment, ItemId, Memory, Quest, AppState } from "./schema";
import type { WearableSlot } from "./equipment";
import type { WardrobeScenarioId } from "./wardrobeScenarios";

export type Action =
  | { type: "adopt"; name: string }
  | { type: "mood"; mood: AppState["pet"]["mood"] }
  | { type: "mute"; muted: boolean }
  | { type: "dev-mode"; enabled: boolean }
  | { type: "status-bar"; enabled: boolean }
  | { type: "add-commitment"; commitment: Commitment }
  | { type: "propose-quest"; quest: Quest }
  | { type: "edit-quest"; id: string; title: string }
  | { type: "quest-status"; id: string; status: "accepted" | "deferred" | "dismissed" }
  | { type: "complete-quest"; id: string }
  | { type: "equip"; item: ItemId | null }
  | { type: "unequip"; slot: WearableSlot }
  | { type: "wardrobe-scenario"; id: WardrobeScenarioId }
  | { type: "add-memory"; memory: Memory }
  | { type: "edit-memory"; id: string; text: string }
  | { type: "memory-permission"; id: string; allowed: boolean }
  | { type: "delete-memory"; id: string };

export const newId = (): string => crypto.randomUUID();
export const now = (): string => new Date().toISOString();
