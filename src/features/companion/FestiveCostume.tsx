type FestiveId = "christmas-present" | "maple-leaf" | "turkey";

export function FestiveCostume({ id, seated, headY, showHat }: {
  id: FestiveId; seated: boolean; headY: number; showHat: boolean;
}) {
  const low = headY >= 4;
  const compact = seated || low;
  const bodyOffset = low ? 4 - headY : seated ? -1 : 0;
  return <>
    {showHat && id === "christmas-present" && <GiftBow />}
    {showHat && id === "maple-leaf" && <g transform="translate(0 3)"><MapleCrown /></g>}
    <g transform={`translate(0 ${bodyOffset})`}>
      {id === "christmas-present" && <GiftBox compact={compact} />}
      {id === "maple-leaf" && <MapleCollar compact={compact} />}
      {id === "turkey" && <TurkeySuit compact={compact} />}
    </g>
  </>;
}

function GiftBow() {
  return <>
    <path fill="#692d38" d="M8 16v-5h2V9h2V7h5v2h3v2h3V9h3V7h5v2h3v3h2v5h-7l2 4h-4l-4-4h-3l-4 4h-4l2-4H8z" />
    <path fill="#d84c49" d="M10 15v-4h2V9h4v2h3v2h-3v-1h-4v2h5v2h-7zm14-3h3v-2h3V9h1v2h3v4h-7v-2h4v-2h-3v2h-4zm-4 1h4v3h-4z" />
    <path fill="#f69a72" d="M12 10h4v1h-4zm15 0h4v1h-4zm-6 3h2v1h-2z" />
  </>;
}

function GiftBox({ compact }: { compact: boolean }) {
  return <>
    <path fill="#6b3434" d={compact
      ? "M9 44h29v3h-2v5H12v-5H9z"
      : "M9 44h26v-2h13v-2h5v6h-3v5h-9v1H13v-5H9z"} />
    <path fill="#bb3d3d" d={compact ? "M13 47h22v4H13z" : "M14 47h22v-1h13v4h-9v1H14z"} />
    <path fill="#e96550" d={compact ? "M10 45h27v2H10z" : "M10 45h26v-2h12v-2h4v4h-5v1H34v1H10z"} />
    <path fill="#f5c455" d={compact ? "M21 45h4v6h-4z" : "M21 45h4v6h-4zm21-3h3v8h-3z"} />
    <path fill="#ffe392" d="M22 45h1v6h-1z" />
  </>;
}

function MapleCrown() {
  return <>
    <path fill="#78343b" d="M1 21v-5h4v2h4V8h4v2h4V7h2V4h2V2h3v3h2v3h2v3h3V8h4v9h4v-2h4v4h2v4h-8v-2h-7v-2h-9v1h-8v2H5v-1z" />
    <path fill="#c84b49" d="M2 19v-2h3v2h5V9h2v2h6V8h2V5h2V3h1v3h2v3h2v3h5v-2h2v8h5v-2h3v4h-5v-1h-6v-2H20v2h-7v2H5v-2z" />
    <path fill="#ed775b" d="M21 7h1v8h-4v2h-4v-1h4v-2h3zm5 6h3v1h3v2h-3v-1h-3z" />
  </>;
}

function MapleCollar({ compact }: { compact: boolean }) {
  return <>
    <path fill="#78343b" d={compact
      ? "M8 41h5v2h7v1h7v-1h8v-2h5v4h-2v4h-7v2H20v-1H13v-2H9v-4H8z"
      : "M8 41h6v2h7v1h8v-1h5v-3h5v-2h8v3h4v4h2v4h-6v2h-8v-1h-9v2H20v-2h-8v-2H8z"} />
    <path fill="#cb4846" d={compact
      ? "M10 43h3v1h7v1h7v-1h8v-2h4v3h-2v3h-7v2h-9v-1h-7v-2h-3z"
      : "M10 43h4v1h7v1h8v-1h6v-3h5v-2h6v3h4v4h2v2h-6v2h-7v-1h-9v2h-9v-2h-8v-2h-3z"} />
    <path fill="#fff1d8" d="M23 45h1v2h2v-1h1v2h-2v1h-1v1h-1v-1h-1v-1h-2v-2h1v1h2z" />
  </>;
}

function TurkeySuit({ compact }: { compact: boolean }) {
  return <>
    <g transform={compact ? "translate(8 16) scale(.7 .65)" : undefined}>
      <path fill="#754d37" d="M43 25v-4h-2v-4h-2v-3h2v-2h3v2h3v2h-2v4h2v4zm11 6v-5h2v-4h1v-3h2v-2h3v2h2v3h-3v2h-2v4h-2v3z" />
      <path fill="#fff0d7" d="M43 19v-3h-2v-2h2v1h3v1h-2v4zm14 5h1v-4h2v-2h1v2h2v1h-3v2h-2v3h-1z" />
      <path fill="#7d462f" d="M37 44v-8h-2v-6h1v-4h4v-4h5v-2h6v3h4v4h3v5h2v9h-4v4h-5v2h-9v-3z" />
      <path fill="#c57a3a" d="M38 39v-4h-2v-5h2v-3h3v-4h5v-2h4v3h4v4h3v5h2v7h-4v4h-5v2h-8v-3h-3v-4z" />
      <path fill="#eaa355" d="M41 38v-7h-2v-3h3v4h2v6zm5-2v-8h-1v-4h3v5h1v7zm5 0v-4h2v-6h2v7h-2v3z" />
    </g>
    <path fill="#78462d" d={compact
      ? "M9 42h6v2h12v-1h7v-2h6v3h-2v5h-5v2H18v-1h-6v-2H9z"
      : "M9 42h6v2h12v-1h7v-3h5v-2h6v2h6v3h3v5h-3v2h-8v-1h-7v2h-7v1H18v-2h-6v-2H9z"} />
    <path fill="#ba7136" d={compact
      ? "M10 43h5v2h12v-1h7v-2h5v2h-2v4h-5v2H18v-1h-5v-2h-3z"
      : "M10 43h5v2h12v-1h8v-3h5v-2h4v2h6v3h3v3h-3v2h-7v-1h-7v2h-8v1h-9v-2h-6v-2h-3z"} />
    <path fill="#728347" d="M12 48h5v1h5v1h-6v-1h-4zm16 1h5v-1h4v1h-4v1h-5z" />
  </>;
}
