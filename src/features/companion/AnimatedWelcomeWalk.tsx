import { useEffect, useRef, useState } from 'react';
import type { AppState } from '../../shared/schema';
import { useReducedMotion } from '../../shared/useReducedMotion';
import { DogSprite } from './DogSprite';
import { getCostumeArt } from './CostumePortrait';
import type { DogPose } from './posePlayback';
import type { FittedFrame } from './poseFrames';
import { WelcomeWalkFrame } from './WelcomeWalkFrame';
import { startWelcomeWalk } from './welcomeWalk';
import { loadWelcomeWalkAtlas, walkAtlasIsVisible, type WalkAtlasStatus } from './welcomeWalkAtlas';

export function AnimatedWelcomeWalk({ state, pose, onStart, onComplete }: {
  state: AppState; pose: DogPose; onStart?: (animated: boolean) => void; onComplete?: () => void;
}) {
  const [frame, setFrame] = useState(0);
  const [settling, setSettling] = useState<FittedFrame | null>(null);
  const [landingReady, setLandingReady] = useState(false);
  const [atlas, setAtlas] = useState<WalkAtlasStatus>('loading');
  const reduced = useReducedMotion(state.settings.reduceMotion);
  const complete = useRef(onComplete);
  const started = useRef(onStart);
  const returnPose = useRef(pose);
  complete.current = onComplete;
  started.current = onStart;
  returnPose.current = pose;
  useEffect(() => {
    if (reduced) return;
    return loadWelcomeWalkAtlas(setAtlas);
  }, [reduced]);
  useEffect(() => {
    if (atlas === 'loading' && !reduced) return;
    setSettling(null);
    setLandingReady(false);
    started.current?.(walkAtlasIsVisible(atlas, reduced));
    if (!walkAtlasIsVisible(atlas, reduced)) {
      setFrame(0);
      const timer = setTimeout(() => complete.current?.(), reduced ? 0 : 1200);
      return () => clearTimeout(timer);
    }
    return startWelcomeWalk(setFrame, () => complete.current?.(),
      returnPose.current === 'sitting' ? setSettling : undefined);
  }, [atlas, reduced]);
  if (!walkAtlasIsVisible(atlas, reduced)) return <DogSprite state={state} pose={pose} />;
  if (settling) {
    const reveal = landingReady || Boolean(getCostumeArt(state.equipment.body));
    return <div className="walk-landing">
      {!reveal && <WelcomeWalkFrame state={state} index={frame} />}
      <div className={reveal ? undefined : 'walk-landing-pending'}>
        <DogSprite state={state} pose={settling} onBaseLoad={() => setLandingReady(true)} />
      </div>
    </div>;
  }
  return <WelcomeWalkFrame state={state} index={frame} />;
}
