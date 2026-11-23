import { useEffect, useRef, useState } from "react";
import type { AppState } from "../../shared/schema";
import type { ClipRequest } from "./dogClips";
import type { DogPose } from "./posePlayback";

export function useCompanionClips(state: AppState, pose: DogPose, rewardPending: boolean, onRewardShown?: () => void) {
  const [clip, setClip] = useState<ClipRequest | null>(null);
  const before = useRef(state.pet);
  const napped = useRef(false);
  useEffect(() => {
    const prior = before.current;
    before.current = state.pet;
    if (pose === "sleeping") napped.current = true;
    if (pose !== "standing") {
      setClip((current) => current?.demo ? current : null);
      if (rewardPending) onRewardShown?.();
      return;
    }
    if (rewardPending) {
      onRewardShown?.();
      setClip({ clip: "14-unlock-celebration", demo: false });
      napped.current = false;
    } else if (napped.current) {
      napped.current = false;
      setClip({ clip: "08-post-nap-stretch", demo: false });
    } else if (state.pet.adopted && (!prior.adopted || (prior.mood !== "happy" && state.pet.mood === "happy"))) {
      setClip({ clip: "11a-happy-greeting", demo: false });
    }
  }, [pose, state.pet, rewardPending, onRewardShown]);
  useEffect(() => {
    if (!state.settings.devMode) setClip((current) => current?.demo ? null : current);
  }, [state.settings.devMode]);
  return { clip: clip?.demo && !state.settings.devMode ? null : clip, setClip };
}
