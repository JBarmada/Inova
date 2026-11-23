import { useEffect, useState } from "react";

export const motionIsReduced = (system: boolean, user: boolean) => system || user;

export function useReducedMotion(user: boolean): boolean {
  const [system, setSystem] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystem(query.matches);
    query.addEventListener("change", update);
    update();
    return () => query.removeEventListener("change", update);
  }, []);
  return motionIsReduced(system, user);
}
