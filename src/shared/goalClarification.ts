import { chatPhrases, type Personality } from "./personality";

const deadline = /\b(?:by|before|due(?:\s+on)?|on)\s+(?:(?:this|next)\s+)?(?:today|tomorrow|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2})\b/i;
const progress = /\b(?:i(?:'ve| have)\s+(?:already\s+)?(?:finished|completed|started|drafted|written|done)|i\s+already\s+(?:finished|completed|started|drafted|wrote|did))\b/i;

export function goalClarification(goal: string, personality?: Personality) {
  const hasDeadline = deadline.test(goal), hasProgress = progress.test(goal);
  if (!hasDeadline && !hasProgress) return chatPhrases(personality).clarify;
  const prefixes = { cute: "Let's take a tiny step! ", mean: "All right, let's tackle it. ", sad: "We can take this slowly. ", happy: "We've got this! " };
  const prefix = personality ? prefixes[personality] : "";
  const question = hasDeadline && hasProgress ? "What would be a helpful next step?" : hasDeadline
    ? "What have you already done?" : "When is it due, if there's a deadline?";
  return `${prefix}${question} You can skip this.`;
}
