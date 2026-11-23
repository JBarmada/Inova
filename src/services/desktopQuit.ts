type QuitSteps = {
  flush: () => Promise<unknown>;
  savePlacement: () => Promise<unknown>;
  exit: () => Promise<void>;
  resume: () => void;
};

export const QUIT_SAVE_TIMEOUT_MS = 3000;

function withDeadline(work: Promise<unknown>): Promise<unknown> {
  let timer: ReturnType<typeof setTimeout>;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(Error("Saving timed out; exiting with the last saved data.")), QUIT_SAVE_TIMEOUT_MS);
  });
  return Promise.race([work, deadline]).finally(() => clearTimeout(timer));
}

export function createQuitController(steps: QuitSteps): () => Promise<void> {
  let pending: Promise<void> | undefined;
  return () => {
    if (pending) return pending;
    const saving = Promise.allSettled([
      Promise.resolve().then(steps.flush), Promise.resolve().then(steps.savePlacement),
    ]).then((results) => {
      for (const result of results) {
        if (result.status === "rejected") console.warn("Could not finish saving before exit.", result.reason);
      }
    });
    pending = withDeadline(saving).catch(console.warn).then(steps.exit).catch((error: unknown) => {
      steps.resume();
      pending = undefined;
      throw error;
    });
    return pending;
  };
}
