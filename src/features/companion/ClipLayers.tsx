import { clipSource, clipTiming, type ClipFrame } from "./dogClips";

export function ClipLayers({ frame, phase, effects = false }: { frame: ClipFrame; phase: number; effects?: boolean }) {
  const timing = clipTiming[frame.clip];
  const columns = timing.durations.length;
  const rows = 4 + timing.effects.length;
  const sprite = (column: number, row: number, key: string) => <span key={key} className="dog-clip-layer"
    aria-hidden="true" style={{
      backgroundImage: `url(${clipSource(frame.clip)})`,
      backgroundSize: `${columns * 100}% ${rows * 100}%`,
      backgroundPosition: `${(column / Math.max(1, columns - 1)) * 100}% ${(row / (rows - 1)) * 100}%`,
    }} />;
  if (!effects) return sprite(frame.index, phase, "dog");
  return timing.effects.filter((effect) => frame.elapsed >= effect.startMs && frame.elapsed < effect.endMs
    && (frame.demo || effect.name !== "bandana-sample")).map((effect) => sprite(0, effect.row, effect.name));
}
