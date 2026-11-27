type StageId = "britney" | "goth" | "egirl";

const outfits = {
  britney: { edge: "#514a59", cloth: "#766f80", trim: "#fff0ea", light: "#d1b9c8" },
  goth: { edge: "#382e3e", cloth: "#524353", trim: "#bcaebd", light: "#756074" },
  egirl: { edge: "#452f46", cloth: "#62455f", trim: "#f2a7c5", light: "#c177a7" },
};

export function StageCostume({ id, seated, headY, showHat, folding }: {
  id: StageId; seated: boolean; headY: number; showHat: boolean; folding: boolean;
}) {
  const resting = headY >= 4;
  const compact = seated || resting;
  const hem = resting ? 3 - headY : seated ? -1 : -headY;
  return <>
    {showHat && <g transform={resting ? "translate(0 2)" : undefined}>
      {id === "britney" && <Pigtails />}
      {id === "goth" && <GothHair />}
      {id === "egirl" && <RibbonHair />}
    </g>}
    <g transform={`translate(0 ${hem})`}>
      <StageDress id={id} fit={folding ? "folding" : compact ? "compact" : "standing"} />
    </g>
  </>;
}

function Pigtails() {
  return <>
    <path fill="#78543e" d="M2 27v-7h2v-5h4v-3h6v-2h12v2h6v1h6v3h4v4h3v9h-2v5h2v6h-5v-4h-2v-5h2V21h-4v-4h-3v4h-4v4h-3v-3h-4v-4h-4v3h-4v2h-3v-5H8v5H6v7h2v5H6v5H1v-5h2v-5z" />
    <path fill="#daa267" d="M3 26v-5h2v-5h3v-2h7v-3h10v2h6v2h6v3h4v3h2v8h-2v5h2v4h-2v-3h-2v-4h2V21h-2v-3h-4v-2h-3v4h-4v3h-1v-3h-3v-3h-5v2h-4v2h-3v-4H7v6H5v7h2v4H5v4H3v-2h1v-6H3z" />
    <path fill="#f6c78f" d="M7 16h4v1H8v4H6v-3h1zm9-3h7v2h-5v2h-4v-2h2zm10 2h5v3h-2v2h-2zm11 5h4v2h1v5h-1v-4h-2v-2h-2z" />
    <path fill="#ea9caa" d="M3 16h6v3H3zm33-1h6v3h-6zM3 31h4v2H3zm36 0h4v2h-4z" />
  </>;
}

function GothHair() {
  return <>
    <path fill="#392e3b" d="M5 33V21h2v-4h3v-3h6v-2h13v1h6v3h4v4h2v12h-2v7h-7v-5h4V23h-5v-4h-5v3h-6v-2h-5v3h-5v14H6v-4z" />
    <path fill="#554551" d="M7 29v-8h2v-4h5v-2h6v-2h8v2h6v2h3v4H33v-3H25v1h-5v-2h-6v2h-4v3H8v7zm30 0h3v5h-2v4h-4v-3h3z" />
    <path fill="#302939" d="M4 15h4v1h2v2h3v-2h3v-1h4v7h-4v-1h-3v4h-3v-4H8v1H4zm23 0h4v1h3v2h3v-2h3v-1h4v7h-4v-1h-3v4h-3v-4h-3v1h-4z" />
    <path fill="#766078" d="M6 17h3v2H6zm10 0h2v2h-2zm13 0h3v2h-3zm11 0h2v2h-2z" />
    <path fill="#c6b5c5" d="M36 24h1v5h-1zm-1 1h3v1h-3z" />
  </>;
}

function RibbonHair() {
  return <>
    <path fill="#4a324b" d="M3 28v-8h2v-4h5v-3h7v-2h11v2h7v2h5v3h3v10h-3v5h-5v-4h2v-8h-5v-3h-5v5h-5v-4h-4v3h-4v-2h-4v9H8v4H3v-3z" />
    <path fill="#6f4c67" d="M5 26v-6h2v-3h4v-2h7v-3h9v2h7v2h5v3h3v7h-2v-6h-4v-3h-5v-2h-6v1h-7v1h-5v2H9v6H7v4H5z" />
    <path fill="#dc84a8" d="M3 16h5v2h4v3H8v2H3zm30 3h4v-2h5v7h-5v-2h-4zM8 23h4v2H8zm28 1h4v2h-4z" />
    <path fill="#f5b5c8" d="M5 17h3v2H5zm34 2h2v2h-2zm-10-3h2v2h2v2h-2v-1h-2zm4 0h2v1h-2zm-4 4h2v1h-2z" />
  </>;
}

