import { faceCostumePlacement } from "./faceCostumePlacement";
import type { ArtFrame } from "./wearableAnchors";

type Fit = { headX?: number; headY?: number; walkFrame?: number };
export function RearCostumeLayer({ id, frame, peak = false, fit }: {
  id: string | null; frame: ArtFrame; peak?: boolean; fit?: Fit;
}) {
  if (id !== "ahri") return null;
  const { x, headY } = faceCostumePlacement(frame, fit?.walkFrame);
  const compact = headY >= 4 || frame.startsWith("sitting") || frame === "sit-06" || frame === "sit-07" || frame === "tucking";
  const dx = fit?.walkFrame === undefined ? fit?.headX ?? 0 : x - 20;
  const animationShift = fit?.walkFrame === undefined ? fit?.headY ?? 0 : 0;
  const dy = (headY >= 4 ? 3 : compact ? headY - 1 : 0) + animationShift - Number(peak);
  return <svg className="wearable-layers" viewBox="0 0 64 64" aria-hidden="true" shapeRendering="crispEdges" data-rear-costume={id}>
    <g transform={`translate(${dx} ${dy})`}><FoxTails compact={compact} /></g>
  </svg>;
}

const tailFan = [
  [39, 15, 0.91], [46, 17, 0.86], [51, 21, 0.81], [54, 25, 0.82], [56, 29, 0.68],
  [55, 33, 0.72], [53, 36, 0.6], [51, 39, 0.55], [49, 41, 0.5],
] as const;

export function FoxTails({ compact }: { compact: boolean }) {
  return <g transform={compact ? "translate(8 14) scale(.77 .7)" : undefined}>
    {tailFan.map(([x,y,scale]) => <g key={y} transform={`translate(${x} ${y}) scale(${scale})`}>
      <path fill="#69618b" d="M-8 18v-5h2v-4h2V6h3V3h4V1h8v2H9v3H7v4H5v4H2v3h-5v2z" />
      <path fill="#e5d8ed" d="M-7 17v-4h2V9h3V6h3V4h4V2h4v2H8v3H6v3H4v4H1v2h-5v1z" />
      <path fill="#b8a6d6" d="M-6 15h2v-3h3V9h3V7h3v2H4v4H1v2h-4v1h-3z" />
    </g>)}
  </g>;
}
