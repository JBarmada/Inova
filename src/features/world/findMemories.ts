import type { Memory } from "../../shared/schema";

export function findMemories(memories: Memory[], query: string, category: "all" | NonNullable<Memory["category"]> = "all"): Memory[] {
  const needle = query.trim().toLocaleLowerCase();
  return memories.filter((entry) => (category === "all" || (entry.category ?? "misc") === category) && (!needle || `${entry.title ?? ""} ${entry.text}`.toLocaleLowerCase().includes(needle)));
}
