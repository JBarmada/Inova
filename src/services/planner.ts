import type { AppState, Commitment, Quest } from "../shared/schema";
import { newId } from "../shared/actions";

export interface Planner {
  propose(commitment: Commitment, state: AppState): Promise<Quest>;
}

export const samplePlanner: Planner = {
  async propose(commitment, state) {
    const memory = state.memories.filter((entry) => entry.aiAllowed).at(-1);
    return {
      id: newId(), commitmentId: commitment.id,
      title: `Spend 10 minutes starting: ${commitment.title}`,
      reason: memory
        ? `Sample planner. Consider your saved reflection: ${memory.text}`
        : "Sample planner: try a small starting step. No schedule or AI service was consulted.",
      sourceIds: [commitment.id, ...(memory ? [memory.id] : [])],
      minutes: 10, status: "proposed", planner: "sample",
    };
  },
};

export async function proposeSample(commitment: Commitment, state: AppState) {
  const quest = await samplePlanner.propose(commitment, state);
  const memorySnapshot = state.memories.filter((entry) => quest.sourceIds.includes(entry.id))
    .map(({ id, text }) => ({ id, text }));
  return { quest, memorySnapshot };
}
