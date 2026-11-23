import type { AppState } from "../../shared/schema";
import type { DogPose } from "./posePlayback";

export const dogArt = {
  standing: "/dog/neutral.png", tucking: "/dog/tuck.png", sitting: "/dog/sitting.png",
  happy: "/dog/happy.png", tired: "/dog/tired.png",
};

const breaths = (name: string) => Array.from({ length: 4 }, (_, phase) => `/dog/breathing/${name}-${phase}.png`);
export const breathingArt: Partial<Record<keyof typeof dogArt, string[]>> = {
  standing: breaths("neutral"), happy: breaths("happy"), sitting: breaths("sitting"),
};

export function dogFrame(mood: AppState["pet"]["mood"], pose: DogPose) {
  return mood === "idle" ? pose : mood;
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
