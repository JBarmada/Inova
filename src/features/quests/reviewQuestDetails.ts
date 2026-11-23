import type { prepareQuest } from "../../services/prepareQuest";
import { deadlineFromLocal } from "./commitmentDetails";

type Draft = Awaited<ReturnType<typeof prepareQuest>>;
export function reviewQuestDetails(draft: Draft, deadline: string, effort: string): Draft {
  const minutes = effort ? Number(effort) : undefined;
  if (minutes !== undefined && (!Number.isInteger(minutes) || minutes < 1 || minutes > 10080))
    throw Error("Enter total effort between 1 and 10080 minutes.");
  return { ...draft,
    commitment: { ...draft.commitment, deadline: deadlineFromLocal(deadline), effortMinutes: minutes },
    quest: { ...draft.quest, minutes: minutes ? Math.min(draft.quest.minutes, minutes) : draft.quest.minutes } };
}
