import { deadlineFromLocal } from "../features/quests/commitmentDetails";
import { plausibleDate, plausibleEffort, plausibleTime } from "./modelEvidence";

export type SuggestedDetails = { deadlineLocal?: string; deadlineDate?: string; effortMinutes?: number };
type ModelDetails = { deadlineLocal?: string; deadlineDate?: string; deadlineEvidence?: string; effortMinutes?: number; effortEvidence?: string };

export function suggestedDetails(text: string, details: ModelDetails, localNow?: string): SuggestedDetails {
  const hasEvidence = (value?: string) => !!value?.trim() && text.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase());
  const dateEvidence = details.deadlineEvidence ?? "";
  const misleadingTomorrow = /\bday after tomorrow\b/i.test(text) && /\btomorrow\b/i.test(dateEvidence) && !/\bday after tomorrow\b/i.test(dateEvidence);
  const negatedDate = /\b(?:not|isn't|is not|can't|cannot)\s+(?:due\s+)?(?:today|tomorrow|tonight)\b/i.test(text) && /\b(?:today|tomorrow|tonight)\b/i.test(dateEvidence);
  const hasDateEvidence = hasEvidence(dateEvidence) && !misleadingTomorrow && !negatedDate;
  const result: SuggestedDetails = {};
  const explicitTime = /\b(?:[01]?\d|2[0-3]):[0-5]\d\b|\b(?:1[0-2]|0?[1-9])\s*(?:a\.?m\.?|p\.?m\.?)\b|\b(?:noon|midnight)\b/i;
  if (details.deadlineLocal && hasDateEvidence && explicitTime.test(dateEvidence) && plausibleDate(details.deadlineLocal.slice(0, 10), dateEvidence, localNow) && plausibleTime(details.deadlineLocal, dateEvidence)) {
    try { deadlineFromLocal(details.deadlineLocal); result.deadlineLocal = details.deadlineLocal; } catch { /* Ignore malformed suggestions. */ }
  }
  if (!result.deadlineLocal && hasDateEvidence) {
    const date = details.deadlineDate || details.deadlineLocal?.slice(0, 10);
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date) && plausibleDate(date, details.deadlineEvidence ?? "", localNow)) {
      try { deadlineFromLocal(`${date}T12:00`); result.deadlineDate = date; } catch { /* Ignore malformed suggestions. */ }
    }
  }
  if (details.effortMinutes && Number.isInteger(details.effortMinutes) && details.effortMinutes <= 10080 &&
      details.effortMinutes > 0 && hasEvidence(details.effortEvidence) && plausibleEffort(details.effortMinutes, details.effortEvidence ?? "")) result.effortMinutes = details.effortMinutes;
  return result;
}
