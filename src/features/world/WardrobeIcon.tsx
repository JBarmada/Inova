export type WardrobeIconKind = "all" | "hat" | "glasses" | "socks" | "body" | "stand" | "sit" | "clear" | "remove" | "wear" | "worn" | "locked";

export function WardrobeIcon({ kind }: { kind: WardrobeIconKind }) {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinejoin="miter" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
    {kind === "all" && <path d="M3 3H10V10H3Z M14 3H21V10H14Z M3 14H10V21H3Z M14 14H21V21H14Z" fill="currentColor" stroke="none" />}
    {kind === "hat" && <path d="M4 16V9H7V6H16V9H19V16 M2 17H23" />}
    {kind === "glasses" && <path d="M2 9H9V16H2Z M15 9H22V16H15Z M9 11H15 M0 9H2 M22 9H24" />}
    {kind === "socks" && <path d="M4 3H9V14H12V21H2V15H4Z M16 3H21V14H23V21H14V15H16Z M4 7H9 M16 7H21" />}
    {kind === "body" && <path d="M8 3L3 6L1 11L6 13L8 10V21H17V10L19 13L23 11L21 6L16 3 M8 3V5H16V3" />}
    {kind === "stand" && <path d="M10 2H14V6H10Z M10 9H14V16H10Z M6 9H10 M14 9H18 M6 9V15 M18 9V15 M10 16V22 M14 16V22" />}
    {kind === "sit" && <path d="M10 2H14V6H10Z M10 9H14V14H21V22 M14 14V17H18V22 M6 8V18H16 M6 18V22" />}
    {(kind === "clear" || kind === "wear") && <>
      <path d="M7 6V3H11V7L9 9V11L2 17V20H20V17L9 11" />
      {kind === "clear" ? <path d="M17 2L23 8 M23 2L17 8" /> : <path d="M20 2V8 M17 5H23" />}
    </>}
    {kind === "remove" && <path d="M6 6L18 18 M18 6L6 18" />}
    {kind === "worn" && <path d="M4 12L9 17L20 6" strokeWidth="3" />}
    {kind === "locked" && <path d="M7 10V4H17V10 M4 10H20V22H4Z M12 14V18" />}
  </svg>;
}
