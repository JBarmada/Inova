import { CostumePortrait, getCostumeArt } from "../companion/CostumePortrait";
import type { WearableSlot } from "../../shared/equipment";
import { InterfaceIcon } from "../../shared/InterfaceIcon";
import { CostumeArt } from "../companion/CostumeArt";
import { fittedHeadCostume } from "../companion/faceCostumePlacement";
import { FoxTails } from "../companion/RearCostumeLayer";
import { isLegacyWearable, LegacyWearable } from "../companion/LegacyWearable";

export function ItemGlyph({ slot, color = "#9d8a68", id }: { slot: WearableSlot; color?: string; id?: string }) {
  const art = getCostumeArt(id);
  if (art) return <CostumePortrait art={art.standing} expression="idle" />;
  if (id && fittedHeadCostume(id)) return <svg viewBox="0 0 64 64" aria-hidden="true" shapeRendering="crispEdges">
    {id === "ahri" && <FoxTails compact={false} />}<image href="/dog/neutral.png" width="64" height="64" /><CostumeArt id={id} frame="standing" />
  </svg>;
  if (id && isLegacyWearable(id)) return <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="crispEdges"><LegacyWearable id={id} color={color} /></svg>;
  return <InterfaceIcon kind={slot} fillColor={slot === "glasses" ? "none" : color} outlineColor="#4b2d22" />;
}
