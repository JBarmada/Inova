import { planRequestSchema, type AppState, type PlanRequest } from "../shared/schema";

export function planQuest(state: AppState, id: string, request: PlanRequest): AppState {
  const data = planRequestSchema.parse(request);
  const quest = state.quests.find((entry) => entry.id === id);
  if (!quest || quest.status !== "accepted") throw Error("Accept this quest before planning a time.");
  const start = Date.parse(data.start), availableUntil = Date.parse(data.availableUntil);
  const end = start + quest.minutes * 60_000;
  if (start < Date.parse(data.recordedAt)) throw Error("Choose a future start time.");
  if (end > availableUntil) throw Error("This quest does not fit in the entered free window.");
  const deadline = state.commitments.find((entry) => entry.id === quest.commitmentId)?.deadline;
  if (deadline && end > Date.parse(deadline.at)) throw Error("This time ends after the commitment deadline.");
  if (state.quests.some((other) => other.id !== id && other.status === "accepted" && other.plan &&
      start < Date.parse(other.plan.end) && end > Date.parse(other.plan.start)))
    throw Error("This overlaps another saved quest plan.");
  const plan = { ...data, end: new Date(end).toISOString() };
  return { ...state, quests: state.quests.map((entry) => entry.id === id ? { ...entry, plan } : entry) };
}

export function clearQuestPlan(state: AppState, id: string): AppState {
  const quest = state.quests.find((entry) => entry.id === id);
  if (!quest || quest.status !== "accepted") throw Error("This quest cannot be replanned.");
  return { ...state, quests: state.quests.map((entry) => entry.id === id ? { ...entry, plan: undefined } : entry) };
}
