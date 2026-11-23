import { useEffect, useState } from "react";
import type { AppState } from "../../shared/schema";
import { preloadDogArt } from "./dogArt";
import { createPosePlayback, type DogPose } from "./posePlayback";

export type PoseRequest = { kind: "sit" | "stand"; id: number } | null;

export function useDogPose(state: AppState, request: PoseRequest = null) {
  const [pose, setPose] = useState<DogPose>("standing");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    update();
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    let mounted = true;
    void preloadDogArt().then(() => { if (mounted) setReady(true); }).catch((reason: unknown) => {
      if (mounted) setError(reason instanceof Error ? reason.message : "Dog artwork could not load.");
    });
    return () => { mounted = false; };
  }, []);
  useEffect(() => {
    setPose("standing");
    if (!ready || !state.pet.adopted || state.pet.mood !== "idle") return;
    const playback = createPosePlayback(setPose, reduced);
    if (request?.kind === "sit") playback.sit();
    return playback.dispose;
  }, [state.pet.adopted, state.pet.mood, ready, reduced, request]);
  return { pose, ready, error };
}
