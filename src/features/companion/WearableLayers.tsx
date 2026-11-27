import type { Equipment } from "../../shared/equipment";
import { itemById } from "../../shared/catalog";
import { wearableAnchors, type ArtFrame } from "./wearableAnchors";
import { ItemGlyph } from "../world/ItemGlyph";
import { CostumeArt } from "./CostumeArt";
import { fittedHeadCostume } from "./faceCostumePlacement";
import { isLegacyWearable, LegacyPawSock, LegacyWearable } from "./LegacyWearable";
import { isLegacyBodyItem, LegacyBodyWearable } from "./LegacyBodyWearable";

export function WearableLayers({ equipment, frame, peak = false, motion }: {
  equipment: Equipment; frame: ArtFrame; peak?: boolean; motion?: { headX?: number; headY?: number; feet?: number[][]; walk?: boolean; walkFrame?: number };
}) {
  const anchors = wearableAnchors(frame);
  if (motion?.feet) anchors.socks = motion.feet.map(([x, y]) => ({ x: x - 2, y: y - 1, width: 4, height: 3 }));
  return <svg className="wearable-layers" viewBox="0 0 64 64" aria-hidden="true" shapeRendering="crispEdges">
    {(["body", "socks", "glasses", "hat"] as const).map((slot) => {
      const id = equipment[slot];
      if (!id) return null;
      if (slot === "body" && fittedHeadCostume(id)) return <g key={slot} data-slot={slot} data-item={id}>
        <CostumeArt id={id} frame={frame} peak={peak} motion={motion} showGlasses={!equipment.glasses} showHat={!equipment.hat} />
      </g>;
      const item = itemById(id);
      const head = slot === "hat" || slot === "glasses";
      const dx = head ? motion?.headX ?? 0 : 0;
      const dy = (head ? motion?.headY ?? 0 : 0) - (peak && slot !== "socks" ? 1 : 0);
      return <g key={slot} data-slot={slot} data-item={id} transform={dx || dy ? `translate(${dx} ${dy})` : undefined}>
        {slot === "body" && isLegacyBodyItem(id) ? <LegacyBodyWearable id={id} frame={frame} walkFrame={motion?.walkFrame} />
          : anchors[slot].map((anchor, index) => isLegacyWearable(id) && slot !== "body"
            ? <LegacyAccessoryLayer key={index} slot={slot} anchor={anchor} id={id} color={item.color} />
            : <svg key={index} {...anchor} viewBox="0 0 24 24" overflow="visible">
              <ItemGlyph slot={slot} color={item.color} />
            </svg>)}
      </g>;
    })}
  </svg>;
}

function LegacyAccessoryLayer({ slot, anchor, id, color }: {
  slot: "socks" | "hat" | "glasses"; anchor: { x: number; y: number }; id: string; color: string;
}) {
  if (slot === "socks") {
    return <svg x={anchor.x - 1} y={Math.min(50, anchor.y - 2)} width="6" height="6" viewBox="0 0 6 6">
      <LegacyPawSock id={id} color={color} />
    </svg>;
  }

  if (id === "star-glasses") {
    return <svg x={anchor.x - 3} y={anchor.y - 2} width="25" height="12" viewBox="0 5 25 12">
      <LegacyWearable id={id} color={color} />
    </svg>;
  }
  const hat = slot === "hat";
  return <svg x={anchor.x - (hat ? 6 : 3)} y={anchor.y - (hat ? 7 : 1)}
    width={hat ? 31 : 27} height={hat ? 15 : 10} preserveAspectRatio="none"
    viewBox={hat ? "0 2 24 19" : "0 3 24 16"}>
    <LegacyWearable id={id} color={color} />
  </svg>;
}
