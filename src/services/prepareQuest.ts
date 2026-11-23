import type { AppState, Commitment, Quest } from "../shared/schema";
import { newId, now } from "../shared/actions";
import { proposeLocal, type MemorySnapshot } from "./localPlanner";
import { proposeSample } from "./planner";
import type { SuggestedDetails } from "./suggestedDetails";

type Proposal = { quest: Quest; memorySnapshot: MemorySnapshot[]; details?: SuggestedDetails };
type Planner = (commitment: Commitment, state: AppState) => Promise<Proposal>;

export async function prepareQuest(text: string, state: AppState,
  local: Planner = proposeLocal, sample: Planner = proposeSample) {
  const title = text.trim();
  if (!title || title.length > 240) throw Error("Enter an adventure of up to 240 characters.");
  const commitment: Commitment = { id: newId(), title, createdAt: now() };
  let result: Proposal;
  let fallback = false;
  try { result = await local(commitment, state); }
  catch { result = await sample(commitment, state); fallback = true; }
  return { commitment, ...result, fallback };
}
