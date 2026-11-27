import { useEffect, useRef, useState } from 'react';
import type { AppState } from '../../shared/schema';
import { useReducedMotion } from '../../shared/useReducedMotion';
import { WelcomeWalkFrame } from './WelcomeWalkFrame';
import { startWelcomeWalk, welcomeWalkFits } from './welcomeWalk';

export function WelcomeWalkReview({ state }: { state: AppState }) {
  const [frame, setFrame] = useState(0);
  const stop = useRef<(() => void) | undefined>(undefined);
  const reduced = useReducedMotion(state.settings.reduceMotion);
  useEffect(() => () => stop.current?.(), []);
  useEffect(() => { if (reduced) { stop.current?.(); setFrame(0); } }, [reduced]);
  const preview = { ...state, equipment: { hat: null, glasses: null, socks: 'mint-socks' as const, body: 'bee' as const } };
  return <section><h3>Walk frame fit study</h3>
    <WelcomeWalkFrame state={{ ...preview, equipment: { ...preview.equipment, socks: null } }} index={frame} />
    <div><button type="button" disabled={reduced} onClick={() => {
      stop.current?.(); stop.current = startWelcomeWalk(setFrame);
    }}>Play or replay walk</button></div>
    {reduced && <p>Walk playback is disabled while reduced motion is enabled.</p>}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
      {welcomeWalkFits.map((_, frame) => <figure key={frame} style={{ margin: 0 }}>
        <WelcomeWalkFrame state={preview} index={frame} /><figcaption>Frame {frame + 1}</figcaption>
      </figure>)}
    </div>
  </section>;
}
