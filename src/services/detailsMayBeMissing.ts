import type { SuggestedDetails } from "./suggestedDetails";

export function detailsMayBeMissing(text: string, details?: SuggestedDetails): boolean {
  const dateHint = /\b(?:today|tomorrow|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|june|july|august|september|october|november|december)\b|\bmay\s+\d{1,2}\b|\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}\/\d{1,2}\b|\b(?:at|by)\s+\d{1,2}(?::\d{2})?\s*[ap]m\b/i;
  const effortHint = /\b(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|half)\s*(?:hours?|hrs?|h|minutes?|mins?)\b/i;
  return (dateHint.test(text) && !details?.deadlineLocal && !details?.deadlineDate) ||
    (effortHint.test(text) && !details?.effortMinutes);
}
