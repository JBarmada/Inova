import { invoke, isTauri } from "@tauri-apps/api/core";
import { z } from "zod";
import type { AppState, Commitment, Quest } from "../shared/schema";
import { newId } from "../shared/actions";
import { suggestedDetails, type SuggestedDetails } from "./suggestedDetails";

const resultSchema = z.object({ title: z.string().trim().min(1).max(240),
  reason: z.string().trim().min(1).max(1000), minutes: z.number().int().min(1).max(120),
  deadlineLocal: z.string().max(32).optional(), deadlineEvidence: z.string().max(240).optional(),
  effortMinutes: z.number().int().optional(), effortEvidence: z.string().max(240).optional() }).strict();
export type MemorySnapshot = { id: string; text: string };

export async function proposeLocal(commitment: Commitment, state: AppState, call = invoke): Promise<{ quest: Quest; memorySnapshot: MemorySnapshot[]; details: SuggestedDetails }> {
  const memorySnapshot = state.memories.filter((entry) => entry.aiAllowed).slice(-3)
    .map(({ id, text }) => ({ id, text }));
  if (call === invoke && !isTauri()) throw Error("Local AI requires the desktop app. The sample planner is available here.");
  const input = JSON.stringify({ localNow: new Date().toLocaleString("sv-SE").replace(" ", "T"), commitment: { id: commitment.id, title: commitment.title, deadline: commitment.deadline, effortMinutes: commitment.effortMinutes }, reflections: memorySnapshot, maxQuestMinutes: state.settings.questMinuteLimit || undefined });
  let raw: string;
  try { raw = await call<string>("local_quest", { input, model: state.settings.localModel }); }
  catch (error) { throw Error(typeof error === "string" ? error : "Local AI is unavailable. Try the sample planner."); }
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw Error("Local AI returned invalid JSON. Try again or use the sample planner."); }
  const result = resultSchema.safeParse(parsed);
  if (!result.success) throw Error("Local AI returned an invalid quest. Try again or use the sample planner.");
  if (state.settings.questMinuteLimit && result.data.minutes > state.settings.questMinuteLimit) throw Error("Local AI exceeded your quest length limit. Try again or use the sample planner.");
  if (commitment.effortMinutes && result.data.minutes > commitment.effortMinutes) throw Error("Local AI suggested longer than the estimated total effort. Try again or use the sample planner.");
  const { title, reason, minutes, ...suggestions } = result.data;
  const details = suggestedDetails(commitment.title, suggestions);
  return { memorySnapshot, details, quest: { title, reason, minutes, id: newId(), commitmentId: commitment.id,
    sourceIds: [commitment.id, ...memorySnapshot.map((memory) => memory.id)], status: "proposed", planner: "local" } };
}

export async function checkLocalModel(model: AppState["settings"]["localModel"], call = invoke): Promise<boolean> {
  if (call === invoke && !isTauri()) throw Error("Local AI requires the desktop app. The sample planner is available here.");
  try { return await call<boolean>("local_model_available", { model }); }
  catch (error) { throw Error(typeof error === "string" ? error : "Could not check local AI. Try the sample planner."); }
}
