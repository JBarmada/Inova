import { isClearTopicShift } from "../../services/topicContext";

export async function sendPlanningReply(
  text: string, goal: string, share: (text: string) => Promise<unknown>,
  dispatch: (action: { type: "chat-context"; text: string }) => Promise<unknown>,
) {
  if (isClearTopicShift(text, goal)) await share(text);
  else await dispatch({ type: "chat-context", text });
}
