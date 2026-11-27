import { localAiTransport } from "./localAiTransport";
import { z } from "zod";
import type { AppState } from "../shared/schema";
import { followUpMemories } from "./followUpMemories";
import { looksLikeGoal } from "./goalSignal";
import { recentChat } from "./recentChat";
import { topicContext } from "./topicContext";

const response = z.object({ reply: z.string().trim().min(1).max(600), memoryQuote: z.string().max(240).optional(),
  memoryCategory: z.enum(["people", "events", "you", "misc"]).optional(), offerQuest: z.boolean().optional() }).strict();

export async function localChat(text: string, state: AppState, call = localAiTransport, options?: { includeRecent: boolean; beforeIndex: number }) {
  const memorySnapshot = followUpMemories(text, state, options?.beforeIndex ?? 0, options?.includeRecent ?? false).map(({ id, text }) => ({ id, text }));
  const contextSnapshot = options?.includeRecent ? topicContext(text, recentChat(state, options.beforeIndex, memorySnapshot.map(({ id }) => id))) : [];
  const input = JSON.stringify({ message: text, dogName: state.pet.name || undefined, dogPersonality: state.pet.personality, memories: memorySnapshot,
    ...(contextSnapshot.length ? { recentConversation: contextSnapshot.map(({ role, text }) => ({ role, text })) } : {}) });
  let raw: string;
  try { raw = await call<string>("local_companion_reply", { input, model: state.settings.localModel }); }
  catch (error) { throw Error(typeof error === "string" ? error : error instanceof Error ? error.message : "Local AI is unavailable. Start Ollama and check the selected model."); }
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw Error("Local AI returned an invalid reply."); }
  const result = response.safeParse(parsed);
  if (!result.success) throw Error("Local AI returned an invalid reply.");
  const quote = result.data.memoryQuote?.trim();
  const memorySuggestion = quote && !quote.includes("?") && text.includes(quote) && result.data.memoryCategory
    ? { quote, category: result.data.memoryCategory } : undefined;
  return { reply: result.data.reply, memorySnapshot, contextSnapshot, ...(memorySuggestion ? { memorySuggestion } : {}), ...(result.data.offerQuest && looksLikeGoal(text) ? { offerQuest: true } : {}) };
}
