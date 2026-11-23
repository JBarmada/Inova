import type { AppState } from "../../shared/schema";
import type { DogPose } from "./posePlayback";
import { isFittedFrame, isLoafFrame } from "./poseFrames";

export const dogArt = {
  standing: "/dog/neutral.png", tucking: "/dog/tuck.png", sitting: "/dog/sitting.png",
  happy: "/dog/happy.png", tired: "/dog/tired.png",
  "sitting-blink": "/dog/sitting-blink.png", "sitting-drowsy": "/dog/sitting-drowsy.png",
  "sitting-tired": "/dog/sitting-tired.png", "sitting-happy": "/dog/sitting-happy.png",
  "sit-02": "/dog/fitted/sit-02.png", "sit-03": "/dog/fitted/sit-03.png",
  "sit-04": "/dog/fitted/sit-04.png", "sit-05": "/dog/fitted/sit-05.png",
  "sit-06": "/dog/fitted/sit-06.png", "sit-07": "/dog/fitted/sit-07.png",
  "loaf-bend": "/dog/loaf-bend.png", "loaf-tuck": "/dog/loaf-tuck.png",
  "loaf-idle": "/dog/loaf-idle.png", "loaf-happy": "/dog/loaf-happy.png", "loaf-tired": "/dog/loaf-tired.png",
  sleeping: "/dog/sleeping.png", "sleep-drowsy": "/dog/sleep-drowsy.png", "sleep-doze": "/dog/sleep-doze.png",
  "wake-ear": "/dog/wake-ear.png", "wake-eyes": "/dog/wake-eyes.png", "standing-blink": "/dog/standing-blink.png",
};

const breaths = (name: string) => Array.from({ length: 4 }, (_, phase) => `/dog/breathing/${name}-${phase}.png`);
export const breathingArt: Record<keyof typeof dogArt, string[]> = {
  standing: breaths("neutral"), happy: breaths("happy"), sitting: breaths("sitting"),
  "sitting-blink": breaths("sitting-blink"), "sitting-drowsy": breaths("sitting-drowsy"),
  "sitting-tired": breaths("sitting-tired"), "sitting-happy": breaths("sitting-happy"),
  "sit-02": breaths("fitted/sit-02"), "sit-03": breaths("fitted/sit-03"),
  "sit-04": breaths("fitted/sit-04"), "sit-05": breaths("fitted/sit-05"),
  "sit-06": breaths("fitted/sit-06"), "sit-07": breaths("fitted/sit-07"),
  tired: breaths("tired"), tucking: breaths("tuck"),
  "loaf-bend": breaths("loaf-bend"), "loaf-tuck": breaths("loaf-tuck"),
  "loaf-idle": breaths("loaf-idle"), "loaf-happy": breaths("loaf-happy"), "loaf-tired": breaths("loaf-tired"),
  sleeping: breaths("sleeping"), "sleep-drowsy": breaths("sleep-drowsy"), "sleep-doze": breaths("sleep-doze"),
  "wake-ear": breaths("wake-ear"), "wake-eyes": breaths("wake-eyes"), "standing-blink": breaths("standing-blink"),
};

export function shiftsBreathingAnchors(frame: keyof typeof dogArt) {
  return frame === "standing" || frame === "happy" || frame.startsWith("sitting");
}

export function dogFrame(mood: AppState["pet"]["mood"], pose: DogPose) {
  if (pose === "tucking" || isFittedFrame(pose) || isLoafFrame(pose)) return pose;
  if (pose === "loaf") return `loaf-${mood}` as const;
  if (pose === "sitting") return mood === "idle" ? "sitting" : `sitting-${mood}` as const;
  if (pose !== "standing") return pose;
  return mood === "idle" ? "standing" : mood;
}

let ready: Promise<void> | undefined;
export function preloadDogArt() {
  const sources = [...Object.values(dogArt), ...Object.values(breathingArt).flat(), "/dog/bandana.png", "/dog/notebook.png"];
  ready ??= Promise.all(sources.map((src) => new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Dog artwork could not load. Please reload the app."));
    image.src = src;
  }))).then(() => undefined);
  return ready;
}
