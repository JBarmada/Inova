let context: AudioContext | undefined;
const quietUntil = { click: 0, reward: 0, squeak: 0, bark: 0 };

export function playCue(kind: "click" | "reward" | "squeak" | "bark", muted: boolean): void {
  if (muted) return;
  try {
    context ??= new AudioContext();
    void context.resume().catch(() => undefined);
    const time = context.currentTime;
    if (time < quietUntil[kind]) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = kind === "squeak" ? "triangle" : "square";
    if (kind === "bark") {
      oscillator.frequency.setValueAtTime(190, time);
      oscillator.frequency.exponentialRampToValueAtTime(360, time + 0.025);
      oscillator.frequency.exponentialRampToValueAtTime(105, time + 0.15);
    } else if (kind === "squeak") {
      oscillator.frequency.setValueAtTime(700, time);
      oscillator.frequency.exponentialRampToValueAtTime(1850, time + 0.07);
      oscillator.frequency.exponentialRampToValueAtTime(850, time + 0.24);
    } else {
      oscillator.frequency.setValueAtTime(kind === "reward" ? 660 : 330, time);
      oscillator.frequency.setValueAtTime(kind === "reward" ? 990 : 220, time + 0.06);
    }
    gain.gain.setValueAtTime(0.035, time);
    const duration = kind === "squeak" ? 0.25 : 0.16;
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.01);
    quietUntil[kind] = time + duration;
  } catch {
    // Sound is supplementary; feedback remains visible if audio is unavailable.
  }
}

