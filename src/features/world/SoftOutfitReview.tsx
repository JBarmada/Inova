import type { AppState } from '../../shared/schema';
import { DogSprite } from '../companion/DogSprite';

export function SoftOutfitReview({ state }: { state: AppState }) {
  const preview = { ...state, settings: { ...state.settings, reduceMotion: true },
    pet: { ...state.pet, mood: 'idle' as const }, equipment: { hat: null, glasses: null, socks: null, body: null } };
  return <section className="soft-outfit-review"><h3>Illustrated bee experiment</h3>
    <div className="soft-outfit-stage"><DogSprite state={preview} pose="standing" />
      <svg viewBox="0 0 64 64" aria-hidden="true"><svg x="4" y="4" width="48" height="50" viewBox="150 90 850 700" preserveAspectRatio="none">
        <image href="/dog/experiments/bee-overlay.png" width="1254" height="1254" />
      </svg></svg>
    </div><p>Standing fit study</p>
  </section>;
}
