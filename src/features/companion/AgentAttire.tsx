type AgentId = "iso" | "omen" | "killjoy";

const jackets = {
  iso: { edge: "#332c49", cloth: "#645496", light: "#a68be6", trim: "#eee5f8" },
  omen: { edge: "#2d283c", cloth: "#4b3e64", light: "#7757a4", trim: "#a789d9" },
  killjoy: { edge: "#655037", cloth: "#eeb84e", light: "#ffe17b", trim: "#8c61a5" },
};

export function AgentAttire({ id, seated, headY, showGlasses, showHat }: {
  id: AgentId; seated: boolean; headY: number; showGlasses: boolean; showHat: boolean;
}) {
  const resting = headY >= 4;
  return <>
    {id === "omen" && showHat && <ShadowHood />}
    {id === "killjoy" && showHat && <InventorBeanie />}
    {id === "killjoy" && showGlasses && <InventorGlasses resting={resting} />}
    <AgentJacket id={id} seated={seated} resting={resting} headY={headY} />
  </>;
}

function InventorGlasses({ resting }: { resting: boolean }) {
  return <path data-costume-glasses="inventor" fill="#563b39" fillRule="evenodd"
    transform={resting ? "translate(0 -1)" : undefined}
    d="M7 26h2v-2h9v1h2v2h2v-2h2v-1h9v2h2v5h-2v2h-9v-1h-2v-3h-2v3h-2v1H9v-2H7zm2 1v3h2v1h6v-1h1v-3h-1v-1h-6v1zm15 0v3h1v1h6v-1h2v-3h-2v-1h-6v1z" />;
}

function ShadowHood() {
  return <>
    <path fill="#31283e" fillRule="evenodd" d="M1 33v-6h2v-6h3v-5h3v-4h4V8h5V5h5v2h5v3h5v5h4v5h3v6h2v10h-3v4h-5v3H12v-2H7v-3H3v-5zm7-3v5h3v3h6v2h11v-1h6v-3h3v-7h-2v-5h-5v-2h-5v-1H15v2h-4v3H8z" />
    <path fill="#68508c" d="M3 29h2v-6h2v-5h4v-5h4V9h5V6h3v3h5v3h4v5h4v5h3v6h2v7h-2v-6h-2v-5h-2v-3h-2v-5h-4v-3h-4v-2h-6v2h-5v3h-4v5H7v4H5v7H3zm3 7h4v3h5v2h17v-1h4v-3h2v3h-4v2H12v-1H7v-3H6z" />
    <path fill="#9a79bd" d="M9 17h2v-4h4V9h4v2h-3v4h-4v4H9z" />
    <path fill="#78d9ec" d="M16 17h1v3h-1zm4-3h2v6h-2zm5 3h1v3h-1z" />
  </>;
}

function InventorBeanie() {
  return <>
    <path fill="#30463d" d="M6 22v-6h2v-4h3V8h5V5h12v2h6v4h4v5h2v6h-7v-1H18v1h-5v1H8v-1z" />
    <path fill="#578d68" d="M8 19v-3h2v-4h3V9h4V6h10v2h6v4h4v5h2v3h-6v-1H18v1h-5v1H8z" />
    <path fill="#78ab77" d="M13 12h3V9h5V7h2v3h-5v3h-3v4h-2zm17-3h3v3h3v4h-2v-3h-4z" />
    <path fill="#3d7055" d="M9 18h7v-1h16v1h6v2h-6v-1H17v1h-8z" />
    <path fill="#eec966" d="M24 13h7v5h-7z" />
    <path fill="#62557c" d="M25 14h1v1h1v1h1v-2h1v3h-4z" />
  </>;
}

function AgentJacket({ id, seated, resting, headY }: {
  id: AgentId; seated: boolean; resting: boolean; headY: number;
}) {
  const { edge, cloth, light, trim } = jackets[id];
  const short = seated || resting;
  const drop = resting ? -Math.max(3, headY - 4) : seated ? 1 : 0;
  return <g transform={drop ? `translate(0 ${drop})` : undefined}>
    <path fill={edge} d={short
      ? "M8 41h7v2h6v1h6v-1h7v-3h4v3h2v6h-5v1h-7v-1h-7v1h-8v-2H9v-3H8z"
      : "M8 40h5v2h6v2h9v-1h5v-3h5v-3h6v2h5v5h3v6h-8v-1h-7v1h-8v-1h-6v1H13v-2H9v-3H8z"} />
    <path fill={cloth} d={short
      ? "M9 42h6v2h6v1h6v-1h8v-3h2v3h2v4h-5v1h-5v-1h-9v1h-6v-2h-4v-3H9z"
      : "M9 41h4v2h6v2h9v-1h6v-3h5v-3h4v2h5v5h3v4h-7v-1h-7v1h-8v-1h-7v1h-8v-2h-4v-3H9z"} />
    <path fill={light} d="M10 42h3v1h6v2h5v1h-7v-2h-5v-1h-2zm17 3h5v-2h5v-2h1v3h-4v2h-7z" />
    {id === "iso" && <path fill={trim} d="M21 45h3v4h-3zm10 1h5v1h-3v2h-2z" />}
    {id === "iso" && !short && <path fill={light} d="M39 46h2v-2h2v-2h2v2h2v2h2v2h-3v-2h-2v-1h-1v1h-2v2h-2z" />}
    {id === "omen" && <path fill={trim} d="M14 43h3v1h5v1h6v1h3v1h-7v-1h-5v-1h-5z" />}
    {id === "killjoy" && <path fill={trim} d="M19 45h2v1h2v-1h2v1h-1v1h1v2h-2v-1h-2v1h-2v-2h1v-1h-1z" />}
  </g>;
}
