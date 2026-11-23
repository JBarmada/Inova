import type { WearableSlot } from "../../shared/equipment";
import { InterfaceIcon } from "../../shared/InterfaceIcon";

export function ItemGlyph({ slot, color = "#9d8a68" }: { slot: WearableSlot; color?: string }) {
  return <InterfaceIcon kind={slot} fillColor={slot === "glasses" ? "none" : color} outlineColor="#4b2d22" />;
}
