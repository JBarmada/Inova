export function latestPlanRequest<T>() {
  let version = 0;
  return {
    invalidate() { version += 1; },
    async run(work: () => Promise<T>, success: (value: T) => void, failure: (error: unknown) => void, done: () => void) {
      const current = ++version;
      try {
        const result = await work();
        if (current === version) success(result);
      } catch (error) {
        if (current === version) failure(error);
      } finally {
        if (current === version) done();
      }
    },
  };
}
