const legacyIds = ["notebook", "bandana", "cap", "beanie", "round-glasses", "star-glasses", "mint-socks", "gold-socks", "raincoat", "hoodie"] as const;
export const isLegacyWearable = (id: string): id is typeof legacyIds[number] => legacyIds.some((item) => item === id);

// Original pixel-style item drawings, kept separate from the dog and navigation icons.
export function LegacyWearable({ id, color }: { id: string; color: string }) {
  const dark = "#513729", light = "#fff0ca";
  switch (id) {
    case "cap": return <TrailCap color={color} />;
    case "beanie": return <CozyBeanie color={color} />;
    case "round-glasses": return <g fill="none" stroke={dark} strokeWidth="2"><path d="M2 8H4V6H9V8H11V15H9V17H4V15H2ZM13 8H15V6H20V8H22V15H20V17H15V15H13ZM11 10H13"/><path d="M0 9H2M22 9H24" strokeWidth="1"/></g>;
    case "star-glasses": return <StarGlasses />;
    case "mint-socks": case "gold-socks": return <g>
      <path fill={dark} d="M5 2h11v2h2v12h3v2h2v3h-2v2H8v-2H5z" />
      <path fill={color} d="M6 4h11v13h3v2h1v2H8v-2H6z" />
      <path fill={light} d="M6 5h11v3H6zm0 5h11v1H6z" />
      <path fill={sockHeel(id)} d="M8 16h4v3h6v-2h2v3h1v1H8z" />
    </g>;
    case "notebook": return <g stroke={dark} strokeWidth="1"><path d="M7 4H17V21H7Z" fill="#7f9b60"/><path d="M9 6H15V19H9Z" fill={light}/><path d="M5 6H8M5 10H8M5 14H8M5 18H8M10 9H14M10 12H14M10 15H14" fill="none"/></g>;
    case "bandana": return <g stroke={dark} strokeWidth="1"><path d="M1 6H23V11H1Z" fill="#c77356"/><path d="M4 10H20L12 22Z" fill="#c77356"/><path d="M7 12H17L12 19Z" fill="#eeaa80"/><path d="M20 7L23 4V8L24 11L21 10Z" fill="#b65c49"/></g>;
    case "raincoat": return <OuterwearTile rain />;
    case "hoodie": return <OuterwearTile />;
    default: return null;
  }
}

function StarGlasses() {
  const star = "M6 5h2v2h1v1h4v2h-1v1h-1v2h1v4h-2v-1H8v-1H6v1H4v1H2v-4h1v-2H2v-1H1V8h4V7h1zM6 8h2v1h2v4H4V9h2zM5 13h4v1H5z";
  const highlight = "M6 6h1v2H6zm-4 3h2v1H2zm8 0h2v1h-2z";
  return <>
    <path fill="#835337" d="M11 9h3v1h-3z" />
    {[0, 11].map((offset) => <g key={offset} transform={`translate(${offset} 0)`}>
      <path fill="#835337" fillRule="evenodd" d={star} />
      <path fill="#f6db80" d={highlight} />
    </g>)}
  </>;
}

function OuterwearTile({ rain = false }: { rain?: boolean }) {
  const dark = rain ? "#845827" : "#57436d";
  const fabric = rain ? "#efb744" : "#a598c4";
  const trim = rain ? "#ffdb72" : "#cbbade";
  return <>
    <path fill={dark} d="M7 8V5h2V3h6v1h2v2h1v2h2v2h2v4h1v4h-5v3H6v-3H1v-4h1v-4h2V8z" />
    <path fill={fabric} d="M8 8V5h2V4h5v1h2v4h3v2h1v4h1v2h-4v-2h-1v5H7v-5H6v2H2v-2h1v-4h2V9h2z" />
    <path fill={trim} d="M9 5h6v1h2v3h-2v1H9V9H7V8h1V7h1z" />
    <path fill={dark} d="M10 6h5v1h1v1h-2v1h-4V8H9V7h1z" />
    {rain
      ? <path fill={dark} d="M11 11h1v8h-1zm3 1h1v1h-1zm0 3h1v1h-1zm-6 1h2v2H8zm6 1h2v1h-2z" />
      : <path fill={trim} d="M9 11h1v4H9zm5 0h1v4h-1zm-5 5h6v1h1v2H8v-2h1z" />}
  </>;
}

function TrailCap({ color }: { color: string }) {
  return <>
    <path fill="#37483e" d="M2 16h2v-5h2V8h2V6h3V4h6v1h3v3h2v4h1v5h-5v2H8v1H1v-3h1z" />
    <path fill={color} d="M5 15v-4h2V8h2V7h3V5h4v1h3v3h2v4h1v3h-5v1H8v1H3v-2h2z" />
    <path fill="#9bc3a1" d="M8 9h3V7h4v1h-3v2H8zm-2 5h8v1h3v1H9v1H4v-1h2z" />
    <path fill="#497668" d="M5 15h4v-2h10v1h3v2h-5v1h-6v1H3v-1h2z" />
    <path fill="#efda94" d="M14 8h3v1h2v3h-5z" /><path fill="#62845e" d="M15 11h1V9h1v2h1v1h-3z" />
  </>;
}

function CozyBeanie({ color }: { color: string }) {
  return <>
    <path fill="#544357" d="M3 19v-4h2v-4h2V8h3V6h2V3h2V2h3v1h2v3h-2v1h2v2h2v4h2v7h-4v1H7v-1H3z" />
    <path fill={color} d="M5 16h2v-5h2V9h2V7h6v1h2v3h1v3h2v4h-4v2H8v-1H5z" />
    <path fill="#ebc5be" d="M13 4h1V3h3v1h1v2h-5zm-6 13h4v-1h8v1h3v2h-4v1H8v-1H5v-2z" />
    <path fill="#886b8d" d="M9 11h1v4H9zm3-2h1v5h-1zm4-1h1v6h-1zm3 4h1v3h-1zM9 18h2v1H9zm5 0h2v1h-2zm5 0h2v1h-2z" />
  </>;
}

function sockHeel(id: string) {
  return id === "gold-socks" ? "#9d6d28" : "#427866";
}

export function LegacyPawSock({ id, color }: { id: string; color: string }) {
  return <>
    <path fill="#513729" d="M0 1h1V0h4v1h1v4H5v1H1V5H0z" />
    <path fill={color} d="M1 1h4v4H1z" />
    <path fill="#fff0ca" d="M1 1h4v1H1z" />
    <path fill={sockHeel(id)} d="M1 4h4v1H1z" />
  </>;
}
