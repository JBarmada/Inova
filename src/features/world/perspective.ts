export const perspectiveQuestions = [
  { key: "situation", label: "What is the situation, as you see it?" },
  { key: "evidence", label: "What do you know, and what are you unsure about?" },
  { key: "alternative", label: "What is another possible perspective?" },
  { key: "step", label: "Is there a small next step you would like to take?" },
] as const;

export type PerspectiveKey = typeof perspectiveQuestions[number]["key"];
export type PerspectiveDraft = Record<PerspectiveKey, string>;
export const emptyPerspective = (): PerspectiveDraft => ({ situation: "", evidence: "", alternative: "", step: "" });

export function formatPerspective(draft: PerspectiveDraft): string {
  const answers = perspectiveQuestions.flatMap(({ key, label }) => {
    const answer = draft[key].trim();
    return answer ? [`${label}\n${answer}`] : [];
  });
  if (!answers.length) throw new Error("Write at least one thought before saving.");
  return `Perspective exercise\n\n${answers.join("\n\n")}`;
}
