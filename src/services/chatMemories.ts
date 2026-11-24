import type { AppState } from "../shared/schema";

const common = new Set(["the", "and", "for", "with", "that", "this", "from", "have", "will", "your", "about", "when", "what", "does", "where", "which", "like", "likes"]);
const themes = [
  { question: /\b(?:my name|name am i|call me)\b/i, memory: /\b(?:my name is|i am called|call me)\b/i },
  { question: /\b(?:class|classes|course|courses|subject|studying|study|taking)\b/i, memory: /\b(?:class|classes|course|courses|subject|studying|study|taking|take|enrolled)\b/i },
  { question: /\b(?:friend|friends|people)\b/i, memory: /\b(?:friend|friends)\b/i },
  { question: /\b(?:like|likes|love|loves|prefer|prefers)\b/i, memory: /\b(?:like|likes|love|loves|prefer|prefers)\b/i },
  { question: /\b(?:when|date|birthday|anniversary|deadline)\b/i, memory: /\b(?:date|birthday|anniversary|deadline|january|february|march|april|may|june|july|august|september|october|november|december)\b/i },
];

function terms(text: string) {
  return new Set((text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter((word) => word.length >= 3 && !common.has(word)));
}

export function chatMemories(message: string, memories: AppState["memories"], limit = 3) {
  const query = terms(message);
  const ranked = memories.map((memory, index) => {
    const overlap = [...terms(memory.text)].filter((word) => query.has(word)).length;
    const themesMatched = themes.filter((theme) => theme.question.test(message) && theme.memory.test(memory.text)).length;
    return { memory, index, score: overlap * 3 + themesMatched * 2 };
  }).filter(({ memory }) => memory.aiAllowed)
    .sort((a, b) => b.score - a.score || b.index - a.index);
  const hasMatch = ranked.some(({ score }) => score > 0);
  return ranked.filter(({ score }) => !hasMatch || score > 0).slice(0, limit).map(({ memory }) => memory);
}
