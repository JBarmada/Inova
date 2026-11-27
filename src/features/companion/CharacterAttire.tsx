type CharacterId = "farquaad" | "harry-potter";

const collars = {
  farquaad: { outline: "#602831", cloth: "#ae3b37", trim: "#f1bc52" },
  "harry-potter": { outline: "#372a38", cloth: "#604050", trim: "#e7ae49" },
};

export function CharacterAttire({ id, seated, headY, showGlasses }: {
  id: CharacterId; seated: boolean; headY: number; showGlasses: boolean;
}) {
  return <>
    {id === "farquaad" && <RoyalCap />}
    {id === "harry-potter" && <WizardFace resting={headY >= 4} showGlasses={showGlasses} />}
    <CharacterCollar id={id} seated={seated} headY={headY} />
  </>;
}

function RoyalCap() {
  return <>
    <path fill="#31252d" d="M3 35v-9h2v-5h3v-5h5v-2h17v2h6v3h3v5h2v12h-5v-9h-2v-5h-3v-3h-5v2H14v-1h-3v3H9v4H7v10H3z" />
    <path fill="#54404b" d="M4 33v-7h2v-4h2v6H6v5zm30-12h3v4h2v8h-2v-7h-2z" />
    <path fill="#66242d" d="M4 18V13h3v-3h5V8h23v2h5v3h3v5h-3v1h-6v-2H13v2H7v-1z" />
    <path fill="#b83b3f" d="M6 16v-3h3v-2h5V9h19v2h6v2h3v3h-7v-2H13v2z" />
    <path fill="#efad50" d="M10 17h5v-2h18v1h5v1h-5v-1H15v2h-5z" />
    <path fill="#713c2d" d="M15 6h3v1h2V2h4v5h3V5h4v7H15z" />
    <path fill="#f0bb48" d="M16 7h2v2h3V3h2v6h5V6h2v5H16z" />
    <path fill="#fff09b" d="M21 4h1v6h-4V9h3z" />
  </>;
}

function WizardFace({ resting, showGlasses }: { resting: boolean; showGlasses: boolean }) {
  const y = resting ? -1 : 0;
  return <g transform={`translate(0 ${y})`}>
    {showGlasses && <path data-costume-glasses="wizard" fill="#4d3227" fillRule="evenodd" d="M6 25h2v-2h8v1h2v3h4v-3h2v-1h8v2h2v2h4v2h-4v2h-2v2h-8v-1h-2v-3h-4v3h-2v1H8v-2H6v-2H4v-2h2zm2 1v4h2v1h5v-1h1v-4h-2v-1h-4v1zm16 0v4h2v1h4v-1h2v-4h-2v-1h-4v1z" />}
    {!resting && <path fill="#b35d3e" d="M22 18h3v1h-2v1h1v1h-2v1h-1v-2h1z" />}
  </g>;
}

function CharacterCollar({ id, seated, headY }: {
  id: CharacterId; seated: boolean; headY: number;
}) {
  const { outline, cloth, trim } = collars[id];
  const resting = headY >= 4;
  const collar = resting
    ? "M12 39h4v2h4v1h8v-1h5v-2h3v4h-3v2h-6v1h-9v-1h-5v-2h-2z"
    : "M9 40h4v2h5v2h9v-1h5v-2h4v-1h3v5h-3v2h-6v1h-3v4h-6v-4h-5v-1h-4v-2H9z";
  return <g transform={`translate(0 ${seated ? 1 : 0})`}>
    {id === "farquaad" && !resting && !seated && <g>
      <path fill={outline} d="M32 43h6v-3h6v2h4v3h3v4h2v5h-6v-2h-7v-2h-8z" />
      <path fill={cloth} d="M35 44h4v-3h5v2h3v3h3v6h-3v-2h-7v-2h-5z" />
      <path fill={trim} d="M42 42h2v1h3v3h2v3h-1v-2h-2v-3h-4z" />
    </g>}
    <path fill={outline} d={collar} />
    <path fill={cloth} d={resting
      ? "M13 41h3v1h4v1h9v-1h4v-1h2v2h-3v1h-6v1h-7v-1h-5v-1h-1z"
      : "M11 42h3v1h4v2h9v-1h5v-2h4v2h-2v2h-6v1h-3v4h-3v-4h-5v-1h-4v-2h-2z"} />
    {!resting && <path fill={trim} d="M21 46h5v2h-2v2h-2v-3h-1z" />}
  </g>;
}
