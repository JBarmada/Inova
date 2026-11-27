import type { Equipment } from "../../shared/equipment";
import { preload } from "react-dom";
import { CostumePortrait, type CostumeArtwork, type CostumePose, type PortraitExpression } from "./CostumePortrait";

export function CostumePoseFrame({ art, motion, expression, equipment, pawLifts, onError }: {
  art: CostumeArtwork; motion: { pose: CostumePose; squash: number };
  expression: PortraitExpression; equipment: Equipment; pawLifts?: readonly number[]; onError: () => void;
}) {
  for (const portrait of Object.values(art)) preload(portrait.source, { as: "image" });
  const portrait = art[motion.pose];
  const edge = Math.max(portrait.width, portrait.height);
  const ground = ((edge - portrait.height) / 2 + portrait.groundY) / edge;
  const shift = (0.9 - ground) * 100 * motion.squash;
  return <div className="costume-pose-frame" data-costume-pose={motion.pose}
    style={{ transform: `translateY(${shift}%) scaleY(${motion.squash})` }}>
    <CostumePortrait art={portrait} expression={expression} equipment={equipment} pawLifts={pawLifts} onError={onError} />
  </div>;
}
