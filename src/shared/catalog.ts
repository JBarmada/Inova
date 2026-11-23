import type { ItemId } from "./schema";

export const items: { id: ItemId; name: string; description: string }[] = [
  { id: "notebook", name: "Little notebook", description: "Complete your first accepted quest." },
  { id: "bandana", name: "Explorer bandana", description: "Complete three accepted quests." },
];
