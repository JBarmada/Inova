import { useReducedMotion } from "../../shared/useReducedMotion";
import { useEffect, useRef, useState } from "react";

export type ToyPhase = "closed" | "opening" | "open" | "closing";

export function useToyExpansion(userReduced: boolean) {
  const [phase, setPhase] = useState<ToyPhase>("closed");
  const reduced = useReducedMotion(userReduced);
  const restoreFocus = useRef(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const open = phase === "opening" || phase === "open";
  useEffect(() => {
    if (phase === "opening") panel.current?.focus({ preventScroll: true });
    if (phase === "closed" && restoreFocus.current) {
      button.current?.focus({ preventScroll: true });
      restoreFocus.current = false;
    }
    if (phase !== "opening" && phase !== "closing") return;
    const timer = setTimeout(() => setPhase(phase === "opening" ? "open" : "closed"), reduced ? 0 : phase === "opening" ? 440 : 340);
    return () => clearTimeout(timer);
  }, [phase, reduced]);
  function expand() { restoreFocus.current = false; setPhase(reduced ? "open" : "opening"); }
  function collapse(returnFocus = false) {
    restoreFocus.current = returnFocus;
    setPhase(reduced ? "closed" : "closing");
  }
  useEffect(() => {
    if (reduced && phase === "open") panel.current?.focus({ preventScroll: true });
  }, [reduced, phase]);
  return { phase, open, mounted: phase !== "closed", button, panel, expand, collapse };
}
