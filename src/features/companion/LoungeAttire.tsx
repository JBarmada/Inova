import { fittedFrames, isFittedFrame } from "./poseFrames";
import type { ArtFrame } from "./wearableAnchors";

type LoungeId = "bathrobe" | "spa" | "usc-hoodie";
type CoatShape = "stand" | "sit" | "loaf";

const coatShapes = {
  stand: {
    outline: "M11 41h7v2h9v-2h5v-3h6v-2h5v2h4v4h2v8h-5v-1h-5v-1h-6v2h-5v-2h-5v1H13v-2h-2z",
    cloth: "M12 42h6v2h9v-2h6v-3h6v-2h3v2h4v4h2v5h-4v-1h-5v-1h-6v2h-5v-2h-5v2H14v-2h-2z",
    lapels: "M12 42h6v2h5v2h-3v-1h-6v-1h-2zm15 2v-2h6v-3h5v2h-4v3h-6v1h-3v-1z",
    belt: "M14 46h12v-1h8v-2h5v1h-4v2h-9v1H14z",
  },
  sit: {
    outline: "M10 39h5v2h14v-1h5v-2h4v3h2v7h-2v2h-6v-2h-5v1h-7v-1h-8v-2h-2z",
    cloth: "M11 40h4v2h14v-1h6v-2h2v3h2v5h-2v2h-4v-2h-7v1h-5v-1h-8v-2h-2z",
    lapels: "M11 40h4v2h6v3h-2v-2h-6v-1h-2zm16 2h7v-2h3v2h-2v2h-7v1h-2v-2h1z",
    belt: "M13 46h8v-1h7v1h9v1h-9v-1h-7v1h-8z",
  },
  loaf: {
    outline: "M13 47h6v1h12v-2h6v-2h4v1h4v2h2v3h-3v2H17v-1h-4z",
    cloth: "M14 48h5v1h13v-2h6v-2h3v1h3v2h2v2h-3v1H17v-1h-3z",
    lapels: "M15 48h4v1h10v1h-9v-1h-5zm18 0h5v-2h4v1h-3v2h-6z",
    belt: "M34 49h7v-1h3v1h-2v1h-8z",
  },
};

const robe = { edge: "#66546d", cloth: "#e8ddeb", lapel: "#fff3e8", trim: "#a68cac" };
const hoodie = { edge: "#2f2630", cloth: "#473642", lapel: "#b8414b", trim: "#fff1dd" };

function coatFit(frame: ArtFrame, walking: boolean) {
  if (walking) return { shape: "stand" as const, scale: 1, y: -1 };
  if (frame.startsWith("loaf-") || frame.startsWith("sleep") || frame.startsWith("wake")) {
    return { shape: "loaf" as const, scale: .82, y: 0 };
  }
  if (frame.startsWith("sitting") || frame === "tucking") return { shape: "sit" as const, scale: 1, y: 0 };
  const progress = isFittedFrame(frame) ? (fittedFrames.indexOf(frame) + 1) / 7 : 0;
  return { shape: "stand" as const, scale: 1 - progress * .28, y: -progress * 2 };
}

export function LoungeAttire({ id, frame, headY, walking, showHat, showGlasses }: {
  id: LoungeId; frame: ArtFrame; headY: number; walking: boolean; showHat: boolean; showGlasses: boolean;
}) {
  const fit = coatFit(frame, walking);
  return <>
    <g transform={`translate(${12 * (1 - fit.scale)} ${fit.y - headY}) scale(${fit.scale} 1)`}>
      <LoungeCoat id={id} shape={fit.shape} />
    </g>
    {id === "spa" && <SpaHead resting={fit.shape === "loaf"} showHat={showHat} showGlasses={showGlasses} />}
  </>;
}

function LoungeCoat({ id, shape }: { id: LoungeId; shape: CoatShape }) {
  const hooded = id === "usc-hoodie";
  const { edge, cloth, lapel, trim } = hooded ? hoodie : robe;
  const lines = coatShapes[shape];
  return <>
    <path fill={edge} d={lines.outline} />
    <path fill={cloth} d={lines.cloth} />
    <path fill={lapel} d={lines.lapels} />
    {!hooded && <path fill={trim} d={lines.belt} />}
    {shape !== "loaf" && (hooded
      ? <path fill={trim} d="M16 44h1v2h1v-2h1v3h-3zm5 0h4v1h-3v1h2v1h-2v1h-1zm6 0h3v1h-2v2h2v1h-3z" />
      : <path fill={trim} d="M22 45h4v2h-1v3h-1v-3h-2v2h-1v-3h1z" />)}
  </>;
}

function SpaHead({ resting, showHat, showGlasses }: {
  resting: boolean; showHat: boolean; showGlasses: boolean;
}) {
  return <>
    {showHat && <>
      <path fill="#6e566e" d="M4 21v-5h3v-4h3V9h5V6h6V4h9v2h5v3h4v5h2v7h-4v-2h-4v-2H12v2H8v2z" />
      <path fill="#e8dbe9" d="M5 19v-3h3v-4h3v-2h5V7h6V5h7v2h5v3h4v5h2v4h-3v-1h-5v-2H11v2H8v1z" />
      <path fill="#b99ebf" d="M7 16h4v-2h5v-1h7v-2h8V9h4v2h-4v1h-7v2h-8v1h-4v2H7zm13-9h4V6h4v2h-4v1h-4z" />
      <path fill="#fdf3e9" d="M9 13h3v-2h5V9h6V8h5v1h-5v2h-6v1h-5v2H9z" />
    </>}
    <path fill="#9fc48a" d="M8 23h5v-2h4v2h-3v3h-3v4H8zm24 0h5v7h-3v-4h-2zm-18 8h3v1h-3zm15 0h3v1h-3z" />
    {showGlasses && <g transform={resting ? "translate(0 1)" : "translate(0 3)"}>
      <Cucumber x={7} /><Cucumber x={34} />
    </g>}
  </>;
}

function Cucumber({ x }: { x: number }) {
  return <g transform={`translate(${x} 0)`}>
    <path fill="#486b47" d="M-4 26h2v-2h5v2h2v4H3v2h-5v-2h-2z" />
    <path fill="#d6e89d" d="M-3 27h2v-2h3v2h2v2H2v2h-3v-2h-2z" />
    <path fill="#96b866" d="M0 26h1v2h2v1H1v1H0v-1h-2v-1h2z" />
  </g>;
}
