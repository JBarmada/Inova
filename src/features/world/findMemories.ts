import type { Memory } from "../../shared/schema";

export function findMemories(memories: Memory[], query: string): Memory[] {
  const needle = query.trim().toLocaleLowerCase();
  return needle ? memories.filter((entry) => entry.text.toLocaleLowerCase().includes(needle)) : memories;
}
