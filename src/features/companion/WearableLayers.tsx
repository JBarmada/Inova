import type { Equipment } from "../../shared/equipment";
import { itemById } from "../../shared/catalog";
import { wearableAnchors, type ArtFrame } from "./wearableAnchors";
import { ItemGlyph } from "../world/ItemGlyph";

export function WearableLayers({ equipment, frame, peak = false, motion }: {
  equipment: Equipment; frame: ArtFrame; peak?: boolean; motion?: { headX?: number; headY?: number; feet?: number[][] };
}) {
  const anchors = wearableAnchors(frame);
  if (motion?.feet) anchors.socks = motion.feet.map(([x, y]) => ({ x: x - 2, y: y - 1, width: 4, height: 3 }));
  return <svg className="wearable-layers" viewBox="0 0 64 64" aria-hidden="true" shapeRendering="crispEdges">
    {(["body", "socks", "glasses", "hat"] as const).map((slot) => {
      const id = equipment[slot];
      if (!id) return null;
      const item = itemById(id);
      const head = slot === "hat" || slot === "glasses";
      const dx = head ? motion?.headX ?? 0 : 0;
      const dy = (head ? motion?.headY ?? 0 : 0) - (peak && slot !== "socks" ? 1 : 0);
      return <g key={slot} data-slot={slot} data-item={id} transform={dx || dy ? `translate(${dx} ${dy})` : undefined}>
        {anchors[slot].map((anchor, index) => <svg key={index} {...anchor} viewBox="0 0 24 24" overflow="visible">
          {slot === "socks" ? <rect x="0" y="0" width="24" height="24" fill={item.color} stroke="#4b2d22" strokeWidth="2" />
            : <ItemGlyph slot={slot} color={item.color} />}
        </svg>)}
      </g>;
    })}
  </svg>;
}
