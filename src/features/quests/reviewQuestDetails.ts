import type { prepareQuest } from "../../services/prepareQuest";
import { deadlineFromLocal } from "./commitmentDetails";

type Draft = Awaited<ReturnType<typeof prepareQuest>>;
export function reviewQuestDetails(draft: Draft, deadline: string, effort: string, edit?: { title: string; minutes: string }): Draft {
  const minutes = effort ? Number(effort) : undefined;
  if (minutes !== undefined && (!Number.isInteger(minutes) || minutes < 1 || minutes > 10080))
    throw Error("Enter total effort between 1 and 10080 minutes.");
  const title = edit?.title.trim() ?? draft.quest.title;
  const questMinutes = edit ? Number(edit.minutes) : draft.quest.minutes;
  if (!title || title.length > 4000) throw Error("Enter a quest title of up to 4000 characters.");
  if (!Number.isInteger(questMinutes) || questMinutes < 1 || questMinutes > 120) throw Error("Quest length must be 1–120 whole minutes.");
  if (edit && questMinutes !== draft.quest.minutes && minutes && questMinutes > minutes) throw Error("Quest length cannot exceed total effort.");
  return { ...draft,
    commitment: { ...draft.commitment, deadline: deadlineFromLocal(deadline), effortMinutes: minutes },
    quest: { ...draft.quest, title, ...(title !== draft.quest.title ? { reason: "You edited this quest before accepting it." } : {}),
      minutes: minutes ? Math.min(questMinutes, minutes) : questMinutes } };
}

export function dateOnlyDeadline(date: string, time: string): string {
  if (!date) return "";
  if (!time) throw Error("Add a deadline time, or clear the date.");
  return `${date}T${time}`;
}
