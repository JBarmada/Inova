import type { Commitment } from "../../shared/schema";

export function deadlineFromLocal(value: string): Commitment["deadline"] {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw Error("Enter a valid local deadline.");
  const [, year, month, day, hour, minute] = match.map(Number);
  const date = new Date(year, month - 1, day, hour, minute);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day ||
      date.getHours() !== hour || date.getMinutes() !== minute) throw Error("That local deadline is not a valid time.");
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!timeZone) throw Error("Your time zone could not be determined.");
  return { at: date.toISOString(), timeZone };
}

export function formatDeadline(deadline: NonNullable<Commitment["deadline"]>): string {
  return `${new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short", timeZone: deadline.timeZone }).format(new Date(deadline.at))} (${deadline.timeZone})`;
}
