import { useEffect, useState } from "react";
import { createBreathingPlayback } from "./breathingPlayback";
import { breathingArt, dogArt, preloadDogArt, shiftsBreathingAnchors } from "./dogArt";

export function useBreathingArt(frame: keyof typeof dogArt) {
  const [phase, setPhase] = useState(0);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    update();
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    let active = true;
    void preloadDogArt().then(() => { if (active) setReady(true); }).catch(() => undefined);
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!ready || reduced) { setPhase(0); return; }
    return createBreathingPlayback(setPhase);
  }, [ready, reduced]);
  const active = ready && !reduced;
  return { src: active ? breathingArt[frame][phase] : dogArt[frame],
    peak: active && shiftsBreathingAnchors(frame) && phase === 2 };
}
