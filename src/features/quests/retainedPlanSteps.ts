type Step = { title: string; reason: string; minutes: number };

export function retainedPlanSteps(steps: Step[], reviewedTitle: string): Step[] {
  return steps[0]?.title === reviewedTitle ? steps.slice(1).map(({ title, reason, minutes }) => ({ title, reason, minutes })) : [];
}
