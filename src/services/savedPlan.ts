import type { AppState } from "../shared/schema";
import { newId, now } from "../shared/actions";
import { previousQuestContext } from "./previousQuest";

export function prepareSavedPlan(state: AppState) {
  const previousQuest = previousQuestContext(state);
  const prior = state.quests.find((quest) => quest.id === previousQuest?.id);
  const previousCommitment = state.commitments.find((entry) => entry.id === prior?.commitmentId);
  if (!prior?.futureSteps?.length || !previousCommitment) throw Error("The saved plan is no longer available.");
  const memories = prior.sourceIds.filter((id) => id !== prior.commitmentId).map((id) => {
    const memory = state.memories.find((entry) => entry.id === id && entry.aiAllowed);
    if (!memory) throw Error("A supporting memory is unavailable. Please make a new plan.");
    return { id: memory.id, text: memory.text };
  });
  const remaining = previousCommitment.effortMinutes && previousCommitment.effortMinutes - prior.minutes;
  if (remaining !== undefined && remaining <= 0) throw Error("No estimated effort remains. Please make a new plan.");
  const commitment = { id: newId(), title: state.chat.goal, createdAt: now() };
  const [first, ...rest] = prior.futureSteps;
  const deadline = previousCommitment.deadline?.at;
  const deadlineLocal = deadline ? new Date(new Date(deadline).getTime() - new Date(deadline).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : undefined;
  return { commitment, quest: { ...first, id: newId(), commitmentId: commitment.id,
    sourceIds: [commitment.id, ...memories.map((memory) => memory.id)], status: "proposed" as const, planner: prior.planner },
    memorySnapshot: memories, previousQuest, fallback: prior.planner === "sample", explanation: undefined,
    steps: [first, ...rest], details: { deadlineLocal, effortMinutes: remaining }, detailsWarning: false, usesSavedPlan: true };
}
