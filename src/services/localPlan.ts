import { invoke, isTauri } from "@tauri-apps/api/core";
import { z } from "zod";
import type { AppState, Commitment } from "../shared/schema";
import { newId } from "../shared/actions";
import { planningMemories } from "./planningMemories";
import { detailsMayBeMissing } from "./detailsMayBeMissing";
import { suggestedDetails } from "./suggestedDetails";

const step = z.object({ title: z.string().trim().min(1).max(240), reason: z.string().trim().min(1).max(1000),
  minutes: z.number().int().min(1).max(120) }).strict();
const resultSchema = z.object({ explanation: z.string().trim().min(1).max(1000), steps: z.array(step).min(1).max(3),
  deadlineLocal: z.string().max(32).optional(), deadlineDate: z.string().max(10).optional(), deadlineEvidence: z.string().max(240).optional(),
  effortMinutes: z.number().int().optional(), effortEvidence: z.string().max(240).optional() }).strict();

export async function proposeLocalPlan(commitment: Commitment, state: AppState, call = invoke) {
  if (call === invoke && !isTauri()) throw Error("Local AI requires the desktop app.");
  const memorySnapshot = planningMemories(commitment.title, state.memories).map(({ id, text }) => ({ id, text }));
  const input = JSON.stringify({ localNow: new Date().toLocaleString("sv-SE").replace(" ", "T"),
    commitment: { id: commitment.id, title: commitment.title, deadline: commitment.deadline, effortMinutes: commitment.effortMinutes },
    reflections: memorySnapshot, maxQuestMinutes: state.settings.questMinuteLimit || undefined });
  let raw: string;
  try { raw = await call<string>("local_quest_plan", { input, model: state.settings.localModel }); }
  catch { throw Error("Local AI could not make a plan."); }
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw Error("Local AI returned invalid JSON."); }
  const result = resultSchema.safeParse(parsed);
  if (!result.success) throw Error("Local AI returned an invalid plan.");
  const { explanation, steps, ...suggestions } = result.data;
  if (steps.some((entry) => (state.settings.questMinuteLimit && entry.minutes > state.settings.questMinuteLimit) ||
    (commitment.effortMinutes && entry.minutes > commitment.effortMinutes))) throw Error("A suggested step exceeds your limit.");
  const details = suggestedDetails(commitment.title, suggestions);
  const totalEffort = commitment.effortMinutes ?? details.effortMinutes;
  if (totalEffort && steps.reduce((total, entry) => total + entry.minutes, 0) > totalEffort)
    throw Error("The suggested plan exceeds the stated total effort.");
  const detailsWarning = !!((suggestions.deadlineLocal || suggestions.deadlineDate) && !details.deadlineLocal && !details.deadlineDate) ||
    !!(suggestions.effortMinutes && !details.effortMinutes) || detailsMayBeMissing(commitment.title, details);
  const quest = { ...steps[0], id: newId(), commitmentId: commitment.id,
    sourceIds: [commitment.id, ...memorySnapshot.map((memory) => memory.id)], status: "proposed" as const, planner: "local" as const };
  return { quest, memorySnapshot, details, detailsWarning, explanation, steps };
}
