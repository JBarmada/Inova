import type { Equipment } from "./equipment";

export const wardrobeScenarios = [
  { id: "rainy", name: "Rainy study walk", description: "All four slots, including raincoat behind glasses.",
    equipment: { hat: "cap", glasses: "round-glasses", socks: "mint-socks", body: "raincoat" } },
  { id: "cozy", name: "Cozy library day", description: "Replaces each slot while keeping four layers active.",
    equipment: { hat: "beanie", glasses: "star-glasses", socks: "gold-socks", body: "hoodie" } },
  { id: "explorer", name: "Explorer", description: "Bandana with accessories; no hat.",
    equipment: { hat: null, glasses: "round-glasses", socks: "mint-socks", body: "bandana" } },
] as const satisfies readonly { id: string; name: string; description: string; equipment: Equipment }[];
export type WardrobeScenarioId = typeof wardrobeScenarios[number]["id"];
