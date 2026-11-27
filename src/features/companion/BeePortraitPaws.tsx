import { useId } from "react";
import type { PortraitArt } from "./CostumePortrait";
import { BEE_PAW_LIFT } from "./welcomeWalk";

const pawRow = 920;
const pawSplits = [0, 550, 740, 875];

export function BeePortraitPaws({ art, lifts, onError }: {
  art: PortraitArt; lifts: readonly number[]; onError?: () => void;
}) {
  const source = useId();
  return <>
    <defs><image id={source} href={art.source} width={art.width} height={art.height} onError={onError} /></defs>
    <svg width={art.width} height={pawRow} overflow="hidden" aria-hidden="true">
      <use href={`#${source}`} />
    </svg>
    {pawSplits.map((left, index) => {
      const width = (pawSplits[index + 1] ?? art.width) - left;
      const lift = lifts[index] * BEE_PAW_LIFT;
      return <svg key={left} x={left} y={pawRow} width={width} height={art.height - pawRow - lift}
        overflow="hidden" data-paw-lift={lift}>
        <use href={`#${source}`} x={-left} y={-pawRow - lift} />
      </svg>;
    })}
  </>;
}
