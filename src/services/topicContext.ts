import type { ChatContextEntry } from "./recentChat";

const common = new Set(["about", "after", "again", "and", "are", "can", "could", "did", "does", "for", "have", "how", "i'm", "just", "like", "my", "need", "please", "should", "the", "them", "there", "think", "this", "want", "what", "when", "where", "which", "would", "you", "your"]);
const reference = /^(?:yes|yeah|yep|no|nope|maybe|sure|okay|ok|and|also|then|but|continue|next|tell me more|what about|how about)\b|\b(?:it|its|that|those|they|them|their|he|him|his|she|her|hers|the same|the previous|the earlier)\b/i;
function words(text: string) {
  return new Set((text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter((word) => word.length >= 3 && !common.has(word)));
}

// Prefer no prior transcript to unrelated context; ambiguous references keep the recent conversation.
export function topicContext(message: string, entries: ChatContextEntry[]): ChatContextEntry[] {
  if (!entries.length || reference.test(message.trim())) return entries;
  const current = words(message);
  const prior = [...entries].reverse().find((entry) => entry.role === "user");
  if (!prior) return [];
  const previous = words(prior.text);
  return [...current].some((word) => previous.has(word)) ? entries : [];
}

export function isClearTopicShift(message: string, goal: string): boolean {
  const text = message.trim();
  if (/^(?:new topic|different topic|change the subject|by the way)\b/i.test(text)) return true;
  if (!/^(?:what should i (?!do\b|start\b)|i don['’]?t know what to (?!do\b)|can you recommend)\b/i.test(text)) return false;
  return topicContext(text, [{ index: 0, role: "user", text: goal }]).length === 0;
}
