import { useReducedMotion } from "../../shared/useReducedMotion";
import { useEffect, useState } from "react";
import { BREATH_DURATIONS, createBreathingPlayback } from "./breathingPlayback";
import { breathingArt, dogArt, preloadDogArt, shiftsBreathingAnchors } from "./dogArt";
import timings from "./clipTimings.json";

export function useBreathingArt(frame: keyof typeof dogArt, userReduced: boolean) {
  const [phase, setPhase] = useState(0);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion(userReduced);
  const durations = frame === "sleeping" ? timings["05-sleep-breathing"].durations : BREATH_DURATIONS;
  useEffect(() => {
    let active = true;
    void preloadDogArt().then(() => { if (active) setReady(true); }).catch(() => undefined);
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!ready || reduced) { setPhase(0); return; }
    return createBreathingPlayback(setPhase, durations);
  }, [ready, reduced, durations]);
  const active = ready && !reduced;
  return { src: active ? breathingArt[frame][phase] : dogArt[frame],
    peak: active && shiftsBreathingAnchors(frame) && phase === 2, phase: active ? phase : 0, reduced };
}
