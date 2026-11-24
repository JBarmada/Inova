import { z } from "zod";
import { emptyEquipment, equipmentSchema, itemIdSchema, wearableSlots } from "./equipment";

const id = z.string().min(1).max(100);
const text = z.string().trim().min(1).max(4000);
export const localModelSchema = z.enum(["gemma3:12b", "gemma3:4b"]);
export const moodSchema = z.enum(["idle", "happy", "tired"]);
export const personalitySchema = z.enum(["cute", "mean", "sad", "happy"]);
export const questStatusSchema = z.enum(["proposed", "accepted", "deferred", "dismissed", "completed"]);
const timeZone = z.string().min(1).max(100).refine((zone) => {
  try { new Intl.DateTimeFormat("en", { timeZone: zone }); return true; } catch { return false; }
}, "Invalid time zone.");
export const commitmentSchema = z.object({
  id, title: text, createdAt: z.iso.datetime(),
  deadline: z.object({ at: z.iso.datetime(), timeZone }).optional(),
  effortMinutes: z.number().int().min(1).max(10080).optional(),
});
export const planRequestSchema = z.object({ start: z.iso.datetime(), availableUntil: z.iso.datetime(),
  timeZone, recordedAt: z.iso.datetime() });
export const questPlanSchema = planRequestSchema.extend({ end: z.iso.datetime() }).superRefine((plan, context) => {
  const start = Date.parse(plan.start), end = Date.parse(plan.end);
  if (start < Date.parse(plan.recordedAt) || end <= start || end > Date.parse(plan.availableUntil))
    context.addIssue({ code: "custom", message: "Invalid planned time window." });
});
export const questSchema = z.object({
  id, commitmentId: id, title: text, reason: text,
  sourceIds: z.array(id), minutes: z.number().int().min(1).max(120),
  status: questStatusSchema, planner: z.enum(["sample", "local"]), completedAt: z.iso.datetime().optional(),
  priorQuestId: id.optional(),
  futureSteps: z.array(z.object({ title: z.string().trim().min(1).max(240), reason: z.string().trim().min(1).max(1000), minutes: z.number().int().min(1).max(120) })).max(2).optional(),
  plan: questPlanSchema.optional(),
}).superRefine((quest, context) => {
  if (quest.plan && Date.parse(quest.plan.end) - Date.parse(quest.plan.start) !== quest.minutes * 60_000)
    context.addIssue({ code: "custom", path: ["plan"], message: "Plan duration does not match quest." });
});
export const memoryCategorySchema = z.enum(["people", "events", "you", "misc"]);
export const memorySchema = z.object({
  id, text, createdAt: z.iso.datetime(), aiAllowed: z.boolean(),
  category: memoryCategorySchema.optional(),
  source: z.enum(["chat"]).optional(),
  questId: id.optional(),
});
const commonSchema = z.object({
  pet: z.object({ name: z.string().max(40), adopted: z.boolean(), mood: moodSchema, personality: personalitySchema.optional() }),
  settings: z.object({ muted: z.boolean(), devMode: z.boolean().default(false), showStatus: z.boolean().default(false), localModel: localModelSchema.default("gemma3:12b"), questMinuteLimit: z.number().int().min(0).max(120).default(0), reduceMotion: z.boolean().default(false) }),
  commitments: z.array(commitmentSchema),
  quests: z.array(questSchema),
  memories: z.array(memorySchema),
  rewardedQuestIds: z.array(id),
  chat: z.object({ phase: z.enum(["goal", "context", "ready"]), goal: z.string().max(240),
    messages: z.array(z.object({ role: z.enum(["user", "dog"]), text: z.string().min(1).max(4000), sourceIds: z.array(id).max(3).optional(),
      contextExcluded: z.boolean().optional(), contextUserIndices: z.array(z.number().int().min(0).max(199)).max(200).optional(), contextUnknown: z.boolean().optional(),
      memorySuggestion: z.object({ sourceIndex: z.number().int().min(0).max(199), quote: z.string().min(1).max(240), category: memoryCategorySchema }).optional(),
      questSuggestion: z.object({ sourceIndex: z.number().int().min(0).max(199) }).optional() })).max(200),
    pendingReflections: z.array(id).default([]),
    followUpQuestId: id.optional(), contextQuestId: id.optional(),
  }).default({ phase: "goal", goal: "", messages: [], pendingReflections: [] }),
});

const currentSchema = commonSchema.extend({
  schemaVersion: z.literal(2), ownedItems: z.array(itemIdSchema), equipment: equipmentSchema,
}).superRefine((state, context) => {
  for (const slot of wearableSlots) {
    const item = state.equipment[slot];
    if (item && !state.ownedItems.includes(item)) context.addIssue({ code: "custom", path: ["equipment", slot], message: "Equipped item is not owned." });
  }
});
const legacySchema = commonSchema.extend({
  schemaVersion: z.literal(1), ownedItems: z.array(z.enum(["notebook", "bandana"])),
  equippedItem: z.enum(["notebook", "bandana"]).nullable(),
}).transform(({ equippedItem, ...state }) => ({
  ...state, schemaVersion: 2 as const, equipment: { ...emptyEquipment(), body: equippedItem },
}));
export const stateSchema = z.union([currentSchema, legacySchema]).transform((state, context) => {
  const checked = currentSchema.safeParse(state);
  if (!checked.success) {
    for (const issue of checked.error.issues) context.addIssue({ code: "custom", path: issue.path, message: issue.message });
    return z.NEVER;
  }
  return checked.data;
});

export type AppState = z.infer<typeof stateSchema>;
export type Quest = z.infer<typeof questSchema>;
export type PlanRequest = z.infer<typeof planRequestSchema>;
export type Memory = z.infer<typeof memorySchema>;
export type Commitment = z.infer<typeof commitmentSchema>;
export type ItemId = AppState["ownedItems"][number];
