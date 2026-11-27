import type { AppState } from "../../shared/schema";
import { wardrobeScenarios } from "../../shared/wardrobeScenarios";
import { dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { DogSprite } from "../companion/DogSprite";
import { playCue } from "../../services/audio";
import { CostumeReview } from "./CostumeReview";
import { SoftOutfitReview } from "./SoftOutfitReview";
import { WelcomeWalkReview } from "../companion/WelcomeWalkReview";

export function WardrobeLab({ state }: { state: AppState }) {
  const { run, busy, message } = useAction();
  return <details className="wardrobe-lab"><summary onClick={() => playCue("click", state.settings.muted)}>Developer wardrobe scenarios</summary>
    <p>Fictional test outfits. Applying one grants these prototype items on this device and saves the outfit. Quest rewards and memories stay unchanged.</p>
    <div className="wardrobe-scenarios">{wardrobeScenarios.map((scenario) => <article key={scenario.id}>
      <h3>{scenario.name}</h3><p>{scenario.description}</p>
      <div className="scenario-poses">{(["standing", "sitting"] as const).map((pose) => <figure key={pose}>
        <DogSprite state={{ ...state, pet: { ...state.pet, mood: "idle" }, equipment: scenario.equipment }} pose={pose} />
        <figcaption>{pose}</figcaption></figure>)}</div>
      <button disabled={busy} onClick={() => void run(() => dispatch({ type: "wardrobe-scenario", id: scenario.id }), `${scenario.name} applied.`)}>Apply {scenario.name}</button>
    </article>)}</div>
    <SoftOutfitReview state={state} />
    <WelcomeWalkReview state={state} />
    <CostumeReview state={state} />
    {message && <p role="status">{message}</p>}
  </details>;
}
