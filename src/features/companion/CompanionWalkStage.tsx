import type { AppState } from '../../shared/schema';
import type { ClipRequest } from './dogClips';
import type { DogPose } from './posePlayback';
import { AnimatedWelcomeWalk } from './AnimatedWelcomeWalk';
import { DogSprite } from './DogSprite';

export function CompanionWalkStage({ state, pose, clip, walking, walkKey, walkReady, floating, onWalkStart, onWalkComplete }: {
  state: AppState; pose: DogPose; clip: ClipRequest | null; walking: boolean; walkKey: number;
  walkReady: boolean; floating: boolean; onWalkStart: (animated: boolean) => void; onWalkComplete: () => void;
}) {
  const entrance = walking && walkReady && !state.settings.reduceMotion;
  return <div className={`dog-stage${entrance ? ' welcome-entrance' : ''}`}
    data-tauri-drag-region={floating || undefined} tabIndex={floating ? 0 : undefined}
    aria-label={floating ? 'Your dog. Focus to reveal companion controls.' : undefined}>
    {walking ? <div className="walk-entrance-layer"><AnimatedWelcomeWalk key={walkKey} state={state} pose={pose} onStart={onWalkStart} onComplete={onWalkComplete} /></div>
      : <DogSprite state={state} pose={pose} clip={clip} />}
  </div>;
}
