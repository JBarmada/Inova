export const clothingPaths = {
  hat: "M4 17V9H7V6H16V9H19V15H23V18H2V17Z",
  glasses: "M2 9H10V17H2Z M14 9H22V17H14Z M10 11H14",
  socks: "M7 3H15V13H19V15H21V20H10V18H7Z M7 7H15",
  body: "M8 3H16L22 7L19 13L17 11V22H7V11L5 13L2 7Z",
};
const hanger = "M9 6V3H14V7L12 9V11L3 17V20H21V17L12 11";
const paths = {
  ...clothingPaths,
  all: "M3 3H9V9H3Z M15 3H21V9H15Z M3 15H9V21H3Z M15 15H21V21H15Z",
  hanger, clear: hanger, wear: hanger,
  stand: "M10 9H14 M12 9V15 M10 9L7 15 M14 9L17 15 M12 15L9 22 M12 15L15 22",
  sit: "M10 9V15H18V22 M10 10L15 13H19 M4 9V18H14 M4 18V22 M14 18V22",
  remove: "M6 6L18 18 M18 6L6 18",
  worn: "M4 12L9 17L20 6",
  locked: "M7 10V4H17V10 M4 10H20V22H4Z M12 14V18",
};
export type InterfaceIconKind = keyof typeof paths;

export function InterfaceIcon({ kind, size = 24, fillColor = "none", outlineColor = "currentColor" }: {
  kind: InterfaceIconKind; size?: number; fillColor?: string; outlineColor?: string;
}) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={outlineColor}
    strokeWidth="2" strokeLinejoin="miter" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
    {(kind === "stand" || kind === "sit") && <circle cx={kind === "stand" ? 12 : 10} cy="4" r="2" fill={outlineColor} stroke="none" />}
    <path d={paths[kind]} fill={kind === "all" ? outlineColor : fillColor} />
    {(kind === "clear" || kind === "wear") && <g strokeWidth="2">
      <rect x="16" y="1" width="8" height="9" fill="#f5eddc" stroke="none" />
      {kind === "clear" ? <path d="M18 3L23 8 M23 3L18 8" /> : <path d="M20 2V8 M17 5H23" />}
    </g>}
  </svg>;
}
