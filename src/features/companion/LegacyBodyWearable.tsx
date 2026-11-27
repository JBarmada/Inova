import { faceCostumePlacement } from "./faceCostumePlacement";
import { fittedFrames, isFittedFrame } from "./poseFrames";
import type { ArtFrame } from "./wearableAnchors";

type BodyItem = "notebook" | "bandana" | "raincoat" | "hoodie";
type Shape = "stand" | "sit" | "loaf";

export function isLegacyBodyItem(id: string | null): id is BodyItem {
  return id === "notebook" || id === "bandana" || id === "raincoat" || id === "hoodie";
}

const coats = {
  stand: {
    outline: "M10 40h5v1h8v1h6v-2h6v-3h7v2h5v4h4v6h-3v1h-7v-1h-6v1h-6v2h-7v-2h-7v-1h-4v-3h-1z",
    fill: "M11 42h4v1h8v1h7v-2h6v-3h5v2h5v3h4v4h-9v-1h-6v1h-7v2h-5v-2h-7v-1h-4v-3h-1z",
    fold: "M31 42h5v-3h5v2h4v2h-6v1h-5v1h-5v-2h2z",
    pocket: "M37 45h7v1h-1v2h-5v-2h-1z",
  },
  sit: {
    outline: "M10 37h4v2h12v-1h5v-2h3v3h3v4h2v4h-2v3h-7v-1h-5v2h-6v-2h-7v-2h-2z",
    fill: "M11 39h3v1h12v-1h6v-1h1v2h3v4h2v2h-2v3h-5v-1h-7v2h-4v-2h-7v-2h-2z",
    fold: "M25 41h4v-2h4v2h3v2h-5v1h-5v-1h-1z",
    pocket: "M27 44h8v2h-2v2h-4v-2h-2z",
  },
  loaf: {
    outline: "M10 47h6v1h11v-1h5v-2h5v1h4v4h-2v2h-5v2H16v-1h-4v-2h-2z",
    fill: "M11 48h5v1h12v-1h5v-2h3v1h4v3h-2v1h-5v2H17v-1h-4v-2h-2z",
    fold: "M26 48h6v-1h5v1h-2v2h-9z",
    pocket: "M30 50h7v1h-3v1h-4z",
  },
};

function bodyFit(frame: ArtFrame, walking: boolean): { shape: Shape; y: number; width: number } {
  if (walking) return { shape: "stand", y: -2, width: 1 };
  if (frame.startsWith("sitting") || frame === "tucking" || frame === "loaf-bend") {
    return { shape: "sit", y: frame === "loaf-bend" ? 3 : 0, width: 1 };
  }
  if (frame.startsWith("loaf") || frame.startsWith("sleep") || frame.startsWith("wake")) {
    const head = faceCostumePlacement(frame).headY;
    return { shape: "loaf", y: Math.min(0, head - 7), width: 1 };
  }
  const progress = isFittedFrame(frame) ? (fittedFrames.indexOf(frame) + 1) / 7 : 0;
  return { shape: "stand", y: -Math.round(progress * 3), width: 1 - progress * .28 };
}

export function LegacyBodyWearable({ id, frame, walkFrame }: {
  id: BodyItem; frame: ArtFrame; walkFrame?: number;
}) {
  const fit = bodyFit(frame, walkFrame !== undefined);
  const dx = 10 * (1 - fit.width) + (walkFrame === undefined ? 0 : faceCostumePlacement(frame, walkFrame).x - 20);
  return <g data-legacy-fit={fit.shape} transform={`translate(${dx} ${fit.y}) scale(${fit.width} 1)`}>
    {id === "raincoat" || id === "hoodie" ? <FittedCoat variant={id} shape={fit.shape} />
      : <ChestItem id={id} shape={fit.shape} />}
  </g>;
}

function FittedCoat({ variant, shape }: { variant: "raincoat" | "hoodie"; shape: Shape }) {
  const rain = variant === "raincoat";
  const { outline, fill, fold, pocket } = coats[shape];
  return <>
    <path fill={rain ? "#845827" : "#57436d"} d={outline} />
    <path fill={rain ? "#efb744" : "#a598c4"} d={fill} />
    <path fill={rain ? "#ffda72" : "#cbbade"} d={fold} />
    <path fill={rain ? "#cb8b30" : "#796a9f"} d={pocket} />
    {rain ? <RaincoatDetails shape={shape} />
      : shape === "loaf" ? <path fill="#cbbade" d="M14 50h7v1h-7z" />
        : <HoodieFront seated={shape === "sit"} />}
  </>;
}

