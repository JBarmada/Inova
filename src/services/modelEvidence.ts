const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const numbers: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  seven: 7, eight: 8, nine: 9, ten: 10, half: 0.5 };

export function plausibleDate(date: string, evidence: string): boolean {
  const weekday = /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i.exec(evidence)?.[1].toLowerCase();
  return !weekday || new Date(`${date}T12:00:00Z`).getUTCDay() === weekdays.indexOf(weekday);
}

export function plausibleEffort(minutes: number, evidence: string): boolean {
  const matches = [...evidence.toLowerCase().matchAll(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|half)\s*(hours?|hrs?|minutes?|mins?)\b/g)];
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
