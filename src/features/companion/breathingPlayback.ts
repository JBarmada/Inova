export const BREATH_DURATIONS = [800, 450, 650, 900] as const;

export function createBreathingPlayback(show: (phase: number) => void) {
  let phase = 0;
  let disposed = false;
  let timer: ReturnType<typeof setTimeout>;
  function advance() {
    if (disposed) return;
    phase = (phase + 1) % BREATH_DURATIONS.length;
    show(phase);
    timer = setTimeout(advance, BREATH_DURATIONS[phase]);
  }
  show(0);
  timer = setTimeout(advance, BREATH_DURATIONS[0]);
  return () => { disposed = true; clearTimeout(timer); };
}
