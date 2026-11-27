import { z } from "zod";
import { costumeIds, type CostumeId } from "./costumes";

export const wearableSlots = ["hat", "glasses", "socks", "body"] as const;
export type WearableSlot = typeof wearableSlots[number];
export const itemIdSchema = z.enum(["notebook", "bandana", "cap", "beanie", "round-glasses", "star-glasses", "mint-socks", "gold-socks", "raincoat", "hoodie", ...costumeIds]);
export type ItemId = z.infer<typeof itemIdSchema>;
export const slotForItem: Record<ItemId, WearableSlot> = {
  notebook: "body", bandana: "body", cap: "hat", beanie: "hat",
  "round-glasses": "glasses", "star-glasses": "glasses",
  "mint-socks": "socks", "gold-socks": "socks", raincoat: "body", hoodie: "body",
  ...Object.fromEntries(costumeIds.map((id: CostumeId) => [id, "body" as const])) as Record<CostumeId, "body">,
};
export const emptyEquipment = () => ({ hat: null, glasses: null, socks: null, body: null });
export const equipmentSchema = z.object({
  hat: itemIdSchema.nullable(), glasses: itemIdSchema.nullable(),
  socks: itemIdSchema.nullable(), body: itemIdSchema.nullable(),
}).superRefine((equipment, context) => {
  for (const slot of wearableSlots) {
    const item = equipment[slot];
    if (item && slotForItem[item] !== slot) context.addIssue({ code: "custom", path: [slot], message: "Wrong equipment slot." });
  }
});
export type Equipment = z.infer<typeof equipmentSchema>;
