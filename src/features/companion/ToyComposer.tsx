import { useRef, useState } from "react";
import type { AppState, Commitment } from "../../shared/schema";
import { newId, now } from "../../shared/actions";
import { dispatch } from "../../state/store";
import { samplePlanner } from "../../services/planner";
import { useAction } from "../../shared/useAction";

export function ToyComposer({ state }: { state: AppState }) {
  const [text, setText] = useState("");
  const pending = useRef<Commitment | null>(null);
  const { run, busy, message } = useAction();
  async function add() {
    const title = text.trim();
    if (!title) throw Error("Give your next adventure a name.");
    const commitment = pending.current?.title === title ? pending.current : { id: newId(), title, createdAt: now() };
    await dispatch({ type: "add-commitment", commitment });
    pending.current = commitment;
    const quest = await samplePlanner.propose(commitment, state);
    await dispatch({ type: "propose-quest", quest });
    pending.current = null;
    setText("");
  }
  return <div className="toy-composer-wrap"><form className="toy-composer" onSubmit={(event) => {
    event.preventDefault();
    void run(add, "A new quest is waiting. Tap its toy to fetch it.");
  }}>
    <input aria-label="Next commitment" placeholder="Your next little adventure…" value={text} maxLength={240}
      disabled={busy} onChange={(event) => setText(event.target.value)} required />
    <button type="submit" disabled={busy || !text.trim()} className="toy-add" aria-label="Add commitment and propose quest" title="Add commitment">{busy ? "…" : "✓"}</button>
  </form>
    {message && <p className="toy-composer-feedback" role="status">{message}</p>}
  </div>;
}
