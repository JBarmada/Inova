import type { Quest } from "../../shared/schema";

export function toyQuests(quests: Quest[]): Quest[] {
  // New proposals append to saved state; reverse a filtered copy for newest first.
  return quests.filter((quest) => quest.status !== "dismissed")
    .reverse();
}

export function adventureTitle(title: string): string {
  return title.replace(/^Spend \d+ minutes starting:\s*/i, "First pawsteps: ");
}

export const toyStatus = {
  proposed: "Ready to fetch", accepted: "On the trail", deferred: "For another day",
  completed: "Adventure complete", dismissed: "Let this one go",
} as const;
