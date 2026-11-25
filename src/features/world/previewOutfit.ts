import { itemById } from "../../shared/catalog";
import type { Equipment, ItemId } from "../../shared/equipment";

export function previewOutfit(equipment: Equipment, itemId: ItemId | null): Equipment {
  if (!itemId) return equipment;
  const item = itemById(itemId);
  return { ...equipment, [item.slot]: item.id };
}
