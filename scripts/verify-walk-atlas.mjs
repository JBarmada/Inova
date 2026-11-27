import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const gif = readFileSync('public/dog/welcome-walk.gif');
const atlas = readFileSync('public/dog/welcome-walk-atlas.png');
const standingAtlas = readFileSync('public/dog/walk-standing-atlas.png');
assert.equal(digest(gif), '617ca396263bcf7af710d0576aefec464e9fd1887b64cd0c4f3f5afe8d57edac');
assert.equal(digest(atlas), '27f89f11ff282c5bda0d4295968a287fb89f443d0e14e367aa7d9bfec92d3f9e');
assert.deepEqual([atlas.readUInt32BE(16), atlas.readUInt32BE(20)], [512, 64]);
assert.equal(digest(standingAtlas), 'de0c1a7e72c817a56a9699efbce54e6200257d195abbc6170dc9e63bff093b0f');
assert.deepEqual([standingAtlas.readUInt32BE(16), standingAtlas.readUInt32BE(20)], [512, 64]);
console.log('The reference walk and standing-art walk match their recorded hashes.');
