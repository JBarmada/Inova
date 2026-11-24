import type { AppState } from "../shared/schema";

type Chat = AppState["chat"];

export function followUpIds(chat: Chat): string[] {
  return [...new Set([...(chat.followUpQuestIds ?? []), ...(chat.followUpQuestId ? [chat.followUpQuestId] : [])])];
}

export function withFollowUps(chat: Chat, ids: string[]): Chat {
  return { ...chat, followUpQuestIds: ids, followUpQuestId: ids.at(-1) };
}
