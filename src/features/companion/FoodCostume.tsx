type FoodId = "shrimp" | "wonder-bread" | "chicken-nugget";

const shell = {
  shrimp: { edge: "#85434d", fill: "#ee8c86", light: "#ffbeb0", dark: "#b95a5b" },
  "wonder-bread": { edge: "#655777", fill: "#f5e9d9", light: "#fff8e7", dark: "#c1abc1" },
  "chicken-nugget": { edge: "#804921", fill: "#df962e", light: "#ffd066", dark: "#b56925" },
};

const tallRim = "M3 36v-9h2v-5h2v-4h4v-4h4v-2h16v2h5v3h3v6h2v6h2v9h-4v4h-6v2H13v-2H8v-2H5v-4z";
const lowRim = "M3 34v-9h3v-5h3v-3h5v-2h17v2h5v3h4v5h2v11h-3v4h-5v2H12v-2H7v-3H4v-3z";
const rimFill = "M5 35v-8h2v-5h2v-4h4v-3h4v-2h13v2h5v3h3v6h2v6h1v7h-3v4h-6v2H14v-2H9v-2H6v-4z";
const lowerFill = "M5 34v-9h3v-5h2v-2h5v-2h15v2h5v3h4v5h2v9h-3v4h-5v2H13v-2H8v-3H6v-2z";
const faceOpening = "M8 36v-8h2v-4h2v-3h5v-1h10v1h6v2h3v5h2v7h-3v4h-5v2H16v-1h-5v-2H8z";
const lowerOpening = "M8 34v-7h2v-4h4v-2h14v1h6v2h3v11h-3v3h-5v2H15v-1h-4v-3H8z";

export function FoodCostume({ id, seated, headY, showHat }: {
  id: FoodId; seated: boolean; headY: number; showHat: boolean;
}) {
  const low = headY >= 4;
  return <>
    {showHat && <FoodHood id={id} low={low} />}
    <FoodBody id={id} compact={seated || low} lift={low ? Math.max(3, headY - 4) : 0} />
  </>;
}

function FoodHood({ id, low }: { id: FoodId; low: boolean }) {
  const palette = shell[id];
  return <>
    {id === "shrimp" && <Antennae />}
    <path fill={palette.edge} fillRule="evenodd" d={`${low ? lowRim : tallRim} ${low ? lowerOpening : faceOpening}`} />
    <path fill={palette.fill} fillRule="evenodd" d={`${low ? lowerFill : rimFill} ${low ? lowerOpening : faceOpening}`} />
    <path fill={palette.light} d={low
      ? "M10 20h4v-2h12v1H15v1h-3v2h-2z"
      : "M9 20h3v-3h4v-2h13v1H18v2h-5v2h-2v2H9z"} />
    {id === "wonder-bread" && <BagTie />}
    {id === "chicken-nugget" && <Crumbs low={low} />}
  </>;
}

function Antennae() {
  return <>
    <path fill="#82444b" d="M9 19v-7h2V9h3V6h4V4h4v3h-4v2h-3v3h-3v7zm12-3v-6h2V7h3V4h7v2h3v3h-4V7h-5v2h-3v3h-1v4z" />
    <path fill="#eda598" d="M10 16v-4h2V9h3V7h4V5h2v1h-2v2h-3v2h-2v2h-2v4zm13-4v-2h1V8h3V5h6v1h-5v3h-3v3z" />
  </>;
}

function BagTie() {
  return <>
    <path fill="#675888" d="M13 5h4V3h10v1h6v2h6v3h-3v2h-4v2h-4v3H17v-3h2v-2h-3V9h-3z" />
    <path fill="#fff2ea" d="M15 6h4V4h7v1h6v2h5v2h-3v2h-4v2H20v-2h-2V9h-3z" />
    <path fill="#ded0df" d="M19 7h2v2h2v3h-2v-2h-2zm10-1h2v2h-2v2h-3v2h-2v-3h3V7h2z" />
    <path fill="#a94353" d="M18 13h11v3H18z" /><path fill="#ee7969" d="M19 13h8v1h-8z" />
  </>;
}

function Crumbs({ low }: { low: boolean }) {
  return <g transform={low ? "translate(0 2)" : undefined}>
    <path fill="#fbc35d" d="M18 14h3v2h-3zm7 1h3v2h-3zm7 2h2v2h-2zM6 25h2v2H6zm33 4h2v2h-2z" />
    <path fill="#b96e28" d="M16 18h2v1h-2zm14 0h2v2h-2zM6 33h2v2H6zm33 2h2v2h-2z" />
  </g>;
}

function FoodBody({ id, compact, lift }: { id: FoodId; compact: boolean; lift: number }) {
  const { edge, fill, light, dark } = shell[id];
  return <g transform={lift ? `translate(0 ${-lift})` : undefined}>
    <path fill={edge} d={compact
      ? "M9 39h4v2h6v2h11v-2h5v-3h3v3h2v7h-3v2h-8v-1h-7v1h-8v-2h-4v-3H9z"
      : "M8 40h5v2h7v2h10v-2h5v-4h5v-2h5v2h4v4h3v7h-6v-1h-7v1h-9v2h-8v-2h-9v-2H9v-3H8z"} />
    <path fill={fill} d={compact
      ? "M10 41h3v1h6v2h11v-2h6v-3h1v3h2v5h-3v2h-6v-1h-9v1h-6v-2h-4v-3h-1z"
      : "M9 42h4v1h7v2h10v-2h6v-4h5v-2h3v2h4v4h3v5h-5v-1h-7v1h-10v2h-6v-2h-9v-2h-4v-2H9z"} />
    {id === "shrimp" && <path fill={dark} d={compact
      ? "M16 44h2v4h-2zm13 1h2v3h-2zm6-3h2v4h-2z"
      : "M18 45h2v3h-2zm12-1h2v4h-2zm7-4h3v3h-1v4h-2zm7-2h2v4h2v5h-2v-4h-2z"} />}
    {id === "shrimp" && <g transform={compact ? "translate(-1 20) scale(.82 .55)" : undefined}><TailFins /></g>}
    {id === "wonder-bread" && <BreadDots compact={compact} />}
    {id === "chicken-nugget" && <path fill={light} d={compact
      ? "M12 44h3v1h-3zm7 1h2v2h-2zm8 1h2v1h-2zm8-3h2v2h-2z"
      : "M13 44h2v2h-2zm6 2h3v1h-3zm8 1h2v2h-2zm8-3h2v2h-2zm6-4h3v2h-3zm5 4h2v2h-2z"} />}
  </g>;
}

function TailFins() {
  return <>
    <path fill="#85434d" d="M44 42v-6h2v-4h3v-4h2v-2h5v2h3v4h-2v4h-3v3h-3v3z" />
    <path fill="#ee8c86" d="M46 41v-5h2v-4h2v-3h2v-2h3v2h3v3h-2v3h-3v3h-3v3z" />
    <path fill="#ffbeb0" d="M48 36h2v-3h2v-3h2v1h-1v3h-2v3h-3z" />
  </>;
}

function BreadDots({ compact }: { compact: boolean }) {
  return <>
    <path fill="#cb4c53" d="M13 43h3v3h-3zm12 3h3v3h-3z" />
    <path fill="#5364a8" d="M18 45h3v3h-3zm15-2h3v3h-3z" />
    <path fill="#e3af49" d="M30 44h2v3h-2zm7 1h2v2h-2z" />
    {!compact && <><path fill="#cf5355" d="M46 44h3v3h-3z" /><path fill="#5364a8" d="M41 39h3v3h-3z" /></>}
  </>;
}
