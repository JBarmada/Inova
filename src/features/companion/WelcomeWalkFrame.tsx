import type { AppState } from '../../shared/schema';
import { itemById } from '../../shared/catalog';
import { WearableLayers } from './WearableLayers';
import { WALK_ATLAS, welcomeWalkFits } from './welcomeWalk';
import { DogSprite } from './DogSprite';
import { RearCostumeLayer } from './RearCostumeLayer';

export function WelcomeWalkFrame({ state, index }: { state: AppState; index: number }) {
  const frame = Math.max(0, Math.min(welcomeWalkFits.length - 1, index));
  const outfit = Object.values(state.equipment).filter((id) => id !== null).map((id) => itemById(id).name);
  const description = `${state.pet.name}, walking${outfit.length ? `, wearing ${outfit.join(', ')}` : ''}`;
  if (state.equipment.body === "bee") return <DogSprite state={state} pose="standing" walkFrame={frame} />;
  return <div className="dog dog-standing dog-walk-registered" role="img" aria-label={description} data-walk-frame={frame}>
    <RearCostumeLayer id={state.equipment.body} frame="standing" />
    <span className="dog-clip-layer" aria-hidden="true" style={{
      backgroundImage: `url(${WALK_ATLAS})`, backgroundSize: '800% 100%',
      backgroundPosition: `${frame / 7 * 100}% 0%`,
    }} />
    <WearableLayers equipment={state.equipment} frame="standing" motion={{ feet: welcomeWalkFits[frame] }} />
  </div>;
}
