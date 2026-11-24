import { invoke, isTauri } from "@tauri-apps/api/core";
import { z } from "zod";
import type { AppState } from "../shared/schema";
import { planningMemories } from "./planningMemories";

const response = z.object({ reply: z.string().trim().min(1).max(600) }).strict();

export async function localChat(text: string, state: AppState, call = invoke) {
  if (call === invoke && !isTauri()) throw Error("Local AI chat requires the desktop app.");
  const memorySnapshot = planningMemories(text, state.memories).map(({ id, text }) => ({ id, text }));
  const input = JSON.stringify({ message: text, memories: memorySnapshot });
  let raw: string;
  try { raw = await call<string>("local_companion_reply", { input, model: state.settings.localModel }); }
  catch { throw Error("Local AI could not respond. Try again when it is available."); }
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw Error("Local AI returned an invalid reply."); }
  const result = response.safeParse(parsed);
  if (!result.success) throw Error("Local AI returned an invalid reply.");
  return { reply: result.data.reply, memorySnapshot };
}
