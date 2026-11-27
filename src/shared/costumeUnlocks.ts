import { costumes, type CostumeId } from "./costumes";
import type { QuestCategory } from "./questClassification";

type UnlockRule = { count: number } | { category: Exclude<QuestCategory, "general">; count?: number };

export const costumeUnlocks: Record<CostumeId, UnlockRule> = {
  farquaad: { category: "romance" },
  lorax: { category: "nature" },
  "harry-potter": { category: "study", count: 2 },
  bee: { count: 4 },
  mustache: { category: "career" },
  bob: { count: 6 },
  clown: { count: 7 },
  shrimp: { category: "posture" },
  "wonder-bread": { count: 9 },
  toad: { count: 10 },
  shrek: { category: "swamp" },
  britney: { category: "music" },
  pikachu: { category: "gaming" },
  bush: { category: "fortnite" },
  iso: { category: "precision" },
  "christmas-present": { category: "gifts" },
  "maple-leaf": { category: "canada" },
  turkey: { category: "gratitude" },
  bathrobe: { count: 12 },
  spa: { count: 14 },
  "usc-hoodie": { category: "ufc" },
  bibble: { category: "barbie" },
  fungus: { count: 16 },
  "chicken-nugget": { category: "nuggets" },
  "army-hat": { count: 18 },
  soju: { category: "dinner" },
  "white-house": { category: "civic" },
  elmo: { category: "impressions" },
  mort: { category: "animals" },
  trojan: { category: "courage" },
  flower: { category: "flowers" },
  omen: { category: "strategy" },
  killjoy: { category: "maker" },
  ahri: { category: "league" },
  teemo: { category: "exploring" },
  goth: { category: "goth" },
  egirl: { category: "discord" },
};

export function costumeDescription(id: CostumeId, flavor: string): string {
  const rule = costumeUnlocks[id];
  return "category" in rule ? flavor : `Complete ${rule.count} quests. ${flavor}`;
}

export function qualifyingCostumes(questCount: number, categories: ReadonlyMap<QuestCategory, number>): CostumeId[] {
  return costumes.flatMap(([id]) => {
    const rule = costumeUnlocks[id];
    const progress = "category" in rule ? categories.get(rule.category) ?? 0 : questCount;
    return progress >= (rule.count ?? 1) ? [id] : [];
  });
}
