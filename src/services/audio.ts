let context: AudioContext | undefined;

export function playCue(kind: "click" | "reward", muted: boolean): void {
  if (muted) return;
  try {
    context ??= new AudioContext();
    void context.resume().catch(() => undefined);
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const time = context.currentTime;
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(kind === "reward" ? 660 : 330, time);
    oscillator.frequency.setValueAtTime(kind === "reward" ? 990 : 220, time + 0.06);
    gain.gain.setValueAtTime(0.035, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(time);
    oscillator.stop(time + 0.17);
  } catch {
    // Sound is supplementary; feedback remains visible if audio is unavailable.
  }
}
