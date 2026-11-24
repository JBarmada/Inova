import type { AppState, Commitment, Quest } from "../shared/schema";
import { newId, now } from "../shared/actions";
import { proposeLocal, type MemorySnapshot } from "./localPlanner";
import { proposeSample } from "./planner";
import type { SuggestedDetails } from "./suggestedDetails";
import { detailsMayBeMissing } from "./detailsMayBeMissing";
import { MAX_CHAT_GOAL_LENGTH } from "../shared/limits";

type Proposal = { quest: Quest; memorySnapshot: MemorySnapshot[]; details?: SuggestedDetails; detailsWarning?: boolean };
type Planner = (commitment: Commitment, state: AppState) => Promise<Proposal>;

export async function prepareQuest(text: string, state: AppState,
  local: Planner = proposeLocal, sample: Planner = proposeSample) {
  const title = text.trim();
  if (!title || title.length > MAX_CHAT_GOAL_LENGTH) throw Error(`Enter an adventure of up to ${MAX_CHAT_GOAL_LENGTH} characters.`);
  const commitment: Commitment = { id: newId(), title, createdAt: now() };
  let result: Proposal;
  let fallback = false;
  try { result = await local(commitment, state); }
  catch { result = await sample(commitment, state); result.detailsWarning = detailsMayBeMissing(title); fallback = true; }
  return { commitment, ...result, fallback };
}
