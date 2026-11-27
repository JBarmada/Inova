import { itemById } from "../../shared/catalog";
import type { Equipment } from "../../shared/equipment";
import type { PortraitArt } from "./CostumePortrait";
import { LegacyPawSock, LegacyWearable } from "./LegacyWearable";
import { BEE_PAW_LIFT } from "./welcomeWalk";

export function CostumePortraitAccessories({ art, equipment, pawLifts }: {
  art: PortraitArt; equipment: Equipment; pawLifts?: readonly number[];
}) {
  const { hat, glasses, socks } = equipment;
  const { eyes, eyeTop = 417, paws, groundY } = art;
  return <g shapeRendering="crispEdges">
    {socks && paws?.map((x, index) => <svg key={x} data-item={socks}
      x={x - 54} y={groundY - 108 - (pawLifts?.[index] ?? 0) * BEE_PAW_LIFT}
      width="108" height="108" viewBox="0 0 6 6">
      <LegacyPawSock id={socks} color={itemById(socks).color} />
    </svg>)}
    {eyes && glasses && <PortraitGlasses id={glasses} eyes={eyes} eyeTop={eyeTop} />}
    {eyes && hat && <svg data-item={hat}
      x={(eyes[0] + eyes[1]) / 2 + 28 - 284} y={eyeTop - 300}
      width="568" height="278" preserveAspectRatio="none" viewBox="0 2 24 19">
      <LegacyWearable id={hat} color={itemById(hat).color} />
    </svg>}
  </g>;
}

function PortraitGlasses({ id, eyes, eyeTop }: {
  id: NonNullable<Equipment["glasses"]>; eyes: readonly [number, number]; eyeTop: number;
}) {
  const star = id === "star-glasses";
  // Both shared drawings have lens centers eleven drawing units apart.
  const unit = (eyes[1] - eyes[0]) / 11;
  const top = eyeTop + 31 - (star ? 5.5 : 8.5) * 13;
  return <svg data-item={id} x={eyes[0] + 28 - (star ? 7 : 6.5) * unit} y={top}
    width={(star ? 25 : 24) * unit} height={star ? 156 : 208}
    preserveAspectRatio="none" viewBox={star ? "0 5 25 12" : "0 3 24 16"}>
    <LegacyWearable id={id} color={itemById(id).color} />
  </svg>;
}
