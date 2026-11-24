import type { AppState } from "../shared/schema";
import { prepareChatPlan } from "./prepareChatPlan";

export function prepareDirectPlan(text: string, state: AppState, sample = false) {
  const independent = { ...state, chat: { ...state.chat, contextQuestId: undefined } };
  return sample ? prepareChatPlan(text, independent, async () => { throw Error("sample selected"); })
    : prepareChatPlan(text, independent);
}
