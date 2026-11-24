export function replyRequest<T>() {
  let version = 0;
  let committing = false;
  return {
    dispose() { version += 1; },
    cancel() { if (committing) return false; version += 1; return true; },
    async run(work: () => Promise<T>, commit: (result: T) => Promise<void>, failure: (error: unknown) => void, done: () => void) {
      const current = ++version;
      try {
        const result = await work();
        if (current !== version) return;
        committing = true;
        await commit(result);
      } catch (error) { if (current === version) failure(error); }
      finally {
        if (current === version) { committing = false; done(); }
      }
    },
  };
}
