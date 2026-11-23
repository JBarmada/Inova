import { expect, it } from "vitest";
import { clipIds, clipTiming } from "./dogClips";

it("places sound markers on playback frame boundaries", () => {
  for (const id of clipIds) {
    const timing = clipTiming[id];
    let elapsed = 0;
    const starts = timing.durations.map((duration) => { const start = elapsed; elapsed += duration; return start; });
    for (const [marker, time] of Object.entries(timing.markers)) {
      if (marker === "bark" || marker === "fanfare") expect(starts, `${id} ${marker}`).toContain(time);
    }
  }
});
