export const BREATH_DURATIONS = [800, 450, 650, 900] as const;

export function createBreathingPlayback(show: (phase: number) => void, durations: readonly number[] = BREATH_DURATIONS) {
  let phase = 0;
  let disposed = false;
  let timer: ReturnType<typeof setTimeout>;
  function advance() {
    if (disposed) return;
    phase = (phase + 1) % durations.length;
    show(phase);
    timer = setTimeout(advance, durations[phase]);
  }
  show(0);
  timer = setTimeout(advance, durations[0]);
  return () => { disposed = true; clearTimeout(timer); };
}
