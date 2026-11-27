type CreatureId = "pikachu" | "shrek" | "mort";

const colors = {
  pikachu: { edge: "#624138", fill: "#f6cb42", light: "#ffe87d", shade: "#be792b" },
  shrek: { edge: "#4f542c", fill: "#a4ad48", light: "#c9d477", shade: "#737941" },
  mort: { edge: "#594039", fill: "#bb8f70", light: "#ebc3a4", shade: "#85554b" },
};

export function CreatureHood({ id, seated, headY }: {
  id: CreatureId; seated: boolean; headY: number;
}) {
  const low = headY >= 4;
  const { edge, fill, light, shade } = colors[id];
  return <>
    {id === "pikachu" && <ElectricEars />}
    {id === "shrek" && <OgreEars />}
    {id === "mort" && <RoundEars />}
    <path fill={edge} fillRule="evenodd" d={low
      ? "M8 20h5v-2h16v2h6v4h3v12h-3v4h-6v3H13v-2H7v-3H4V26h4zm1 6v10h3v3h17v-2h5V26h-3v-3h-5v-1H15v2h-4v2z"
      : "M8 20h4v-3h5v-1h9v1h7v3h4v4h2v13h-3v5h-6v2H12v-2H7v-4H4V26h2v-4h2zm0 8v8h3v4h6v1h10v-1h6v-4h2V26h-2v-4h-5v-2H17v1h-4v2h-3v5z"} />
    <path fill={fill} d={low
      ? "M9 21h5v-2h14v2h6v4h3v10h-2V25h-3v-3h-5v-1H14v2h-4v2H8v12H6V27h3zm2 19h5v1h12v-1h6v-2h1v1h-1v2h-5v1H13v-1h-2z"
      : "M9 21h4v-3h5v-1h7v1h7v3h4v4h2v11h-2V25h-2v-4h-5v-2H16v1h-4v2H9v5H7v10H5V27h2v-4h2zm1 19h4v2h13v-1h6v-2h2v2h-5v2H13v-1h-3z"} />
    <path fill={light} d="M11 20h4v-2h8v1h-7v1h-4v2h-3v-1h2z" />
    {id === "pikachu" && <path fill="#da7056" d="M9 34h3v2H9zm23 0h3v2h-3z" />}
    {id === "mort" && <path fill="#ead1ad" d="M13 16h2v-3h6v2h3v-2h6v3h2v4h-3v-2h-5v1h-5v-1h-4v2h-2z" />}
    {id === "mort" && <path fill="#695043" d="M16 15h3v2h-3zm11 0h3v2h-3z" />}
    <CreatureBody id={id} seated={seated} headY={headY} />
    {id !== "shrek" && <path fill={shade} d="M15 42h14v1H15z" />}
  </>;
}

function ElectricEars() {
  return <>
    <path fill="#593d32" d="M10 21V15H8v-4H6V8H4V4h5v2h3v3h2v4h2v6h-3v2zm17-2v-6h2v-4h2V6h2V4h5v4h-2v4h-2v4h-2v5z" />
    <path fill="#f4ca40" d="M11 18v-4H9v-3H7V7h3v3h3v4h1v5zm18 0v-4h1v-4h3V7h3v4h-2v4h-2v4z" />
    <path fill="#3b302e" d="M5 5h4v2h2v3H8V8H5zm30 0h2v3h-2v3h-3V8h1V6h2z" />
  </>;
}

function OgreEars() {
  return <>
    <path fill="#54582c" d="M7 22v-5H4v-2H1v-4h2V9h5v2h2v4h2v4h-2v3zm27-1v-5h2v-4h2V9h5v2h2v4h-2v2h-4v4z" />
    <path fill="#b8c35c" d="M3 12h4v1h2v4h1v3H8v-4H5v-1H3zm34 3h2v-3h4v3h-3v1h-2v4h-2v-3h1z" />
    <path fill="#7e8841" d="M4 12h3v2H4zm36 0h2v2h-2z" />
  </>;
}

function RoundEars() {
  return <>
    <path fill="#65483e" d="M4 22v-3H2v-6h2v-3h3V8h7v1h3v3h2v6h-3v2h-4v2zm23-3v-7h2V9h3V8h7v2h3v3h2v6h-2v3h-8v-2h-5v-1z" />
    <path fill="#e8b9a5" d="M5 19v-3H4v-3h3v-2h7v1h2v5h-2v2H5zm24-2v-4h2v-2h8v2h2v4h-2v3h-5v-2h-3v-1z" />
    <path fill="#b97f77" d="M7 15h2v-2h5v4h-2v1H7zm25-2h5v2h2v3h-5v-1h-2z" />
  </>;
}

function CreatureBody({ id, seated, headY }: {
  id: CreatureId; seated: boolean; headY: number;
}) {
  const palette = id === "shrek"
    ? { edge: "#5e4334", fill: "#a47b50", light: "#eac391", shade: "#805b42" }
    : colors[id];
  const low = headY >= 4;
  const half = low || seated;
  // Lowered frames share one ground line even as the head dips in sleep.
  const lift = low ? Math.max(3, headY - 4) : 0;
  return <g transform={lift ? `translate(0 ${-lift})` : undefined}>
    <path fill={palette.edge} d={half
      ? "M8 41h8v2h11v-1h6v-2h5v4h-2v4h-7v2h-8v-2H11v-1H8z"
      : "M9 42h10v2h10v-2h5v-4h4v-2h7v3h4v5h2v5h-6v-2h-7v1h-9v2h-8v-2H12v-2H9z"} />
    <path fill={palette.fill} d={half
      ? "M10 42h6v2h11v-1h7v-2h3v3h-2v3h-6v2h-8v-2H12v-1h-2z"
      : "M10 43h9v2h10v-2h6v-4h4v-2h5v3h4v5h2v3h-5v-2h-7v1h-9v2h-8v-2h-8v-2h-3z"} />
    {id === "pikachu" && !half && <path fill={palette.shade} d="M35 40h3v-2h2v2h-2v3h-3zm8 1h3v1h1v3h-3v-2h-1z" />}
    {id === "shrek" && <path fill="#f1dcab" d="M17 44h5v1h5v-1h3v2h-3v2h-5v-1h-5z" />}
    {id === "mort" && <path fill={palette.light} d="M17 44h4v1h7v-1h3v2h-3v2h-7v-1h-4z" />}
  </g>;
}
