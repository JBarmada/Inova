export const personalities = ["cute", "mean", "sad", "happy"] as const;
export type Personality = typeof personalities[number];

export function randomPersonality(random = Math.random): Personality {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw Error("Invalid personality selection.");
  return personalities[Math.floor(value * personalities.length)];
}

export function chatPhrases(personality?: Personality) {
  switch (personality) {
    case "cute": return { clarify: "Let's take a tiny step! When is it due, and what have you done so far? You can skip this.", ready: "Yay! Let's make a little quest together.", skip: "No worries! Let's make a little quest together." };
    case "mean": return { clarify: "All right, let's tackle it. When is it due, and what's already done? You can skip this.", ready: "Good. Let's make a quest and get started.", skip: "Fine by me. Let's make a quest and get started." };
    case "sad": return { clarify: "We can take this slowly. When is it due, and what have you done so far? You can skip this.", ready: "I'm here with you. Let's make a small quest.", skip: "That's okay. I'm here; let's make a small quest." };
    case "happy": return { clarify: "We've got this! When is it due, and what have you done so far? You can skip this.", ready: "Great! Let's make a quest together!", skip: "No problem! Let's make a quest together!" };
    default: return { clarify: "When is it due, and what have you already done? You can skip this.", ready: "Thanks! Let's make a small quest together.", skip: "No problem. Let's make a small quest together." };
  }
}
