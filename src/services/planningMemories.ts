import type { AppState } from "../shared/schema";

const common = new Set(["the", "and", "for", "with", "that", "this", "from", "have", "will", "your", "about", "when", "what"]);
function words(text: string): Set<string> {
  return new Set((text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter((word) => word.length >= 3 && !common.has(word)));
}

export function planningMemories(title: string, memories: AppState["memories"], limit = 3) {
  const terms = words(title);
  const ranked = memories.map((memory, index) => ({ memory, index, score: [...words(memory.text)].filter((word) => terms.has(word)).length }))
    .filter(({ memory }) => memory.aiAllowed)
    .sort((a, b) => b.score - a.score || b.index - a.index);
  const hasMatch = ranked.some(({ score }) => score > 0);
  return ranked.filter(({ score }) => !hasMatch || score > 0).slice(0, limit).map(({ memory }) => memory);
}