const compactHem = {
  outline: "M8 40h5v2h7v2h8v-2h7v-2h5v5h-2v4h-4v2H12v-2H9v-4H8z",
  lining: "M10 42h3v1h7v2h8v-2h7v-2h4v4h-2v3h-5v2H13v-2h-3z",
};

const standingHems = {
  britney: {
    outline: "M8 40h5v2h7v2h8v-2h7v-3h7v-2h6v3h4v4h3v5h-4v1H35v1H12v-2H9v-4H8z",
    lining: "M10 42h3v1h7v2h8v-2h8v-3h7v-2h4v3h4v4h3v3H34v2H13v-2h-3z",
    detail: "M40 41h2v6h-2zm5-1h2v7h-2zm5 3h2v4h-2z",
  },
  goth: {
    outline: "M8 40h5v2h7v2h8v-2h7v-3h6v-2h6v2h4v4h3v3h2v3h-4v2h-6v-1h-5v2h-7v-2h-4v1H12v-2H9v-4H8z",
    lining: "M10 42h3v1h7v2h8v-2h8v-3h6v-2h4v2h4v4h3v3h1v1h-3v2h-5v-1h-6v2h-5v-2h-6v1H13v-2h-3z",
    detail: "M38 43h4v-2h3v1h4v2h-4v-1h-3v2h-4zm1 4h4v1h4v-1h4v1h-4v1h-4v-1h-4z",
  },
  egirl: {
    outline: "M8 40h5v2h7v2h8v-2h7v-3h7v-2h6v3h4v4h3v5h-5v2h-7v-1h-6v1H12v-2H9v-4H8z",
    lining: "M10 42h3v1h7v2h8v-2h8v-3h7v-2h4v3h4v4h3v3h-5v2h-6v-1h-7v1H13v-2h-3z",
    detail: "M37 47h6v1h6v-2h4v1h-3v2h-7v-1h-6zm7-7h3v1h-3zm3 2h3v1h-3z",
  },
};

const foldingHem = {
  outline: "M8 40h5v2h7v2h8v-2h7v-2h8v2h4v5h-2v3h-8v1H12v-2H9v-4H8z",
  lining: "M10 42h3v1h7v2h8v-2h8v-2h6v2h4v3h-2v3h-8v1H13v-2h-3z",
};

const foldingDetails = {
  britney: "M38 43h2v5h-2zm4 1h2v3h-2z",
  goth: "M37 43h5v1h3v1h-4v-1h-4zm0 4h5v1h-5z",
  egirl: "M35 47h6v1h3v-1h1v2h-4v-1h-6z",
};

function StageDress({ id, fit }: { id: StageId; fit: "standing" | "folding" | "compact" }) {
  const { edge, cloth, trim, light } = outfits[id];
  const { outline, lining } = fit === "standing" ? standingHems[id] : fit === "folding" ? foldingHem : compactHem;
  return <g data-stage-fit={fit}>
    <path fill={edge} d={outline} />
    <path fill={cloth} d={lining} />
    <path fill={trim} d={id === "britney" ? "M11 42h5v2h5v2h5v-2h5v-2h4v3h-4v2h-7v1h-4v-1h-6v-2h-3zm9 4h5v4h-5zm-3 3h3v2h-3zm8 0h3v2h-3z"
      : id === "goth" ? "M13 45h3v1h3v1h3v1h5v-1h3v-1h4v1h-3v1h-4v1h-6v-1h-3v-1h-3v-1h-2zm8 2h1v4h-1zm-1 1h3v1h-3z"
      : "M11 42h4v2h4v2h4v1h-4v-1h-4v-1h-3zm15 4h3v-1h3v-2h4v1h-3v2h-4v1h-3zM21 47h2v1h2v-1h2v2h-2v1h-2v-1h-2z"} />
    {fit === "standing" && <path fill={light} d={standingHems[id].detail} />}
    {fit === "folding" && <path fill={light} d={foldingDetails[id]} />}
  </g>;
}
