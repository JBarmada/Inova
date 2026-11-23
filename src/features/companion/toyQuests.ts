import type { Quest } from "../../shared/schema";

export function toyQuests(quests: Quest[]): Quest[] {
  const order = { proposed: 0, accepted: 1, deferred: 2, completed: 3, dismissed: 4 };
  return quests.filter((quest) => quest.status !== "dismissed")
    .sort((a, b) => order[a.status] - order[b.status]);
}

export function adventureTitle(title: string): string {
  return title.replace(/^Spend \d+ minutes starting:\s*/i, "First pawsteps: ");
}

export const toyStatus = {
  proposed: "Ready to fetch", accepted: "On the trail", deferred: "For another day",
  completed: "Adventure complete", dismissed: "Let this one go",
} as const;
