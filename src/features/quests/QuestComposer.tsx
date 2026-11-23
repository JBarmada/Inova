import { useState } from "react";
import type { AppState } from "../../shared/schema";
import { dispatch } from "../../state/store";
import { prepareQuest } from "../../services/prepareQuest";

export function QuestComposer({ state, compact = false }: { state: AppState; compact?: boolean }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit() {
    setBusy(true); setMessage("Thinking…");
    try {
      const result = await prepareQuest(text, state);
      await dispatch({ type: "add-planned-quest", commitment: result.commitment, quest: result.quest, memorySnapshot: result.memorySnapshot });
      setText("");
      setMessage(result.fallback ? "AI could not make a quest. A sample quest is ready." : "Your quest is ready.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save. Please try again."); }
    finally { setBusy(false); }
  }
  return <div className={compact ? "toy-composer-wrap" : "quest-composer-wrap"}>
    <form className={compact ? "toy-composer" : "quest-composer"} onSubmit={(event) => { event.preventDefault(); void submit(); }}>
      <input aria-label="Your next adventure" placeholder="What would you like to do?" value={text} maxLength={240}
        disabled={busy} onChange={(event) => setText(event.target.value)} required />
      <button type="submit" disabled={busy || !text.trim() || !state.pet.adopted} className={compact ? "toy-add" : "primary"}
        aria-label="Make a quest" title="Make a quest">{busy ? "…" : compact ? "✓" : "Make a quest"}</button>
    </form>
    {message && <p className={compact ? "toy-composer-feedback" : "quest-composer-feedback"} role="status">{message}</p>}
  </div>;
}
