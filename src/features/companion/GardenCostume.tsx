type GardenId = "bush" | "bibble" | "fungus";

export function GardenCostume({ id, seated, headY, showHat }: { id: GardenId; seated: boolean; headY: number; showHat: boolean }) {
  const low = headY >= 4;
  const compact = seated || low;
  const hemOffset = low ? 3 - headY : seated ? -1 : -headY;
  return <>
    {showHat && id === "fungus" && <g transform={low ? "translate(2 3) scale(.91 .85)" : undefined}><MushroomHood /></g>}
    {showHat && id === "bibble" && <BibbleHood low={low} />}
    {showHat && id === "bush" && <LeafHood low={low} />}
    <g transform={`translate(0 ${hemOffset})`}>
      {id === "fungus" && <MushroomCoat compact={compact} />}
      {id === "bibble" && <BibbleCoat compact={compact} />}
      {id === "bush" && <LeafCoat compact={compact} />}
    </g>
  </>;
}

function Leaf({ x, y, reverse = false, light = false }: { x: number; y: number; reverse?: boolean; light?: boolean }) {
  return <g transform={`translate(${x} ${y})${reverse ? " scale(-1 1)" : ""}`}>
    <path fill="#354632" d="M3 0h5v1h2v2H9v2H8v2H6v1H3v1H1V7H0V2h3z" />
    <path fill={light ? "#a5b65e" : "#678a49"} d="M3 1h5v1h1v1H8v2H7v2H4v1H2V6H1V3h2z" />
    <path fill={light ? "#d1cb7b" : "#9caa58"} d="M2 6h1V5h1V4h1V3h2v1H6v1H5v1H4v1H2z" />
  </g>;
}

function LeafHood({ low }: { low: boolean }) {
  return <g transform={low ? "translate(0 3)" : undefined}>
    <path fill="#3f5036" d="M5 27v-8h4v-4h6v-3h7v2h7v-1h5v4h5v5h3v6h-4v-4h-3v-4H12v2H8v5z" />
    <Leaf x={8} y={17} reverse /><Leaf x={10} y={13} light />
    <Leaf x={18} y={11} /><Leaf x={28} y={11} light />
    <Leaf x={39} y={15} reverse /><Leaf x={39} y={22} />
  </g>;
}

function LeafCoat({ compact }: { compact: boolean }) {
  return <>
    <path fill="#3e5138" d={compact
      ? "M9 40h7v2h15v-2h9v5h-2v6H12v-2H8v-5h1z"
      : "M9 41h9v1h16v-3h6v-2h7v2h5v6h3v4h-6v2H12v-2H8v-5h1z"} />
    {!compact && <><Leaf x={44} y={38} light /><Leaf x={49} y={43} reverse /></>}
    <Leaf x={14} y={41} reverse /><Leaf x={17} y={42} light /><Leaf x={27} y={43} />
    <Leaf x={39} y={41} reverse light />
  </>;
}

function BibbleHood({ low }: { low: boolean }) {
  return <g transform={low ? "translate(0 3)" : undefined}>
    <path fill="#505673" d="M7 24H3v-6h2v-3h6v-3h6v3h10v-3h7v3h5v3h3v6h-4v5h-4v-9H12v9H8z" />
    <path fill="#91bdde" d="M5 22v-4h2v-2h5v-3h4v3h13v-3h4v3h5v2h2v4h-3v5h-2v-8H11v8H9v-5z" />
    <path fill="#f5c2dc" d="M15 15v-4h3V8h4v1h3V8h4v2h3v4h-2v3H18v-2z" />
    <path fill="#dc96bf" d="M18 15h11v-3h3v2h-2v3H18z" />
    <path fill="#e1ddf1" d="M7 17h4v2H7zm24-2h3v2h-3zm-11-4h4v2h-4z" />
  </g>;
}

function BibbleCoat({ compact }: { compact: boolean }) {
  return <>
    <g transform={compact ? "translate(6 14) scale(.8 .72)" : undefined}>
      <path fill="#765778" d="M39 41v-7h3v-4h4v-3h4v-3h7v3h-1v6h-3v4h-4v4z" />
      <path fill="#ecc3dc" d="M41 39v-5h3v-4h4v-3h7v5h-4v4h-4v3z" />
      <path fill="#b781bb" d="M43 37h3v-3h4v-3h3v-2h2v3h-4v3h-4v3h-4z" />
    </g>
    <path fill="#53647f" d={compact
      ? "M9 42h7v2h15v-2h8v4h-2v5H12v-2H9z"
      : "M9 42h7v2h13v-2h8v-2h10v2h5v6h-3v3h-9v-1h-6v1H12v-2H9z"} />
    <path fill="#91b9d9" d={compact
      ? "M10 43h5v2h17v-2h6v3h-2v4H13v-2h-3z"
      : "M10 43h5v2h15v-2h8v-2h8v2h5v4h-3v3h-7v-1h-8v1H13v-2h-3z"} />
    <path fill="#eaaeca" d="M16 46h2v1h2v-1h2v2h-2v1h-2v-1h-2zm12 0h2v1h2v-1h2v2h-2v1h-2v-1h-2z" />
    {!compact && <path fill="#eaaeca" d="M39 44h2v1h2v-1h2v2h-2v1h-2v-1h-2z" />}
  </>;
}

function MushroomHood() {
  return <>
    <path fill="#754867" d="M4 25v-6h2v-3h3v-3h4v-3h5V8h12v2h6v3h4v3h3v4h2v6h-5v-2h-6v-2H15v2H9v2H5z" />
    <path fill="#cf729d" d="M6 23v-4h2v-3h3v-3h4v-2h4V9h10v2h6v3h4v3h3v4h2v3h-4v-2h-6v-2H14v2H8v2H6z" />
    <path fill="#f8c69e" d="M13 15h4v-2h4v3h-2v2h-6zm15-4h4v2h3v3h-5v-2h-2zm9 6h3v3h-3zM6 23h5v-2h7v-1h15v1h7v2h4v1h-5v-1h-6v-2H18v1h-7v2H6z" />
    <path fill="#6b7648" d="M13 13V9h-2V6H7V4h5v2h3v4h1v3zm19 0V9h2V6h3V4h5v2h-4v2h-2v5z" />
    <path fill="#f9d074" d="M5 4h5v5H5zm35 0h5v5h-5z" />
    <path fill="#fff1ac" d="M6 5h2v2H6zm35 0h2v2h-2z" />
  </>;
}

function MushroomCoat({ compact }: { compact: boolean }) {
  return <>
    <path fill="#784b68" d={compact
      ? "M8 41h7v2h16v-2h8v5h-4v4h-7v1H16v-2h-5v-3H8z"
      : "M8 41h7v2h15v-1h7v-3h10v2h4v3h3v5h-7v2H15v-2h-4v-3H8z"} />
    <path fill="#d789ac" d={compact
      ? "M10 42h4v2h17v-2h7v2h-3v4h-7v2H16v-2h-4v-3h-2z"
      : "M10 42h4v2h17v-1h7v-3h8v2h4v3h3v2h-7v3H15v-2h-3v-3h-2z"} />
    <path fill="#f5b9cd" d="M11 43h5v2h4v1h3v3h-5v-2h-4v-2h-3zm13 3h4v-1h4v-2h4v3h-4v2h-4v1h-4z" />
    <path fill="#718456" d="M13 46h3v1h2v3h-4v-2h-2zm17 2h3v-1h4v2h-4v1h-3z" />
  </>;
}
