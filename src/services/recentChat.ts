import type { AppState } from "../shared/schema";

export type ChatContextEntry = { index: number; role: "user" | "dog"; text: string; sourceIds?: string[] };

export function recentChat(state: AppState, beforeIndex: number, memoryIds: string[]): ChatContextEntry[] {
  const entries = state.chat.messages.slice(0, beforeIndex).map((entry, index) => ({ entry, index }));
  return entries.filter(({ entry }) => entry.text.length <= 240 && entry.text !== "This reply was removed because a supporting memory changed." && (entry.role === "user" ||
    (entry.sourceIds !== undefined && entry.sourceIds.every((id) => memoryIds.includes(id)))))
    .slice(-4).map(({ entry, index }) => ({ index, role: entry.role, text: entry.text,
      ...(entry.role === "dog" ? { sourceIds: entry.sourceIds } : {}) }));
}

export function validRecentChat(state: AppState, beforeIndex: number, context: ChatContextEntry[], memoryIds: string[]) {
  return context.length <= 4 && context.every(({ index, role, text, sourceIds }) => {
    const message = state.chat.messages[index];
    if (index < 0 || index >= beforeIndex || message?.role !== role || message.text !== text || text.length > 240) return false;
    if (role === "user") return sourceIds === undefined;
    return sourceIds !== undefined && JSON.stringify(message.sourceIds) === JSON.stringify(sourceIds) && sourceIds.every((id) => memoryIds.includes(id));
  });
}
