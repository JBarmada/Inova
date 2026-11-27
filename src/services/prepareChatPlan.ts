import type { AppState, Commitment } from "../shared/schema";
import { newId, now } from "../shared/actions";
import { MAX_CHAT_GOAL_LENGTH } from "../shared/limits";
import { proposeLocalPlan } from "./localPlan";
import { previousQuestContext } from "./previousQuest";
import type { prepareQuest } from "./prepareQuest";

type Draft = Awaited<ReturnType<typeof prepareQuest>> & { previousQuest: ReturnType<typeof previousQuestContext>; explanation?: string; steps: Awaited<ReturnType<typeof proposeLocalPlan>>["steps"] };

export async function prepareChatPlan(text: string, state: AppState, local = proposeLocalPlan): Promise<Draft> {
  const title = text.trim();
  if (!title || title.length > MAX_CHAT_GOAL_LENGTH) throw Error(`Enter an adventure of up to ${MAX_CHAT_GOAL_LENGTH} characters.`);
  const commitment: Commitment = { id: newId(), title, createdAt: now() };
  const plan = await local(commitment, state);
  return { commitment, ...plan, previousQuest: previousQuestContext(state), fallback: false };
}
