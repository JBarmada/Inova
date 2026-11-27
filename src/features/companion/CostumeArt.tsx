import type { ArtFrame } from "./wearableAnchors";
import { fittedHeadCostume } from "./faceCostumePlacement";
import { FittedFaceCostume } from "./FittedFaceCostume";

export function CostumeArt({ id, frame, peak = false, motion, showGlasses = true, showHat = true }: {
  id: string; frame: ArtFrame; peak?: boolean; showGlasses?: boolean; showHat?: boolean;
  motion?: { headX?: number; headY?: number; walkFrame?: number };
}) {
  if (!fittedHeadCostume(id)) return null;
  return <g data-costume={id}>
    <FittedFaceCostume id={id} frame={frame} peak={peak} motion={motion} showGlasses={showGlasses} showHat={showHat} />
  </g>;
}
