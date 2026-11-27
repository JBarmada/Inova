import { localAiTransport } from "./localAiTransport";
import { z } from "zod";
import type { AppState, Commitment } from "../shared/schema";
import { newId } from "../shared/actions";
import { planningMemories } from "./planningMemories";
import { detailsMayBeMissing } from "./detailsMayBeMissing";
import { suggestedDetails } from "./suggestedDetails";
import { previousQuestContext } from "./previousQuest";

const step = z.object({ title: z.string().trim().min(1).max(240), reason: z.string().trim().min(1).max(1000),
  minutes: z.number().int().min(1).max(120) }).strict();
const resultSchema = z.object({ explanation: z.string().trim().min(1).max(1000), steps: z.array(step).min(1).max(3),
  deadlineLocal: z.string().max(32).optional(), deadlineDate: z.string().max(10).optional(), deadlineEvidence: z.string().max(240).optional(),
  effortMinutes: z.number().int().optional(), effortEvidence: z.string().max(240).optional() }).strict();

export async function proposeLocalPlan(commitment: Commitment, state: AppState, call = localAiTransport) {
  const previousQuest = previousQuestContext(state);
  const prior = state.quests.find((quest) => quest.id === previousQuest?.id);
  const required = previousQuest?.title ? state.memories.filter((entry) => entry.aiAllowed && entry.id !== prior?.commitmentId && prior?.sourceIds.includes(entry.id)) : [];
  const related = previousQuest ? state.memories.filter((entry) => entry.aiAllowed && entry.questId === previousQuest.id).slice(-1) : [];
  const selected = [...required, ...related, ...planningMemories(commitment.title, state.memories)]
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index).slice(0, 3);
  const memorySnapshot = selected.map(({ id, text }) => ({ id, text }));
  const localNow = new Date().toLocaleString("sv-SE").replace(" ", "T");
  const input = JSON.stringify({ localNow,
    commitment: { id: commitment.id, title: commitment.title, deadline: commitment.deadline, effortMinutes: commitment.effortMinutes },
    reflections: memorySnapshot, previousQuest, maxQuestMinutes: state.settings.questMinuteLimit || undefined });
  let raw: string;
  try { raw = await call<string>("local_quest_plan", { input, model: state.settings.localModel }); }
  catch (error) { throw Error(typeof error === "string" ? error.replace(" Try the sample planner.", "") : error instanceof Error ? error.message : "Local AI is unavailable. Start Ollama and check the selected model."); }
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw Error("Local AI returned invalid JSON."); }
  const result = resultSchema.safeParse(parsed);
  if (!result.success) throw Error("Local AI returned an invalid plan.");
  const { explanation, steps, ...suggestions } = result.data;
  if (steps.some((entry) => (state.settings.questMinuteLimit && entry.minutes > state.settings.questMinuteLimit) ||
    (commitment.effortMinutes && entry.minutes > commitment.effortMinutes))) throw Error("A suggested step exceeds your limit.");
  const details = suggestedDetails(commitment.title, suggestions, localNow);
  const totalEffort = commitment.effortMinutes ?? details.effortMinutes;
  if (totalEffort && steps.reduce((total, entry) => total + entry.minutes, 0) > totalEffort)
    throw Error("The suggested plan exceeds the stated total effort.");
  const detailsWarning = !!((suggestions.deadlineLocal || suggestions.deadlineDate) && !details.deadlineLocal && !details.deadlineDate) ||
    !!(suggestions.effortMinutes && !details.effortMinutes) || detailsMayBeMissing(commitment.title, details);
  const quest = { ...steps[0], id: newId(), commitmentId: commitment.id,
    sourceIds: [commitment.id, ...memorySnapshot.map((memory) => memory.id)], status: "proposed" as const, planner: "local" as const };
  return { quest, memorySnapshot, details, detailsWarning, explanation, steps };
}