const raincoatDetails = {
  stand: {
    hood: "M32 40h2v-3h2v-2h5v1h2v3h-1v2h-3v2h-7z",
    rim: "M34 40h2v-2h1v-2h4v1h1v2h-1v2h-3v1h-4z",
    lining: "M37 38h1v-1h3v2h-1v1h-4v-1h1z",
    piping: "M11 45h3v1h7v1h6v-1h8v-1h3v1h-3v1h-8v1h-6v-1h-7v-1h-3z",
    snaps: "M18 44h3v1h2v6h-1v-2h-1v-1h1v-1h-1v-2h-3z",
  },
  sit: {
    hood: "M27 39h1v-2h2v-2h4v1h2v3h-1v2h-2v1h-6z",
    rim: "M28 39h2v-2h1v-1h3v1h1v2h-1v1h-2v1h-4z",
    lining: "M30 38h1v-1h3v2h-2v1h-2z",
    piping: "M11 43h4v1h5v1h5v-1h6v-1h4v1h-4v1h-6v1h-5v-1h-5v-1h-4z",
    snaps: "M18 42h3v1h2v6h-1v-2h-1v-1h1v-1h-1v-2h-3z",
  },
  loaf: {
    hood: "M28 48h3v-2h2v-1h5v1h1v2h-2v2h-9z",
    rim: "M30 48h2v-1h2v-1h4v1h-1v1h-1v1h-6z",
    lining: "M33 47h4v1h-4z",
    piping: "M12 51h4v1h10v-1h6v1h-6v1H16v-1h-4z",
    snaps: "M20 50h2v1h-2zm0 2h2v1h-2z",
  },
};

function RaincoatDetails({ shape }: { shape: Shape }) {
  const { hood, rim, lining, piping, snaps } = raincoatDetails[shape];
  return <>
    <path fill="#986323" d={hood} />
    <path fill="#ffd753" d={rim} />
    <path fill="#b57829" d={lining} />
    <path fill="#ffedac" d={piping} />
    <path fill="#805121" d={snaps} />
  </>;
}

function HoodieFront({ seated }: { seated: boolean }) {
  return <g transform={seated ? "translate(0 -2)" : undefined}>
    <path fill="#e7d9ec" d="M15 43h1v1h2v4h-1v-3h-2zm14 1h2v-2h1v3h-2v3h-1z" />
    <path fill="#80729f" d="M19 47h9v1h1v2h-9v-1h-1z" />
    <path fill="#baabd1" d="M20 47h7v1h-7z" />
  </g>;
}

function ChestItem({ id, shape }: { id: "notebook" | "bandana"; shape: Shape }) {
  const y = shape === "stand" ? 42 : shape === "sit" ? 39 : 47;
  return <g transform={`translate(12 ${y})`}>
    {id === "notebook" ? <Notebook low={shape === "loaf"} /> : <ExplorerBandana low={shape === "loaf"} />}
  </g>;
}

function Notebook({ low }: { low: boolean }) {
  return <>
    <path fill="#795844" d="M1 0h4v1h3v1h4V1h3V0h4v2h-4v1h-3v1H8V3H5V2H1z" />
    <path fill="#455537" d={low ? "M6 2h10v1h1v5H6V7H5V3h1z" : "M7 2h9v1h1v8H6V3h1z"} />
    <path fill="#91a971" d={low ? "M7 3h9v3H7z" : "M8 3h8v6H8z"} />
    <path fill="#f3dfab" d={low ? "M9 4h5v1H9zm-2 2h9v1H7z" : "M9 4h5v1H9zm0 2h4v1H9zm-2 3h9v1H7z"} />
  </>;
}

function ExplorerBandana({ low }: { low: boolean }) {
  return <>
    <path fill="#764235" d={low ? "M1 1h5v1h9V1h5v3h-4v2h-4v2H7V6H4V4H1z" : "M0 0h5v1h6v1h4V1h5V0h2v3h-3v2h-3v2h-2v2h-2v2h-2V9H8V7H6V5H3V3H0z"} />
    <path fill="#d47c60" d={low ? "M3 2h3v1h10V2h3v1h-4v2h-4v2H8V5H5V3H3z" : "M2 1h3v1h6v1h4V2h5v1h-2v1h-3v2h-2v2h-2v1h-1V8H9V6H7V4H4V3H2z"} />
    <path fill="#f8b78b" d={low ? "M8 4h4v1h-1v1H9V5H8z" : "M8 4h6v1h-2v2h-1V6H9V5H8z"} />
  </>;
}
