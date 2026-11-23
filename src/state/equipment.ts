import type { Action } from "../shared/actions";
import type { AppState } from "../shared/schema";
import { emptyEquipment, slotForItem } from "../shared/equipment";
import { wardrobeScenarios } from "../shared/wardrobeScenarios";

type EquipmentAction = Extract<Action, { type: "equip" | "unequip" | "equip-outfit" | "wardrobe-scenario" }>;
export function changeEquipment(state: AppState, action: EquipmentAction): AppState {
  if (action.type === "equip-outfit") {
    if (Object.values(action.equipment).some((id) => id && !state.ownedItems.includes(id))) throw Error("This item is still locked.");
    return { ...state, equipment: action.equipment };
  }
  if (action.type === "unequip") return { ...state, equipment: { ...state.equipment, [action.slot]: null } };
  if (action.type === "wardrobe-scenario") {
    if (!state.settings.devMode) throw Error("Enable developer mode before using fictional wardrobe scenarios.");
    const scenario = wardrobeScenarios.find((entry) => entry.id === action.id);
    if (!scenario) throw Error("Unknown wardrobe scenario.");
    const owned = Object.values(scenario.equipment).filter((id) => id !== null);
    return { ...state, ownedItems: [...new Set([...state.ownedItems, ...owned])], equipment: { ...scenario.equipment } };
  }
  if (!action.item) return { ...state, equipment: emptyEquipment() };
  if (!state.ownedItems.includes(action.item)) throw Error("This item is still locked.");
  return { ...state, equipment: { ...state.equipment, [slotForItem[action.item]]: action.item } };
}
