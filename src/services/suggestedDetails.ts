import { deadlineFromLocal } from "../features/quests/commitmentDetails";

export type SuggestedDetails = { deadlineLocal?: string; effortMinutes?: number };
type ModelDetails = { deadlineLocal?: string; deadlineEvidence?: string; effortMinutes?: number; effortEvidence?: string };

export function suggestedDetails(text: string, details: ModelDetails): SuggestedDetails {
  const hasEvidence = (value?: string) => !!value?.trim() && text.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase());
  const result: SuggestedDetails = {};
  if (details.deadlineLocal && hasEvidence(details.deadlineEvidence)) {
    try { deadlineFromLocal(details.deadlineLocal); result.deadlineLocal = details.deadlineLocal; } catch { /* Ignore malformed suggestions. */ }
  }
  if (details.effortMinutes && Number.isInteger(details.effortMinutes) && details.effortMinutes <= 10080 &&
      details.effortMinutes > 0 && hasEvidence(details.effortEvidence)) result.effortMinutes = details.effortMinutes;
  return result;
}
