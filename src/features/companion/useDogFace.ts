import { useReducedMotion } from "../../shared/useReducedMotion";
import { useEffect, useRef, useState } from "react";
import { dogFrame } from "./dogArt";
import type { DogMood, DogPose } from "./posePlayback";
import { createSeatedFacePlayback, type FaceFrame } from "./seatedFacePlayback";

export function useDogFace(pose: DogPose, mood: DogMood, userReduced: boolean) {
  const context = `${pose}:${mood}`;
  const desired = dogFrame(mood, pose);
  const previous = useRef(desired);
  const [state, setState] = useState<{ context: string; frame: FaceFrame }>({ context, frame: desired });
  const reduced = useReducedMotion(userReduced);
  useEffect(() => {
    const show = (frame: FaceFrame) => setState({ context, frame });
    const prior = previous.current;
    previous.current = desired;
    if (desired === "sitting-tired") return createSeatedFacePlayback(show, reduced);
    if (!reduced && prior === "sitting-tired" && (desired === "sitting" || desired === "sitting-happy")) {
      show("sitting-drowsy");
      const blink = setTimeout(() => show("sitting-blink"), 140);
      const settle = setTimeout(() => show(desired), 240);
      return () => { clearTimeout(blink); clearTimeout(settle); };
    }
    if (reduced || (desired !== "standing" && desired !== "sitting")) return;
    show(desired);
    let restore: ReturnType<typeof setTimeout>;
    const blink = setInterval(() => {
      show(desired === "standing" ? "standing-blink" : "sitting-blink");
      restore = setTimeout(() => show(desired), 100);
    }, 4_400);
    return () => { clearInterval(blink); clearTimeout(restore); };
  }, [context, desired, reduced]);
  if (reduced) return desired;
  return state.context === context ? state.frame : desired === "sitting-tired" ? "sitting" : desired;
}
