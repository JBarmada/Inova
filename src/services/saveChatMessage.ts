import type { AppState } from "../shared/schema";
import type { Action } from "../shared/actions";

export async function saveChatMessage(value: string, state: AppState, dispatch: (action: Action) => Promise<void>, start: (index: number, text: string) => void) {
  const text = value.trim();
  const index = state.chat.messages.length;
  await dispatch({ type: "chat-share", text });
  start(index, text);
}
