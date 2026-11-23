export function PixelIcon({ kind }: { kind: "home" | "settings" }) {
  const path = kind === "home"
    ? "M7 1h2v2h2v2h2v2h2v2h-2v6H9v-5H7v5H3V9H1V7h2V5h2V3h2z"
    : "M6 0h4v3h2V2h2v2h-1v2h3v4h-3v2h1v2h-2v-1h-2v3H6v-3H4v1H2v-2h1v-2H0V6h3V4H2V2h2v1h2zM6 6v4h4V6z";
  return <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"
    fillRule="evenodd" shapeRendering="crispEdges" aria-hidden="true" focusable="false"><path d={path} /></svg>;
}
