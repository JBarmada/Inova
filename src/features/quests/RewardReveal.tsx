import { itemById } from "../../shared/catalog";
import type { ItemId } from "../../shared/schema";
import { ItemGlyph } from "../world/ItemGlyph";

export type CompletionReveal = { title: string; unlocked: ItemId[]; completed: boolean };

export function RewardReveal({ result }: { result: CompletionReveal }) {
  if (!result.completed) return <p role="status">This quest was already completed or is no longer active.</p>;
  return <div className="reward-reveal" role="status" aria-live="polite">
    <strong>Adventure complete!</strong><span>{result.title}</span>
    {result.unlocked.length ? result.unlocked.map((id) => {
      const item = itemById(id);
      return <div className="reward-item" key={id}><ItemGlyph slot={item.slot} color={item.color} />
        <span>Unlocked {item.name}! Find it in Wardrobe.</span></div>;
    }) : <span>Your progress is saved.</span>}
  </div>;
}
