import type { AppState } from "../shared/schema";

const common = new Set(["the", "and", "for", "with", "that", "this", "from", "have", "will", "your", "about", "when", "what", "does", "where", "which", "like", "likes"]);
const themes = [
  { question: /\b(?:my name|name am i|call me|i go by)\b/i, memory: /\b(?:my name(?: is|'s)|i am called|call me|i go by)\b/i,
    alternative: /\bI(?:'m|’m| am)\s+\p{Lu}[\p{L}\p{M}'’-]+\b/u },
  { question: /\b(?:class|classes|course|courses|subject|studying|study|taking|enrolled)\b/i, memory: /\b(?:class|classes|course|courses|subject|studying|study|taking|take|enrolled)\b/i },
  { question: /\b(?:friend|friends|people)\b/i, memory: /\b(?:friend|friends)\b/i },
  { question: /\b(?:like|likes|love|loves|prefer|prefers)\b/i, memory: /\b(?:like|likes|love|loves|prefer|prefers)\b/i },
  { question: /\b(?:when|date|birthday|anniversary|deadline)\b/i, memory: /\b(?:date|birthday|anniversary|deadline|jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/i },
];

function terms(text: string) {
  return new Set((text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter((word) => word.length >= 3 && !common.has(word)));
}

function namedBirthday(message: string) {
  return message.normalize("NFC").match(/(?:^|[^\p{L}\p{M}\p{N}])([\p{Lu}][\p{L}\p{M}'’-]*)['’]s\s+birthday\b/u)?.[1].toLocaleLowerCase();
}

function containsPerson(text: string, person: string) {
  const names = text.normalize("NFC").toLocaleLowerCase().match(/[\p{L}\p{M}]+(?:[-'’][\p{L}\p{M}]+)*/gu) ?? [];
  return names.some((name) => name.replace(/['’]s$/, "") === person);
}

export function chatMemories(message: string, memories: AppState["memories"], limit = 3, context = "") {
  const query = terms(message);
  const contextTerms = terms(context);
  const birthdaySubject = namedBirthday(message);
  const ranked = memories.map((memory, index) => {
    const memoryTerms = [...terms(memory.text)];
    const overlap = memoryTerms.filter((word) => query.has(word)).length;
    const themesMatched = themes.filter((theme) => theme.question.test(message) && (theme.memory.test(memory.text) || theme.alternative?.test(memory.text))).length;
    const contextOverlap = memoryTerms.filter((word) => contextTerms.has(word)).length;
    return { memory, index, score: overlap * 3 + themesMatched * 2, contextOverlap };
  }).filter(({ memory }) => memory.aiAllowed && (!birthdaySubject || containsPerson(memory.text, birthdaySubject)))
    .sort((a, b) => b.score - a.score || (a.score > 0 ? b.contextOverlap - a.contextOverlap : 0) || b.index - a.index);
  const hasMatch = ranked.some(({ score }) => score > 0);
  return ranked.filter(({ score }) => !hasMatch || score > 0).slice(0, limit).map(({ memory }) => memory);
}
