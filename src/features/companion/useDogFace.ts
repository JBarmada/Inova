import { useEffect, useState } from "react";
import { dogFrame } from "./dogArt";
import type { DogMood, DogPose } from "./posePlayback";
import { createSeatedFacePlayback, type FaceFrame } from "./seatedFacePlayback";

export function useDogFace(pose: DogPose, mood: DogMood) {
  const context = `${pose}:${mood}`;
  const desired = dogFrame(mood, pose);
  const [state, setState] = useState<{ context: string; frame: FaceFrame }>({ context, frame: desired });
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (desired !== "sitting-tired") return;
    return createSeatedFacePlayback((frame) => setState({ context, frame }), reduced);
  }, [context, desired, reduced]);
  if (desired !== "sitting-tired" || reduced) return desired;
  return state.context === context ? state.frame : "sitting";
}
