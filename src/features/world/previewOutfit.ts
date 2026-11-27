import { slotForItem, type Equipment, type ItemId, type WearableSlot } from "../../shared/equipment";

export type PreviewOutfit = Partial<Record<WearableSlot, ItemId>>;

export function previewOutfit(equipment: Equipment, previews: PreviewOutfit): Equipment {
  const result = { ...equipment };
  for (const [slot, item] of Object.entries(previews) as [WearableSlot, ItemId][]) {
    if (slotForItem[item] === slot) result[slot] = item;
  }
  return result;
}
