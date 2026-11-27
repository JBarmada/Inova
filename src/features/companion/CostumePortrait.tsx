import type { Equipment } from "../../shared/equipment";
import { CostumePortraitAccessories } from "./CostumePortraitAccessories";
import { BeePortraitPaws } from "./BeePortraitPaws";

export type PortraitExpression = "idle" | "happy" | "tired" | "blink" | "bark";
export type PortraitArt = {
  source: string; width: number; height: number; groundY: number; eyes?: readonly [number, number];
  eyeTop?: number; mouth?: readonly [number, number]; paws?: readonly number[];
};

export function CostumePortrait({ art, expression, equipment, pawLifts, onError }: {
  art: PortraitArt; expression: PortraitExpression; equipment?: Equipment; pawLifts?: readonly number[]; onError?: () => void;
}) {
  const { width, height, source, eyes, eyeTop: top = 417, mouth } = art;
  return <svg className="dog-bee-portrait" viewBox={`0 0 ${width} ${height}`} aria-hidden="true" data-bee-expression={expression}>
    {pawLifts?.some(Boolean) ? <BeePortraitPaws art={art} lifts={pawLifts} onError={onError} />
      : <image href={source} width={width} height={height} onError={onError} />}
    {expression !== "idle" && expression !== "bark" && eyes?.map((x) => <g key={x} shapeRendering="crispEdges">
      <rect x={x - 3} y={top - 3} width="69" height="67" fill="#f8aa5c" />
      {expression === "happy" ? <path d={`M${x} ${top + 37} h12 v-12 h12 v-7 h14 v7 h12 v12 h-12 v-6 h-26 v6 z`} fill="#3e261c" />
        : expression === "tired" ? <path d={`M${x} ${top + 19} h60 v12 h-9 v14 h-42 v-14 h-9 z`} fill="#3e261c" />
        : <path d={`M${x} ${top + 27} h60 v12 h-60 z`} fill="#3e261c" />}
    </g>)}
    {expression === "bark" && mouth && <g transform={`translate(${mouth.join(" ")})`} shapeRendering="crispEdges">
      <rect x="-146" width="292" height="96" fill="#faecd7" />
      <path d="M-42 17h84v15h15v53H42v15h-84V85h-15V32h15z" fill="#3e261c" />
      <path d="M-25 73h50v14h-50z" fill="#e88678" />
      <path d="M331 20h14V8h14V-4h14v14h-14v12h-14v12h-14z M349 44h35v14h-35z M332 69h14v12h14v12h-14V81h-14z" fill="#754221" />
    </g>}
    {equipment && <CostumePortraitAccessories art={art} equipment={equipment} pawLifts={pawLifts} />}
  </svg>;
}

export const beePortraits = {
  standing: { source: "/dog/experiments/bee-approved-standing.png", width: 1415, height: 1111, groundY: 1014, eyes: [355, 583], mouth: [501, 535], paws: [449, 632, 810, 971] },
  sitting: { source: "/dog/experiments/bee-sitting.png", width: 1312, height: 1199, groundY: 1165, eyes: [500, 715], mouth: [638, 530], paws: [474, 584, 691, 798] },
  loaf: { source: "/dog/experiments/bee-loaf.png", width: 1312, height: 1199, groundY: 1017, eyes: [498, 722], eyeTop: 446, mouth: [642, 564] },
} satisfies Record<string, PortraitArt>;

export type CostumePose = keyof typeof beePortraits;
export type CostumeArtwork = Record<CostumePose, PortraitArt>;

const costumeArtwork: Readonly<Record<string, CostumeArtwork | undefined>> = { bee: beePortraits };

export function getCostumeArt(id: string | null | undefined) {
  return id && Object.hasOwn(costumeArtwork, id) ? costumeArtwork[id] : undefined;
}

