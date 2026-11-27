import { fittedFrames, fittedFrameMs, type FittedFrame } from './poseFrames';

export const WELCOME_WALK_FRAME_MS = 150;
export const WALK_ATLAS = '/dog/walk-standing-atlas.png';
// The standing atlas keeps the face and body fixed and alternates the diagonal paw lifts.
export const welcomeWalkPawLifts = [
  [0, 0, 0, 0], [2, 0, 2, 0], [3, 0, 2, 0], [1, 1, 1, 1],
  [0, 2, 0, 2], [0, 3, 0, 2], [0, 1, 0, 1], [0, 0, 0, 0],
];
const standingPaws = [[18, 51], [27, 52], [35, 52], [44, 51]];
export const BEE_PAW_LIFT = 14;
export const welcomeWalkFits = welcomeWalkPawLifts.map((lifts) =>
  standingPaws.map(([x, y], index) => [x, y - lifts[index]]));

export function startWelcomeWalk(
  show: (frame: number) => void,
  complete?: () => void,
  settleToSit?: (pose: FittedFrame) => void,
) {
  let frame = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  function settle(index: number) {
    const pose = fittedFrames[index];
    if (!settleToSit || !pose) { complete?.(); return; }
    settleToSit(pose);
    timer = setTimeout(() => settle(index + 1), fittedFrameMs[index]);
  }
  function next() {
    if (frame >= welcomeWalkFits.length) { settle(0); return; }
    show(frame);
    frame += 1;
    timer = setTimeout(next, WELCOME_WALK_FRAME_MS);
  }
  next();
  return () => clearTimeout(timer);
}
