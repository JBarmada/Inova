import { useEffect, useState } from "react";
import { createBreathingPlayback } from "./breathingPlayback";
import { breathingArt, dogArt, preloadDogArt } from "./dogArt";

export function useBreathingArt(frame: keyof typeof dogArt) {
  const family = frame.startsWith("sitting") ? "sitting" : frame === "tucking" ? "transition" : "standing";
  const [state, setState] = useState({ family, phase: 0 });
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
  const sources = breathingArt[frame];
  const enabled = Boolean(sources);
  useEffect(() => {
    setState({ family, phase: 0 });
    if (!ready || reduced || !enabled) return;
    return createBreathingPlayback((phase) => setState({ family, phase }));
  }, [family, enabled, ready, reduced]);
  const phase = !reduced && state.family === family ? state.phase : 0;
  return { src: ready && sources ? sources[phase] : dogArt[frame], peak: Boolean(sources) && phase === 2 };
}
