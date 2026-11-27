import { useReducedMotion } from "../../shared/useReducedMotion";
import { useEffect, useRef, useState } from "react";
import type { AppState } from "../../shared/schema";
import { preloadDogArt } from "./dogArt";
import { createPosePlayback, type DogPose } from "./posePlayback";

export type PoseRequest = { kind: "sit" | "stand" | "wake"; id: number } | null;

export function useDogPose(state: AppState, request: PoseRequest = null, restPaused = false) {
  const [pose, setPose] = useState<DogPose>("standing");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const playback = useRef<ReturnType<typeof createPosePlayback> | null>(null);
  const reduced = useReducedMotion(state.settings.reduceMotion);
  useEffect(() => {
    let mounted = true;
    void preloadDogArt().then(() => { if (mounted) setReady(true); }).catch((reason: unknown) => {
      if (mounted) setError(reason instanceof Error ? reason.message : "Dog artwork could not load.");
    });
    return () => { mounted = false; };
  }, []);
  useEffect(() => {
    setPose("standing");
    if (!ready || !state.pet.adopted) return;
    const controller = createPosePlayback(setPose, reduced, state.pet.mood);
    playback.current = controller;
    return () => { controller.dispose(); if (playback.current === controller) playback.current = null; };
  }, [state.pet.adopted, ready]);
  useEffect(() => {
    playback.current?.setMood(state.pet.mood);
    playback.current?.setReducedMotion(reduced);
    playback.current?.setRestPaused(restPaused);
  }, [state.pet.mood, reduced, ready, state.pet.adopted, restPaused]);
  useEffect(() => {
    if (request) playback.current?.[request.kind]();
  }, [request, ready, state.pet.adopted]);
  return { pose, ready, error };
}
