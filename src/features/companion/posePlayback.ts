import { fittedFrames, fittedFrameMs, isFittedFrame, isLoafFrame, loafFrames, LOAF_FRAME_MS,
  type FittedFrame, type LoafFrame } from "./poseFrames";
import { TIRED_FACE_STEPS } from "./seatedFacePlayback";
import timings from "./clipTimings.json";

type StablePose = "standing" | "sitting" | "loaf" | "sleeping";
type SleepFrame = "sleep-drowsy" | "sleep-doze" | "wake-ear" | "wake-eyes";
type Beat = readonly [DogPose, number];
export type DogPose = StablePose | "tucking" | FittedFrame | LoafFrame | SleepFrame;
export type DogMood = "idle" | "happy" | "tired";
export const IDLE_SIT_DELAY = 8_000;
export const TIRED_LOAF_DELAY = 7_000;
export const LOAF_SLEEP_DELAY = 12_000;
export const TIRED_FACE_DURATION = TIRED_FACE_STEPS.reduce((total, [, ms]) => total + ms, 0);
export const FITTED_DURATION = fittedFrameMs.reduce<number>((total, ms) => total + ms, 0);

const fitted: Beat[] = fittedFrames.map((pose, i) => [pose, fittedFrameMs[i]]);
const lower: Beat[] = loafFrames.map((pose) => [pose, LOAF_FRAME_MS]);
const rise: Beat[] = [["loaf-tuck", timings["07a-loaf-to-sit"].durations[1]],
  ["loaf-bend", timings["07a-loaf-to-sit"].durations[2]]];
const fallAsleep: Beat[] = [["sleep-drowsy", timings["04-loaf-to-sleep"].durations[1]],
  ["sleep-doze", timings["04-loaf-to-sleep"].durations[2]]];
const wake: Beat[] = [["wake-ear", timings["06-wake-to-loaf"].durations[1]],
  ["wake-eyes", timings["06-wake-to-loaf"].durations[2]], ["sleep-drowsy", timings["06-wake-to-loaf"].durations[3]]];

export function isStablePose(pose: DogPose): pose is StablePose {
  return pose === "standing" || pose === "sitting" || pose === "loaf" || pose === "sleeping";
}

class PosePlayback {
  private timer: ReturnType<typeof setTimeout> | undefined;
  private pose: DogPose = "standing";
  private destination: StablePose = "standing";
  private since = Date.now();
  private disposed = false;
  private waking = false;

  constructor(private show: (pose: DogPose) => void, private reduced: boolean, private mood: DogMood) {
    this.finish();
  }

  private scheduleRest() {
    if (this.pose === "standing" && this.mood === "idle") {
      this.timer = setTimeout(this.sit, IDLE_SIT_DELAY);
    } else if (this.pose === "sitting" && this.mood === "tired") {
      const remaining = this.since + (this.reduced ? 0 : TIRED_FACE_DURATION) + TIRED_LOAF_DELAY - Date.now();
      this.timer = setTimeout(() => this.travel("loaf", lower), Math.max(0, remaining));
    } else if (this.pose === "loaf" && this.mood === "tired" && !this.waking) {
      this.timer = setTimeout(() => this.travel("sleeping", fallAsleep), LOAF_SLEEP_DELAY);
    }
  }

  private publish(pose: DogPose) { this.pose = pose; this.show(pose); }
  private finish() {
    this.since = Date.now();
    this.publish(this.destination);
    if (this.pose === "sleeping" && this.mood === "happy") { this.wake(); return; }
    this.scheduleRest();
  }

  private travel(destination: StablePose, beats: Beat[]) {
    if (this.disposed) return;
    clearTimeout(this.timer);
    this.destination = destination;
    const play = (index: number) => {
      const beat = beats[index];
      if (this.reduced || !beat) return this.finish();
      this.publish(beat[0]);
      this.timer = setTimeout(() => play(index + 1), beat[1]);
    };
    play(0);
  }

  sit = () => {
    if (this.pose === "standing") this.travel("sitting", fitted);
  };

  wake = () => {
    if (this.disposed || this.pose !== "sleeping") return;
    this.waking = true;
    this.travel("loaf", wake);
  };

  stand = () => {
    const pose = this.pose;
    if (this.disposed || this.destination === "standing") return;
    if (isFittedFrame(pose)) {
      this.travel("standing", fitted.slice(0, fittedFrames.indexOf(pose)).reverse());
      return;
    }
    const up = [...fitted].reverse();
    const seated: Beat = ["sitting", 130];
    if (pose === "sleeping" || this.destination === "sleeping" || (this.waking && pose !== "loaf")) {
      this.waking = false;
      this.travel("standing", [...wake, ["loaf", 130], ...rise, seated, ...up]);
    } else if (pose === "loaf" || isLoafFrame(pose)) {
      this.waking = false;
      const available = isLoafFrame(pose) ? lower.slice(0, loafFrames.indexOf(pose)).reverse() : rise;
      this.travel("standing", [...available, seated, ...up]);
    } else {
      this.travel("standing", up);
    }
  };

  setMood = (next: DogMood) => {
    if (this.disposed || this.mood === next) return;
    this.mood = next;
    if (next !== "tired") this.waking = false;
    if (next === "happy" && this.pose === "sleeping") { this.wake(); return; }
    if (this.pose !== this.destination) return;
    clearTimeout(this.timer);
    this.since = Date.now();
    this.scheduleRest();
  };

  setReducedMotion = (next: boolean) => {
    if (this.disposed || this.reduced === next) return;
    this.reduced = next;
    if (next && this.pose !== this.destination) { clearTimeout(this.timer); this.finish(); }
    else if (this.pose === "sitting" && this.mood === "tired" && this.pose === this.destination) {
      clearTimeout(this.timer); this.scheduleRest();
    }
  };

  dispose = () => { this.disposed = true; clearTimeout(this.timer); };
}

export function createPosePlayback(show: (pose: DogPose) => void, reducedMotion: boolean, initialMood: DogMood = "idle") {
  return new PosePlayback(show, reducedMotion, initialMood);
}
