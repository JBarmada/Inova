export function looksLikeGoal(text: string): boolean {
  if (/\b(?:don['’]?t|do not|never)\s+(?:want|need|plan)\s+to\b/i.test(text)) return false;
  return /\b(?:need to|want to|have to|would like to|trying to|plan to|hope to|help me|my goal is|prepare for)\b/i.test(text);
}
