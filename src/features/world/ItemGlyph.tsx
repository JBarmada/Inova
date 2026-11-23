import type { WearableSlot } from "../../shared/equipment";

export function ItemGlyph({ slot, color = "#9d8a68" }: { slot: WearableSlot; color?: string }) {
  return <svg viewBox="0 0 24 24" fill={color} stroke="#4b2d22" strokeWidth="1.5" shapeRendering="crispEdges" aria-hidden="true">
    {slot === "hat" && <path d="M4 17V9H7V6H16V9H19V15H23V18H2V17Z" />}
    {slot === "glasses" && <><path d="M1 9H10V17H2Z M14 9H23L22 17H14Z" fill="none" /><path d="M10 11H14" fill="none" /></>}
    {slot === "socks" && <path d="M3 3H9V13H12V20H2V15H3Z M15 3H21V13H23V20H14V15H15Z" />}
    {slot === "body" && <path d="M8 3H16L22 7L19 13L17 11V22H7V11L5 13L2 7Z" />}
  </svg>;
}
