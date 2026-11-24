const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const numbers: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  seven: 7, eight: 8, nine: 9, ten: 10, half: 0.5 };

export function plausibleDate(date: string, evidence: string, localNow?: string): boolean {
  const relative = [...evidence.matchAll(/\b(day after tomorrow|tomorrow|today|tonight)\b/gi)];
  if (relative.length) {
    if (relative.length !== 1 || !/^\d{4}-\d{2}-\d{2}T/.test(localNow ?? "")) return false;
    const offset = relative[0][1].toLowerCase() === "day after tomorrow" ? 2 : relative[0][1].toLowerCase() === "tomorrow" ? 1 : 0;
    const [year, month, day] = localNow!.slice(0, 10).split("-").map(Number);
    const expected = new Date(Date.UTC(year, month - 1, day + offset)).toISOString().slice(0, 10);
    if (date !== expected) return false;
  }
  const weekday = /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i.exec(evidence)?.[1].toLowerCase();
  if (weekday && new Date(`${date}T12:00:00Z`).getUTCDay() !== weekdays.indexOf(weekday)) return false;
  const iso = /\b(\d{4})-(\d{2})-(\d{2})\b/.exec(evidence);
  if (iso && date !== iso[0]) return false;
  const numeric = /\b(\d{1,2})\/(\d{1,2})(?:\/(\d{4}|\d{2}))?\b/.exec(evidence);
  const named = /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?\b/i.exec(evidence);
  const [year, month, day] = date.split("-").map(Number);
  if (numeric && (month !== Number(numeric[1]) || day !== Number(numeric[2]) ||
    (numeric[3] && (numeric[3].length === 2 ? year % 100 : year) !== Number(numeric[3])))) return false;
  if (named && (month !== months.indexOf(named[1].toLowerCase()) + 1 || day !== Number(named[2]) || (named[3] && year !== Number(named[3])))) return false;
  return true;
}

export function plausibleEffort(minutes: number, evidence: string): boolean {
  const matches = [...evidence.toLowerCase().matchAll(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|half)\s*(hours?|hrs?|h|minutes?|mins?)\b/g)];
  if (!matches.length) return true;
  const total = matches.reduce((sum, [, amount, unit]) => sum + (numbers[amount] ?? Number(amount)) * (unit.startsWith("h") ? 60 : 1), 0);
  return total === minutes;
}
export function plausibleTime(local: string, evidence: string): boolean {
  const matches = [...evidence.toLowerCase().matchAll(/\b(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*(a|p)\.?m\.?\b/g)];
  if (matches.length !== 1) {
    const clocks = [...evidence.matchAll(/\b(\d{1,2}):([0-5]\d)\b/g)];
    if (clocks.length !== 1 || (Number(clocks[0][1]) > 0 && Number(clocks[0][1]) < 13)) return true;
    return local.slice(11, 16) === `${clocks[0][1].padStart(2, "0")}:${clocks[0][2]}`;
  }
  const [, hour, minute, meridiem] = matches[0];
  const hours = Number(hour) % 12 + (meridiem === "p" ? 12 : 0);
  return local.slice(11, 16) === `${String(hours).padStart(2, "0")}:${minute ?? "00"}`;
}
