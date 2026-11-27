import { slotForItem, type ItemId, type WearableSlot } from "./equipment";
import { costumes } from "./costumes";
import { costumeDescription } from "./costumeUnlocks";

export type CatalogItem = { id: ItemId; slot: WearableSlot; name: string; description: string; color: string };
const definitions: [ItemId, string, string, string][] = [
  ["notebook", "Notebook badge", "First quest reward. Legacy notebook represented as a body badge.", "#7f9b60"],
  ["bandana", "Explorer bandana", "Complete three accepted quests.", "#c77356"],
  ["cap", "Trail cap", "Prototype item · developer scenarios only.", "#679b85"],
  ["beanie", "Cozy beanie", "Prototype item · developer scenarios only.", "#b391b7"],
  ["round-glasses", "Round glasses", "Prototype item · developer scenarios only.", "#655646"],
  ["star-glasses", "Star glasses", "Prototype item · developer scenarios only.", "#a57831"],
  ["mint-socks", "Mint socks", "Prototype item · developer scenarios only.", "#7cbaa6"],
  ["gold-socks", "Gold socks", "Prototype item · developer scenarios only.", "#d7ad55"],
  ["raincoat", "Raincoat", "Prototype item · developer scenarios only.", "#dcbd57"],
  ["hoodie", "Cozy hoodie", "Prototype item · developer scenarios only.", "#a197c6"],
];
export const items: CatalogItem[] = [
  ...definitions.map(([id, name, description, color]) => ({ id, slot: slotForItem[id], name, description, color })),
  ...costumes.map(([id, name, flavor, color]) => ({ id, slot: slotForItem[id], name, color,
    description: costumeDescription(id, flavor) })),
];
export const itemById = (id: ItemId) => items.find((item) => item.id === id)!;
