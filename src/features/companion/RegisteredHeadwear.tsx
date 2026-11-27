import { useId } from "react";
import { CharacterAttire } from "./CharacterAttire";
import { ClownAttire } from "./ClownAttire";
import { LoungeAttire } from "./LoungeAttire";
import { CreatureHood } from "./CreatureHood";
import { AgentAttire } from "./AgentAttire";
import { FoodCostume } from "./FoodCostume";
import { FestiveCostume } from "./FestiveCostume";
import { GardenCostume } from "./GardenCostume";
import { NoveltyCostume } from "./NoveltyCostume";
import { AdventureCostume } from "./AdventureCostume";
import { StageCostume } from "./StageCostume";
import { faceCostumePlacement, type FittedHeadId } from "./faceCostumePlacement";
import type { ArtFrame } from "./wearableAnchors";

export function RegisteredHeadwear({ id, frame, walkFrame, showGlasses, showHat }: {
  id: FittedHeadId; frame: ArtFrame; walkFrame?: number; showGlasses: boolean; showHat: boolean;
}) {
  const { headY } = faceCostumePlacement(frame, walkFrame);
  const seated = frame.startsWith("sitting") || frame === "sit-06" || frame === "sit-07";
  if (id === "army-hat") return <ArmyCap />;
  if (id === "flower") return <Flower low={headY >= 4} />;
  if (id === "toad") return <><g transform="translate(0 1)"><MushroomCap /></g><ToadVest frame={frame} walkFrame={walkFrame} /></>;
  if (id === "clown") return <ClownAttire frame={frame} headY={headY} showHat={showHat} />;
  if (id === "bathrobe" || id === "spa" || id === "usc-hoodie") {
    return <LoungeAttire id={id} frame={frame} headY={headY} walking={walkFrame !== undefined}
      showHat={showHat} showGlasses={showGlasses} />;
  }
  if (id === "pikachu" || id === "shrek" || id === "mort") {
    return <CreatureHood id={id} seated={seated} headY={headY} />;
  }
  if (id === "iso" || id === "omen" || id === "killjoy") {
    return <AgentAttire id={id} seated={seated || frame === "tucking"} headY={headY} showGlasses={showGlasses} showHat={showHat} />;
  }
  if (id === "shrimp" || id === "wonder-bread" || id === "chicken-nugget") {
    return <FoodCostume id={id} seated={seated || frame === "tucking"} headY={headY} showHat={showHat} />;
  }
  if (id === "christmas-present" || id === "maple-leaf" || id === "turkey") {
    return <FestiveCostume id={id} seated={seated || frame === "tucking"} headY={headY} showHat={showHat} />;
  }
  if (id === "bush" || id === "bibble" || id === "fungus") {
    return <GardenCostume id={id} seated={seated || frame === "tucking"} headY={headY} showHat={showHat} />;
  }
  if (id === "soju" || id === "white-house" || id === "elmo") {
    return <NoveltyCostume id={id} seated={seated || frame === "tucking"} headY={headY}
      showHat={showHat} folding={id === "white-house" && frame === "sit-06"} />;
  }
  if (id === "trojan" || id === "ahri" || id === "teemo") {
    return <AdventureCostume id={id} seated={seated || frame === "tucking"} headY={headY} showHat={showHat} />;
  }
  if (id === "britney" || id === "goth" || id === "egirl") {
    return <StageCostume id={id} seated={seated || frame === "tucking"} headY={headY}
      showHat={showHat} folding={frame === "sit-06"} />;
  }
  return <CharacterAttire id={id} seated={seated} headY={headY} showGlasses={showGlasses} />;
}

function ArmyCap() {
  return <>
    <path fill="#383a2b" d="M7 20h3v-3h3v-4h3V9h5V8h11v1h4v3h3v6h1v5h-6v-2H23v1H9v1H6z" />
    <path fill="#77794c" d="M13 17h2v-4h3v-3h4V9h9v1h4v3h2v6h-4v-1H13z" />
    <path fill="#ad9b62" d="M17 13h3v-2h6v2h-3v2h-3v2h-4v-2h1zm12 0h2v-2h3v2h2v3h-3v-1h-4z" />
    <path fill="#51573d" d="M14 16h4v2h-4zm8-1h4v-2h2v3h4v2H22zm12 1h3v2h-3z" />
    <path fill="#6b6640" d="M8 20h3v-2h20v1h4v2h-7v-1H16v1H8z" />
    <path fill="#a59560" d="M12 19h13v1H12z" />
  </>;
}

