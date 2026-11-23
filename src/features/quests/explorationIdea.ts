export type Challenge = "gentle" | "explore" | "stretch";
export type ExplorationIdea = { interest: string; minutes: number; challenge: Challenge; title: string; month: string };

export function explorationIdea(interest: string, minutes: number, challenge: Challenge, date: Date): ExplorationIdea {
  const topic = interest.trim();
  if (!topic || topic.length > 240) throw Error("Enter an interest of 1–240 characters.");
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 120) throw Error("Choose 1–120 whole minutes.");
  const prompts: Record<Challenge, string> = {
    gentle: `Choose one small question about ${topic} and jot down what you already know.`,
    explore: `Choose a topic related to ${topic} that you have not explored and investigate one question.`,
    stretch: `Design a small experiment connecting ${topic} with a new-to-you subject, then try one step.`,
  };
  if (!Object.hasOwn(prompts, challenge)) throw Error("Choose a challenge level.");
  return { interest: topic, minutes, challenge, title: prompts[challenge],
    month: date.toLocaleDateString(undefined, { month: "long", year: "numeric" }) };
}
