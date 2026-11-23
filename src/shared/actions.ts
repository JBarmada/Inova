import type { Commitment, ItemId, Memory, Quest, AppState } from "./schema";

export type Action =
  | { type: "adopt"; name: string }
  | { type: "mood"; mood: AppState["pet"]["mood"] }
  | { type: "mute"; muted: boolean }
  | { type: "dev-mode"; enabled: boolean }
  | { type: "status-bar"; enabled: boolean }
  | { type: "add-commitment"; commitment: Commitment }
  | { type: "propose-quest"; quest: Quest }
  | { type: "quest-status"; id: string; status: "accepted" | "deferred" | "dismissed" }
  | { type: "complete-quest"; id: string }
  | { type: "equip"; item: ItemId | null }
  | { type: "add-memory"; memory: Memory }
  | { type: "memory-permission"; id: string; allowed: boolean }
  | { type: "delete-memory"; id: string };

export const newId = (): string => crypto.randomUUID();
export const now = (): string => new Date().toISOString();
