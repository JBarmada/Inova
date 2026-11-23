import { deadlineFromLocal } from "../features/quests/commitmentDetails";

export type SuggestedDetails = { deadlineLocal?: string; effortMinutes?: number };
type ModelDetails = { deadlineLocal?: string; deadlineEvidence?: string; effortMinutes?: number; effortEvidence?: string };

export function suggestedDetails(text: string, details: ModelDetails): SuggestedDetails {
  const hasEvidence = (value?: string) => !!value?.trim() && text.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase());
  const result: SuggestedDetails = {};
  const explicitTime = /\b(?:[01]?\d|2[0-3]):[0-5]\d\b|\b(?:1[0-2]|0?[1-9])\s*(?:a\.?m\.?|p\.?m\.?)\b|\b(?:noon|midnight)\b/i;
  if (details.deadlineLocal && hasEvidence(details.deadlineEvidence) && explicitTime.test(details.deadlineEvidence ?? "")) {
    try { deadlineFromLocal(details.deadlineLocal); result.deadlineLocal = details.deadlineLocal; } catch { /* Ignore malformed suggestions. */ }
  }
  if (details.effortMinutes && Number.isInteger(details.effortMinutes) && details.effortMinutes <= 10080 &&
      details.effortMinutes > 0 && hasEvidence(details.effortEvidence)) result.effortMinutes = details.effortMinutes;
  return result;
}
