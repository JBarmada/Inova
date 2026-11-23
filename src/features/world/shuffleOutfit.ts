import { emptyEquipment, slotForItem, wearableSlots, type Equipment, type ItemId } from "../../shared/equipment";

export function shuffledOutfit(owned: ItemId[], random = Math.random): Equipment {
  const outfit = emptyEquipment() as Equipment;
  for (const slot of wearableSlots) {
    const choices = owned.filter((id) => slotForItem[id] === slot);
    if (choices.length) outfit[slot] = choices[Math.floor(random() * choices.length)];
  }
  return outfit;
}
