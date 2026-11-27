import { localAiTransport } from "./localAiTransport";
import { z } from "zod";
import type { AppState, Commitment, Quest } from "../shared/schema";
import { newId } from "../shared/actions";
import { suggestedDetails, type SuggestedDetails } from "./suggestedDetails";
import { planningMemories } from "./planningMemories";
import { detailsMayBeMissing } from "./detailsMayBeMissing";

const resultSchema = z.object({ title: z.string().trim().min(1).max(240),
  reason: z.string().trim().min(1).max(1000), minutes: z.number().int().min(1).max(120),
  deadlineLocal: z.string().max(32).optional(), deadlineDate: z.string().max(10).optional(), deadlineEvidence: z.string().max(240).optional(),
  effortMinutes: z.number().int().optional(), effortEvidence: z.string().max(240).optional() }).strict();
export type MemorySnapshot = { id: string; text: string };

export async function proposeLocal(commitment: Commitment, state: AppState, call = localAiTransport): Promise<{ quest: Quest; memorySnapshot: MemorySnapshot[]; details: SuggestedDetails; detailsWarning: boolean }> {
  const memorySnapshot = planningMemories(commitment.title, state.memories)
    .map(({ id, text }) => ({ id, text }));
  const localNow = new Date().toLocaleString("sv-SE").replace(" ", "T");
  const input = JSON.stringify({ localNow, commitment: { id: commitment.id, title: commitment.title, deadline: commitment.deadline, effortMinutes: commitment.effortMinutes }, reflections: memorySnapshot, maxQuestMinutes: state.settings.questMinuteLimit || undefined });
  let raw: string;
  try { raw = await call<string>("local_quest", { input, model: state.settings.localModel }); }
  catch (error) { throw Error(typeof error === "string" ? error : "Local AI is unavailable. Start Ollama and check the selected model."); }
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw Error("Local AI returned invalid JSON. Try again."); }
  const result = resultSchema.safeParse(parsed);
  if (!result.success) throw Error("Local AI returned an invalid quest. Try again.");
  if (state.settings.questMinuteLimit && result.data.minutes > state.settings.questMinuteLimit) throw Error("Local AI exceeded your quest length limit. Try again.");
  if (commitment.effortMinutes && result.data.minutes > commitment.effortMinutes) throw Error("Local AI suggested longer than the estimated total effort. Try again.");
  const { title, reason, minutes, ...suggestions } = result.data;
  const details = suggestedDetails(commitment.title, suggestions, localNow);
  const detailsWarning = !!((suggestions.deadlineLocal || suggestions.deadlineDate) && !details.deadlineLocal && !details.deadlineDate) ||
    !!(suggestions.effortMinutes && !details.effortMinutes) || detailsMayBeMissing(commitment.title, details);
  return { memorySnapshot, details, detailsWarning, quest: { title, reason, minutes, id: newId(), commitmentId: commitment.id,
    sourceIds: [commitment.id, ...memorySnapshot.map((memory) => memory.id)], status: "proposed", planner: "local" } };
}

export async function checkLocalModel(model: AppState["settings"]["localModel"], call = localAiTransport): Promise<boolean> {
  try { return await call<boolean>("local_model_available", { model }); }
  catch (error) { throw Error(typeof error === "string" ? error : "Could not check local AI. Start Ollama and check the selected model."); }
}
