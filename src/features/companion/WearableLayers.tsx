import type { Equipment } from "../../shared/equipment";
import { itemById } from "../../shared/catalog";
import { wearableAnchors, type ArtFrame } from "./wearableAnchors";
import { ItemGlyph } from "../world/ItemGlyph";

export function WearableLayers({ equipment, frame }: { equipment: Equipment; frame: ArtFrame }) {
  const anchors = wearableAnchors(frame);
  return <svg className="wearable-layers" viewBox="0 0 64 64" aria-hidden="true" shapeRendering="crispEdges">
    {(["body", "socks", "glasses", "hat"] as const).map((slot) => {
      const id = equipment[slot];
      if (!id) return null;
      const item = itemById(id);
      return <g key={slot} data-slot={slot} data-item={id}>
        {anchors[slot].map((anchor, index) => <svg key={index} {...anchor} viewBox="0 0 24 24" overflow="visible">
          {slot === "socks" ? <rect x="0" y="0" width="24" height="24" fill={item.color} stroke="#4b2d22" strokeWidth="2" />
            : <ItemGlyph slot={slot} color={item.color} />}
        </svg>)}
      </g>;
    })}
  </svg>;
}
