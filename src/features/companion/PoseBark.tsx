import type { ArtFrame } from "./wearableAnchors";

// The first muzzle row below the nose in each 64 × 64 base frame.
const muzzleRows: Record<ArtFrame, number> = {
  standing: 32, "standing-blink": 32, happy: 33, tired: 35, tucking: 30,
  sitting: 29, "sitting-blink": 29, "sitting-drowsy": 29, "sitting-happy": 29, "sitting-tired": 29,
  "sit-02": 32, "sit-03": 32, "sit-04": 31, "sit-05": 31, "sit-06": 30, "sit-07": 30,
  "loaf-bend": 32, "loaf-tuck": 36, "loaf-idle": 39, "loaf-happy": 39, "loaf-tired": 39,
  sleeping: 41, "sleep-drowsy": 39, "sleep-doze": 40, "wake-ear": 41, "wake-eyes": 40,
};

export function PoseBark({ frame, breathingPeak }: { frame: ArtFrame; breathingPeak: boolean }) {
  const mouth = muzzleRows[frame] - Number(breathingPeak);
  return <svg className="wearable-layers" viewBox="0 0 64 64" aria-hidden="true" data-bark-mouth={mouth}>
    <g transform={`translate(0 ${mouth})`} shapeRendering="crispEdges">
      <rect x="13" y="0" width="14" height="7" fill="#fff1d0" />
      <path d="M18 1h6v1h1v4h-1v1h-6V6h-1V2h1z" fill="#4b2d22" />
      <path d="M19 5h4v1h-4z" fill="#e88678" />
      <path d="M34 1h2v-1h2v1h-2v1h-2z M35 4h4v1h-4z M34 7h2v1h2v1h-2V8h-2z" fill="#754221" />
    </g>
  </svg>;
}
