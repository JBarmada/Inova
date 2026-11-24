import type { AppState } from "../shared/schema";
import { chatMemories } from "./chatMemories";
import { recentChat } from "./recentChat";

const shortReply = /^(?:yes|yeah|yep|no|nope|he|she|they|it|that|i do|i don't|i did|i didn't|what about (?:him|her|them|it|that)|and (?:him|her|them|it|that)|(?:does|did|is|was|can|will) (?:he|she|they|it))\b/i;

export function followUpMemories(text: string, state: AppState, beforeIndex: number, includeRecent: boolean) {
  const ranked = chatMemories(text, state.memories);
  if (!includeRecent || text.trim().split(/\s+/).length > 8 || !shortReply.test(text.trim())) return ranked;
  const previous = state.chat.messages[beforeIndex - 1];
  if (previous?.role !== "dog" || !previous.sourceIds?.length) return ranked;
  const sources = previous.sourceIds.map((id) => state.memories.find((memory) => memory.id === id && memory.aiAllowed));
  if (sources.some((memory) => !memory)) return ranked;
  if (!recentChat(state, beforeIndex, previous.sourceIds).some((entry) => entry.index === beforeIndex - 1)) return ranked;
  const permitted = sources.filter((memory) => memory !== undefined);
  return [...permitted, ...ranked.filter((memory) => !previous.sourceIds!.includes(memory.id))].slice(0, 3);
}
