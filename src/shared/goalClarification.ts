import { chatPhrases, type Personality } from "./personality";

const deadline = /\b(?:by|before|due(?:\s+on)?|on)\s+(?:(?:this|next)\s+)?(?:today|tomorrow|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2})\b/i;
const noDeadline = /\b(?:no deadline|there(?:'s| is) no (?:deadline|due date)|i (?:don|do not|don't)\s*(?:have|need) a (?:deadline|due date))\b/i;
const progress = /\b(?:i(?:'ve| have)\s+(?:already\s+)?(?:finished|completed|started|drafted|written|done)|i\s+already\s+(?:finished|completed|started|drafted|wrote|did)|i (?:haven't|have not) (?:started|begun)|i (?:already )?have (?:an? )?(?:outline|draft|plan))\b/i;
const shortDeadline = /^(?:(?:this|next)\s+)?(?:today|tomorrow|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2})(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?[.!]?$/i;

export function goalClues(goal: string, answer = "") {
  return { deadline: deadline.test(goal) || noDeadline.test(goal) || shortDeadline.test(answer.trim()), progress: progress.test(goal) };
}

export function goalClarification(goal: string, personality?: Personality) {
  return clarificationForClues(goalClues(goal), personality);
}

export function clarificationForClues(clues: ReturnType<typeof goalClues>, personality?: Personality) {
  const { deadline: hasDeadline, progress: hasProgress } = clues;
  if (!hasDeadline && !hasProgress) return chatPhrases(personality).clarify;
  const prefixes = { cute: "Let's take a tiny step! ", mean: "All right, let's tackle it. ", sad: "We can take this slowly. ", happy: "We've got this! " };
  const prefix = personality ? prefixes[personality] : "";
  const question = hasDeadline && hasProgress ? "What would be a helpful next step?" : hasDeadline
    ? "What have you already done?" : "When is it due, if there's a deadline?";
  return `${prefix}${question} You can skip this.`;
}
