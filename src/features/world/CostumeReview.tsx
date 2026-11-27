import { costumeIds } from "../../shared/costumes";
import { itemById } from "../../shared/catalog";
import type { AppState } from "../../shared/schema";
import { DogSprite } from "../companion/DogSprite";

export function CostumeReview({ state }: { state: AppState }) {
  const [open, setOpen] = useState(false);
  return <details className="costume-review" onToggle={(event) => setOpen(event.currentTarget.open)}><summary>Review all costume fits</summary>
    {open && <div className="costume-review-grid">{costumeIds.map((id) => {
      const preview = { ...state, settings: { ...state.settings, reduceMotion: true },
        pet: { ...state.pet, mood: "idle" as const }, equipment: { hat: null, glasses: null, socks: null, body: id } };
      return <article key={id}><h4>{itemById(id).name}</h4><div className="costume-review-poses">
        {(["standing", "sitting"] as const).map((pose) => <figure key={pose}>
          <DogSprite state={preview} pose={pose} /><figcaption>{pose}</figcaption>
        </figure>)}
      </div></article>;
    })}</div>}
  </details>;
}
import { useState } from "react";
