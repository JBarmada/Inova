type HouseFit = "wide" | "folding" | "compact";

type NoveltyId = "soju" | "white-house" | "elmo";

export function NoveltyCostume({ id, seated, headY, showHat, folding }: {
  id: NoveltyId; seated: boolean; headY: number; showHat: boolean; folding: boolean;
}) {
  const resting = headY >= 4;
  const compact = seated || resting;
  const hem = resting ? 3 - headY : seated ? -1 : -headY;
  return <>
    {showHat && <g transform={resting ? "translate(0 3)" : undefined}>
      {id === "soju" && <BottleNeck />}
      {id === "white-house" && <HouseRoof />}
      {id === "elmo" && <MonsterHood />}
    </g>}
    <g transform={`translate(0 ${hem})`}>
      {id === "soju" && <BottleLabel compact={compact} />}
      {id === "white-house" && <HouseFacade fit={folding ? "folding" : compact ? "compact" : "wide"} />}
      {id === "elmo" && <MonsterSuit compact={compact} />}
    </g>
  </>;
}

function BottleNeck() {
  return <>
    <path fill="#334c41" d="M15 5h14v3h2v5h-2v3h3v3h3v3h4v6h-3v-4h-6v-3H16v2h-6v5H7v-6h4v-4h4v-5h-2V8h2z" />
    <path fill="#669958" d="M16 6h12v3h2v3h-3v5h3v3h4v3h3v3h-1v-3h-6v-3H16v2h-6v3H9v-2h3v-4h4v-7h-2V9h2z" />
    <path fill="#a0c074" d="M17 7h9v2h-9zm-3 4h15v2H14zm4 4h3v4h-3zm-5 5h3v2h-3z" />
    <path fill="#e3d99d" d="M17 15h1v4h-1z" />
  </>;
}

function BottleLabel({ compact }: { compact: boolean }) {
  return <>
    <path fill="#334c41" d={compact
      ? "M8 39h6v3h18v-3h6v4h2v5h-3v3H12v-2H8z"
      : "M8 40h6v2h18v-3h6v-2h8v2h5v4h3v5h-4v3H13v-2H8z"} />
    <path fill="#689553" d={compact
      ? "M10 41h4v2h18v-2h5v3h2v3h-3v3H13v-2h-3z"
      : "M10 42h4v1h18v-3h7v-2h6v2h5v4h3v3h-4v3H14v-2h-4z"} />
    <path fill="#f0dfae" d="M13 44h20v4h-2v1H15v-1h-2z" />
    <path fill="#769559" d="M17 47h2v-1h2v1h2v-2h2v1h2v1h2v1H17z" />
    {!compact && <path fill="#c4cb79" d="M40 40h5v1h3v2h-2v-1h-6z" />}
  </>;
}

function HouseRoof() {
  return <>
    <path fill="#625253" d="M7 23v-4h4v-2h4v-2h4v-2h4V4h2v3h8v6h-8v1h5v2h5v2h5v5z" />
    <path fill="#e8dfca" d="M9 21v-1h4v-2h4v-2h4v-2h5v2h4v2h5v2h4v1z" />
    <path fill="#fff4dc" d="M14 20h6v-2h7v2h7v1H14z" />
    <path fill="#b75853" d="M25 7h8v5h-8z" />
    <path fill="#f1e3d2" d="M28 8h5v1h-5zm-3 2h8v1h-8z" />
    <path fill="#526f9c" d="M25 7h3v3h-3z" />
  </>;
}

const facadeFits = {
  wide: {
    outline: "M4 34h6v8h25v-7h6v3h10v7h3v5H3v-4h1z",
    facade: "M6 36h3v7h27v-7h4v3h10v7h3v3H4v-2h2z",
    window: "M43 41h5v5h-5z",
  },
  folding: {
    outline: "M4 35h6v7h25v-7h6v4h6v6h3v5H3v-4h1z",
    facade: "M6 37h3v6h27v-6h4v3h6v6h3v3H4v-2h2z",
    window: "M42 42h3v4h-3z",
  },
  compact: {
    outline: "M4 35h6v6h25v-6h6v11h2v4H3v-4h1z",
    facade: "M6 37h3v6h27v-6h4v10h2v2H4v-2h2z",
    window: "",
  },
};

function HouseFacade({ fit }: { fit: HouseFit }) {
  const { outline, facade, window } = facadeFits[fit];
  return <g data-house-fit={fit}>
    <path fill="#645758" d={outline} />
    <path fill="#d3c6b5" d={facade} />
    <path fill="#f9eed8" d="M7 38h2v8H7zm29 0h2v8h-2zM7 46h32v1H7zm3 2h26v1H10z" />
    <path fill="#56749a" d="M14 44h3v2h-3zm5 0h3v2h-3zm6 0h3v2h-3zm5 0h3v2h-3z" />
    <path fill="#67834f" d="M4 43h2v2h3v3H4zm33 2h2v-2h3v2h2v3h-7z" />
    {window && <path fill="#5c789e" d={window} />}
  </g>;
}

function MonsterHood() {
  return <>
    <path fill="#74343d" d="M3 29v-5h2v-4h2v-4h4v-3h5v-2h12v2h6v3h4v3h3v4h2v8h-4v6h-4v-6h2v-6h-2v-5h-4v-2H15v2h-4v4H9v8H7v5H4v-8z" />
    <path fill="#d94b49" d="M5 28v-4h2v-4h2v-3h4v-3h7v-2h5v2h7v2h4v3h3v5h3v6h-2v4h-3v-2h2v-8h-2v-5h-5v-2H14v2H9v4H7v6H5z" />
    <path fill="#673740" d="M11 8h3V6h7v2h3V7h3V5h6v2h4v3h2v7h-4v3H13v-2H9V11h2z" />
    <path fill="#fff0d8" d="M12 9h3V7h5v2h3v7h-2v2h-7v-1h-3v-6h1zm13 0h3V7h5v2h3v2h2v5h-4v2h-7v-2h-2z" />
    <path fill="#3b3033" d="M16 11h4v4h-4zm12 0h4v4h-4z" />
    <path fill="#a94d32" d="M20 14h7v2h2v5h-2v2h-8v-2h-2v-5h3z" />
    <path fill="#f9a648" d="M20 16h7v2h1v2h-2v2h-6v-1h-2v-3h2z" />
    <path fill="#ffc369" d="M20 16h5v1h-5z" />
  </>;
}

function MonsterSuit({ compact }: { compact: boolean }) {
  return <>
    <path fill="#7f353b" d={compact
      ? "M8 40h4v1h4v2h15v-2h7v-2h3v3h-2v6h-4v2h-5v1H15v-2h-4v-2H8z"
      : "M8 40h4v1h4v2h15v-2h5v-2h4v-2h8v2h4v3h2v5h-4v3h-9v1H15v-2h-4v-2H8z"} />
    <path fill="#d34946" d={compact
      ? "M9 42h5v2h5v1h11v-1h5v-3h3v5h-3v3h-6v1H16v-2h-4v-2H9z"
      : "M9 42h5v2h5v1h11v-1h6v-2h4v-3h7v2h4v3h2v2h-4v3h-9v1H16v-2h-4v-2H9z"} />
    <path fill="#ef6960" d="M13 44h3v1h3v1h-5v-1h-1zm8 3h5v1h-5zm8-1h4v1h-4z" />
    {!compact && <path fill="#ee6960" d="M40 42h4v-1h3v1h-2v2h-5zm1 4h6v1h-6z" />}
  </>;
}
