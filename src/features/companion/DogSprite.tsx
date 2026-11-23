import type { AppState } from "../../shared/schema";

export function DogSprite({ state }: { state: AppState }) {
  return <div className={`dog dog-${state.pet.mood}`} aria-label={`${state.pet.name}, ${state.pet.mood}`}>
    <img src="/inova.svg" alt="Original placeholder pixel dog" draggable={false} />
    {state.equippedItem === "notebook" && <span className="prop" aria-label="Notebook equipped">▤</span>}
    {state.equippedItem === "bandana" && <span className="bandana" aria-label="Bandana equipped" />}
    {state.pet.mood === "happy" && <span className="spark" aria-hidden="true">✦</span>}
  </div>;
}
