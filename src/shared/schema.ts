import { z } from "zod";
import { emptyEquipment, equipmentSchema, itemIdSchema, wearableSlots } from "./equipment";

const id = z.string().min(1).max(100);
const text = z.string().trim().min(1).max(4000);
export const moodSchema = z.enum(["idle", "happy", "tired"]);
export const questStatusSchema = z.enum(["proposed", "accepted", "deferred", "dismissed", "completed"]);
export const commitmentSchema = z.object({
  id, title: text, createdAt: z.iso.datetime(),
});
export const questSchema = z.object({
  id, commitmentId: id, title: text, reason: text,
  sourceIds: z.array(id), minutes: z.number().int().min(1).max(120),
  status: questStatusSchema, planner: z.enum(["sample", "local"]), completedAt: z.iso.datetime().optional(),
});
export const memorySchema = z.object({
  id, text, createdAt: z.iso.datetime(), aiAllowed: z.boolean(),
  questId: id.optional(),
});
const commonSchema = z.object({
  pet: z.object({ name: z.string().max(40), adopted: z.boolean(), mood: moodSchema }),
  settings: z.object({ muted: z.boolean(), devMode: z.boolean().default(false), showStatus: z.boolean().default(false) }),
  commitments: z.array(commitmentSchema),
  quests: z.array(questSchema),
  memories: z.array(memorySchema),
  rewardedQuestIds: z.array(id),
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
export type Memory = z.infer<typeof memorySchema>;
export type Commitment = z.infer<typeof commitmentSchema>;
export type ItemId = AppState["ownedItems"][number];
