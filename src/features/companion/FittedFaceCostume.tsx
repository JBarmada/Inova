import { RegisteredHeadwear } from "./RegisteredHeadwear";
import { faceCostumePlacement, isRegisteredHeadwear } from "./faceCostumePlacement";
import type { ArtFrame } from "./wearableAnchors";

export function FittedFaceCostume({ id, frame, peak, motion, showGlasses = true, showHat = true }: {
  id: string; frame: ArtFrame; peak: boolean; showGlasses?: boolean; showHat?: boolean;
  motion?: { headX?: number; headY?: number; walkFrame?: number };
}) {
  const { x, y, headY } = faceCostumePlacement(frame, motion?.walkFrame);
  const walking = motion?.walkFrame !== undefined;
  const shiftX = walking ? 0 : motion?.headX ?? 0;
  const shiftY = (walking ? 0 : motion?.headY ?? 0) - Number(peak);
  const headTransform = `translate(${x - 20} ${headY})`;
  return <g data-fitted-face={id} transform={`translate(${shiftX} ${shiftY})`}>
    {isRegisteredHeadwear(id) ? <g transform={headTransform}>
      <RegisteredHeadwear id={id} frame={frame} walkFrame={motion?.walkFrame} showGlasses={showGlasses} showHat={showHat} />
    </g> : id === "bob" ? <g transform={headTransform}><Bob /></g>
      : id === "lorax" ? <>
        <g transform={headTransform}><LoraxBrows /></g>
        <g transform={`translate(${x} ${y})`}><LoraxMustache /></g>
      </>
      : <g transform={`translate(${x} ${y})`}>
        <FancyMustache />
      </g>}
  </g>;
}

function Bob() {
  return <>
    <path fill="#2f2328" d="M4 42V30h1v-6h2v-4h2v-3h4v-2h6v-1h8v1h6v2h4v3h2v4h2v7h1v11H32v-4h2v-8h1v-5h-3v-3h-4v-2h-3v2h-5v-1h-3v2h-4v2h-2v6h1v8H9v3z" />
    <path fill="#493639" d="M5 39V30h2v-7h2v-4h4v-2h7v-1h5v1h8v2h4v4h2v8h1v9h-5v-3h2V25h-3v-3h-4v-2h-4v-2h-3v2h-6v1h-4v2h-3v5H8v11z" />
    <path fill="#695050" d="M11 20h5v-2h7v1h-5v2h-5v2h-2zm18-2h4v1h3v3h-2v-2h-5zM7 29h1v7H7z" />
  </>;
}

function FancyMustache() {
  return <g>
    <path fill="#3c2723" d="M-13-2h2v2h2v1h2v-1h5v1h-4v1h-2v1h-3V2h-1V1h-1zm26 0h-2v2H9v1H7v-1H2v1h4v1h2v1h3V2h1V1h1z" />
    <path fill="#936747" d="M-12-1h1v2h2v1h-2V1h-1zm24 0h-1v2H9v1h2V1h1z" />
  </g>;
}

function LoraxBrows() {
  return <path fill="#d57d24" d="M10 24v-2h3v-1h4v1h1v2h-4v1h-4zm13 0v-2h2v-1h4v1h3v2h-3v1h-3v-1z" />;
}

function LoraxMustache() {
  // Keep the inner fringe above the smile and the lower curls on the cheeks.
  return <>
    <LoraxCurl />
    <g transform="scale(-1 1)"><LoraxCurl /></g>
  </>;
}

function LoraxCurl() {
  return <>
    <path fill="#93521f" d="M-14-3h2v1h2v1h7v1h2v1h-7v2h-1v1h-4V3h-2V-1h1z" />
    <path fill="#f4ae30" d="M-13-2h1v1h3v1h6v1h-6v1h-1v1h-3V2h-1V-1h1z" />
    <path fill="#ffda70" d="M-13-1h1v1h3v1h-2v1h-2z" />
  </>;
}
