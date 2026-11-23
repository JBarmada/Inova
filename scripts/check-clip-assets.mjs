import { readFileSync } from "node:fs";

const clips = JSON.parse(readFileSync("src/features/companion/clipTimings.json", "utf8"));
for (const [name, timing] of Object.entries(clips)) {
  const png = readFileSync(`public/dog/clips/${name}.png`);
  const width = 64 * timing.durations.length;
  const height = 64 * (4 + timing.effects.length);
  if (png.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" ||
      png.readUInt32BE(16) !== width || png.readUInt32BE(20) !== height) {
    throw Error(`Invalid clip atlas: ${name}; expected ${width} x ${height}`);
  }
}
console.log(`Validated ${Object.keys(clips).length} clip atlases.`);
