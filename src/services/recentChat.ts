import type { AppState } from "../shared/schema";

export type ChatContextEntry = { index: number; role: "user" | "dog"; text: string; sourceIds?: string[]; contextUserIndices?: number[]; contextUnknown?: boolean };

function eligibleDog(state: AppState, entry: AppState["chat"]["messages"][number], memoryIds: string[]) {
  if (!entry.sourceIds?.every((id) => memoryIds.includes(id))) return false;
  if ((!entry.contextUserIndices || entry.contextUnknown) && state.chat.messages.some((message) => message.role === "user" && message.contextExcluded)) return false;
  if (!entry.contextUserIndices) return true;
  return entry.contextUserIndices.every((index) => state.chat.messages[index]?.role === "user" && !state.chat.messages[index].contextExcluded);
}

export function recentChat(state: AppState, beforeIndex: number, memoryIds: string[]): ChatContextEntry[] {
  const entries = state.chat.messages.slice(0, beforeIndex).map((entry, index) => ({ entry, index }));
  return entries.filter(({ entry }) => entry.text.length <= 240 && entry.text !== "This reply was removed because a supporting memory changed." && (entry.role === "user" ? !entry.contextExcluded : eligibleDog(state, entry, memoryIds)))
    .slice(-4).map(({ entry, index }) => ({ index, role: entry.role, text: entry.text,
      ...(entry.role === "dog" ? { sourceIds: entry.sourceIds, contextUserIndices: entry.contextUserIndices, contextUnknown: entry.contextUnknown } : {}) }));
}

export function validRecentChat(state: AppState, beforeIndex: number, context: ChatContextEntry[], memoryIds: string[]) {
  return context.length <= 4 && context.every(({ index, role, text, sourceIds, contextUserIndices, contextUnknown }) => {
    const message = state.chat.messages[index];
    if (index < 0 || index >= beforeIndex || message?.role !== role || message.text !== text || text.length > 240) return false;
    if (role === "user") return !message.contextExcluded && sourceIds === undefined && contextUserIndices === undefined && contextUnknown === undefined;
    return sourceIds !== undefined && JSON.stringify(message.sourceIds) === JSON.stringify(sourceIds) &&
      JSON.stringify(message.contextUserIndices) === JSON.stringify(contextUserIndices) && message.contextUnknown === contextUnknown && eligibleDog(state, message, memoryIds);
  });
}
