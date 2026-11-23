export type StartupTimings = { modulesMs: number; saveMs: number; windowMs: number; readyMs: number; uiReadyMs?: number };
type Options = { loadSave: () => Promise<void>; prepareWindow: () => Promise<void>; onPhase: (text: string) => void; clock?: () => number };

export class StartupFailure extends Error {
  constructor(public readonly phase: "save" | "window", cause: unknown) {
    super(cause instanceof Error ? cause.message : String(cause), { cause });
  }
}

export async function runStartup({ loadSave, prepareWindow, onPhase, clock = () => performance.now() }: Options): Promise<StartupTimings> {
  const started = clock();
  const timings: StartupTimings = { modulesMs: Math.round(started), saveMs: 0, windowMs: 0, readyMs: 0 };
  let saveReady = false;
  let windowReady = false;
  async function measure(phase: "save" | "window", task: () => Promise<void>) {
    const before = clock();
    try { await task(); } catch (error) { throw new StartupFailure(phase, error); }
    timings[phase === "save" ? "saveMs" : "windowMs"] = Math.round(clock() - before);
    if (phase === "save") saveReady = true;
    else windowReady = true;
    onPhase(saveReady && windowReady ? "Almost there…" : saveReady ? "Setting up your window…" : "Opening your saved world…");
  }
  onPhase("Opening your saved world…");
  await Promise.all([measure("save", loadSave), measure("window", prepareWindow)]);
  timings.readyMs = Math.round(clock());
  return timings;
}
