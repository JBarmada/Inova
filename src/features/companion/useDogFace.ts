import { useReducedMotion } from "../../shared/useReducedMotion";
import { useEffect, useState } from "react";
import { dogFrame } from "./dogArt";
import type { DogMood, DogPose } from "./posePlayback";
import { createSeatedFacePlayback, type FaceFrame } from "./seatedFacePlayback";

export function useDogFace(pose: DogPose, mood: DogMood, userReduced: boolean) {
  const context = `${pose}:${mood}`;
  const desired = dogFrame(mood, pose);
  const [state, setState] = useState<{ context: string; frame: FaceFrame }>({ context, frame: desired });
  const reduced = useReducedMotion(userReduced);
  useEffect(() => {
    if (desired !== "sitting-tired") return;
    return createSeatedFacePlayback((frame) => setState({ context, frame }), reduced);
  }, [context, desired, reduced]);
  if (desired !== "sitting-tired" || reduced) return desired;
  return state.context === context ? state.frame : "sitting";
}
