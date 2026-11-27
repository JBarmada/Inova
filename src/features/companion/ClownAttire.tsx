import { useId } from "react";
import { fittedFrames, isFittedFrame } from "./poseFrames";
import type { ArtFrame } from "./wearableAnchors";

const suitShapes = {
  standing: "M12 42h6v2h10v-2h5v-3h6v-2h5v2h3v4h2v6h-3v2h-5v-2h-6v1h-5v2h-7v-2h-5v1h-4v-2h-2z",
  sitting: "M10 39h5v2h13v-1h5v-2h4v4h2v6h-3v2h-5v-1h-6v1h-9v-1h-4v-2h-2z",
  resting: "M12 48h5v1h12v-1h5v-2h3v1h2v2h1v3h-3v1H17v-1h-4v-2h-1z",
};

export function ClownAttire({ frame, headY, showHat }: {
  frame: ArtFrame; headY: number; showHat: boolean;
}) {
  const resting = frame.startsWith("loaf") || frame.startsWith("sleep") || frame.startsWith("wake");
  const seated = frame.startsWith("sitting") || frame === "tucking";
  const shape = resting ? "resting" : seated ? "sitting" : "standing";
  const sequence = isFittedFrame(frame) ? fittedFrames.indexOf(frame) + 1 : 0;
  const width = 1 - sequence * .05;
  const x = Math.round(12 * (1 - width));
  const y = -headY - Math.round(sequence / 3);
  return <>
    {showHat && <g transform="translate(0 3)"><PartyHat /></g>}
    <path fill="#8d353c" d="M17 29h2v-1h3v1h1v3h-1v1h-4v-1h-1z" />
    <path fill="#ec6253" d="M18 29h4v3h-4z" />
    <path fill="#ffae82" d="M18 29h2v1h-2z" />
    <g transform={`translate(${x} ${y}) scale(${width} 1)`}>
      <PartySuit shape={shape} />
    </g>
  </>;
}

function PartySuit({ shape }: { shape: keyof typeof suitShapes }) {
  const cut = useId();
  const y = shape === "standing" ? 42 : shape === "sitting" ? 39 : 47;
  const buttonY = shape === "resting" ? 51 : y + 6;
  return <>
    <defs><clipPath id={cut}><path d={suitShapes[shape]} /></clipPath></defs>
    <g clipPath={`url(#${cut})`}>
      <rect x="9" y="37" width="42" height="17" fill="#f0ba51" />
      <path fill="#5361a4" d="M22 38h4v3h3v12h-7v-3h-2v-9h2zM40 36h4v18h-6V43h2z" />
      <path fill="#cc4e53" d="M14 43h3v3h-3zm17 1h3v3h-3zm14-3h3v3h-3zm-8 8h3v3h-3zm-11 1h3v3h-3z" />
      <path fill="#ffe396" d="M23 45h2v2h-2zm16 0h2v2h-2zm-5 3h2v2h-2zm-19 1h2v2h-2z" />
    </g>
    <path data-clown-suit={shape} d={suitShapes[shape]} fill="none" stroke="#62404d" strokeWidth="1" />
    <g transform={`translate(0 ${y})`}>
      <path fill="#7e6271" d="M11-2h4v1h4v1h8v-1h5v-2h4v5h-3v2h-5v1h-9V4h-5V2h-3z" />
      <path fill="#fff2dd" d="M12-1h3v1h4v1h8V0h5v-2h3v3h-3v2h-4v1h-9V3h-5V1h-2z" />
    </g>
    <path fill="#963a47" d={`M22 ${buttonY - 1}h2v1h1v2h-1v1h-2v-1h-1v-2h1z`} />
    <path fill="#f57a66" d={`M22 ${buttonY}h2v1h-2z`} />
  </>;
}

function PartyHat() {
  return <>
    <path fill="#743b45" d="M18 17h2v-4h2v-4h2V6h3v3h2v4h2v3h2v4h-4v-1h-9v-1h-2z" />
    <path fill="#f6c360" d="M20 16h2v-4h2V9h1V7h1v3h2v4h2v4H20z" />
    <path fill="#5c70a3" d="M24 11h2v2h-2zm3 4h2v2h-2z" />
    <path fill="#df7269" d="M19 16h5v1h9v2h-4v-1h-9v-1h-1z" />
    <path fill="#783847" d="M22 2h2V1h4v1h2v4h-2v1h-4V6h-2z" />
    <path fill="#e4706a" d="M23 3h2V2h3v1h1v2h-2v1h-3V5h-1z" />
  </>;
}