const petals = [
  [9, 14], [15, 10], [24, 9], [34, 11], [41, 17],
  [44, 26], [43, 34], [37, 42], [27, 45], [17, 45], [8, 40], [7, 31], [7, 22],
] as const;

function Flower({ low }: { low: boolean }) {
  const mask = useId();
  const opening = "M13 19h6v2h6v-2h6v1h4v4h2v5h2v7h-3v3h-5v2H15v-2h-4v-2H8v-3H6v-3h2v-6h2v-4h3z";
  return <g clipPath={`url(#${mask})`}>
    <defs><clipPath id={mask}><path clipRule="evenodd" d={`M0 0H58V54H0z ${opening}`} /></clipPath></defs>
    {petals.map(([x, y]) => <g key={x + ":" + y} transform={`translate(${x} ${low && y > 35 ? y - 3 : y})`}>
      <path d="M-4-6h8v2h2v2h1v5H5v2H3v2h-6V5h-3V3h-1v-5h1v-2h2z" fill="#844359" />
      <path d="M-3-5h6v2h2v2h1v4H4v2h-2v1h-5V4h-2V2h-1v-3h1v-2h2z" fill="#e78da8" />
      <path d="M-2-4h4v1h-3v1h-2v2h-2v-2h1v-1h2z" fill="#ffd2cd" />
      <path d="M4 0h2v3H4v2H2v1h-4V5h3V3h2V1h1z" fill="#c36786" />
    </g>)}
    <path fill="#e5a44a" d="M10 19h3v-3h8v2h5v-2h8v2h4v5h2v5h2v10h-4v4h-6v2H14v-2H9v-3H5v-3H3v-7h2v-5h2v-3h3z" />
    <path fill="#ffcf70" d="M10 19h3v-3h8v2h5v-2h8v2h-5v2H16v2h-4v3H8v-3h2z" />
  </g>;
}

function MushroomCap() {
  return <>
    <path d="M1 22v-7h2v-4h2V8h4V5h4V3h6V2h9v1h5v2h4v3h4v4h3v6h1v5h-7v-2h-6v-2H14v2H7v2H3z" fill="#583936" />
    <path d="M3 21v-6h2v-4h2V9h3V6h4V4h6V3h7v1h5v2h4v3h3v3h3v6h1v3h-5v-2h-6v-2H14v2H7v2z" fill="#fff3e2" />
    <path d="M6 17h5v-1h5v-1h13v1h6v1h5v2h-4v-1h-5v-1H15v1h-5v1H6z" fill="#d9b5aa" />
    <path d="M16 6h4V4h7v2h3v5h-2v2h-9v-1h-3zM4 13h2v-2h3v4H8v2H4zm34-3h2v3h2v4h-5v-2h-1v-3h2z" fill="#d54037" />
    <path d="M18 6h4V5h5v1h-4v1h-4v3h-2V8h1z" fill="#ed7161" />
  </>;
}

function ToadVest({ frame, walkFrame }: { frame: ArtFrame; walkFrame?: number }) {
  const { headY } = faceCostumePlacement(frame, walkFrame);
  const rest = headY >= 4;
  const seated = frame.startsWith("sitting") || frame === "sit-07" || frame === "sit-06";
  if (rest) return <g>
    <path d="M10 41h4v2h5v3h-3v-1h-4v-1h-2zm20 2h4v-2h3v4h-3v1h-4z" fill="#43558d" />
    <path d="M12 42h3v2h-3zm20 2h3v1h-3z" fill="#ecd577" />
  </g>;
  if (seated) return <g>
    <path d="M12 41h4v3h3v7h-7zm19 2h2v-2h3v10h-8v-6h3z" fill="#303768" />
    <path d="M13 42h2v3h3v5h-5zm18 2h4v6h-6v-4h2z" fill="#5573be" />
    <path d="M14 42h2v3h3v2h-2v-1h-3zm17 2h2v2h-4v3h-1v-4h3z" fill="#efd87c" />
  </g>;
  return <g transform={`translate(0 ${-headY})`}>
    <path d="M12 41h4v2h5v2h4v-2h4v-2h7v8h-4v2h-8v-2h-3v1h-8v-4h-1z" fill="#303768" />
    <path d="M13 43h3v2h5v4h-7v-3h-1zm12 3h4v-2h6v4h-4v2h-6z" fill="#5573be" />
    <path d="M14 43h3v2h4v2h-4v-1h-3zm12 3h3v-2h4v1h-3v2h-4z" fill="#efd87c" />
  </g>;
}
