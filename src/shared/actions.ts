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
  | { type: "add-planned-quest"; commitment: Commitment; quest: Quest; memorySnapshot: { id: string; text: string }[] }
  | { type: "accept-planned-quest"; commitment: Commitment; quest: Quest; memorySnapshot: { id: string; text: string }[]; previousQuest?: { id: string; title?: string }; consumesSavedPlan?: boolean }
  | { type: "chat-goal"; text: string }
  | { type: "chat-share"; text: string }
  | { type: "chat-reply"; messageIndex: number; originalText: string; reply: string; memorySnapshot: { id: string; text: string }[] }
  | { type: "save-chat-memory"; messageIndex: number; originalText: string; memory: Memory }
  | { type: "chat-context"; text: string }
  | { type: "chat-skip" }
  | { type: "chat-reset" }
  | { type: "chat-clear" }
  | { type: "skip-chat-reflection"; questId: string }
  | { type: "chat-follow-up"; questId: string }
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
  | { type: "memory-category"; id: string; category: NonNullable<Memory["category"]> }
  | { type: "memory-permission"; id: string; allowed: boolean }
  | { type: "delete-memory"; id: string };

export function newId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
export const now = (): string => new Date().toISOString();
