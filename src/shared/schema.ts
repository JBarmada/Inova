import { z } from "zod";

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
  status: questStatusSchema, planner: z.literal("sample"),
});
export const memorySchema = z.object({
  id, text, createdAt: z.iso.datetime(), aiAllowed: z.boolean(),
  questId: id.optional(),
});
export const stateSchema = z.object({
  schemaVersion: z.literal(1),
  pet: z.object({ name: z.string().max(40), adopted: z.boolean(), mood: moodSchema }),
  settings: z.object({ muted: z.boolean() }),
  commitments: z.array(commitmentSchema),
  quests: z.array(questSchema),
  memories: z.array(memorySchema),
  ownedItems: z.array(z.enum(["notebook", "bandana"])),
  equippedItem: z.enum(["notebook", "bandana"]).nullable(),
  rewardedQuestIds: z.array(id),
});

export type AppState = z.infer<typeof stateSchema>;
export type Quest = z.infer<typeof questSchema>;
export type Memory = z.infer<typeof memorySchema>;
export type Commitment = z.infer<typeof commitmentSchema>;
export type ItemId = AppState["ownedItems"][number];
