import type { AppState } from "../shared/schema";
import type { Action } from "../shared/actions";
import { localChat } from "./localChat";

export async function shareAndReply(text: string, state: AppState, dispatch: (action: Action) => Promise<void>, reply = localChat) {
  const originalText = text.trim();
  const messageIndex = state.chat.messages.length;
  await dispatch({ type: "chat-share", text: originalText });
  try {
    const result = await reply(originalText, state);
    await dispatch({ type: "chat-reply", messageIndex, originalText, ...result });
    return "";
  } catch {
    return "The dog could not reply. If your message is still in chat, use Ask dog to try again.";
  }
}
