import { useState } from "react";
import type { Quest } from "../../shared/schema";
import { newId, now } from "../../shared/actions";
import { dispatch } from "../../state/store";

export function ChatReflection({ quest, onDone }: { quest: Quest; onDone: (message: string) => void }) {
  const [text, setText] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function run(save: boolean) {
    setBusy(true); setError("");
    try {
      if (save) await dispatch({ type: "add-memory", memory: { id: newId(), text, createdAt: now(), aiAllowed: allowed, questId: quest.id } });
      else await dispatch({ type: "skip-chat-reflection", questId: quest.id });
      onDone(save ? "Saved to Memories. What would you like to try next?" : "No problem. What would you like to try next?");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); }
    finally { setBusy(false); }
  }
  return <section className="chat-reflection" aria-label="Quest reflection">
    <p>How did <strong>{quest.title}</strong> go? A short reflection is optional.</p>
    <form onSubmit={(event) => { event.preventDefault(); void run(true); }}>
      <label>Your reflection<textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={4000} required /></label>
      <label className="checkbox"><input type="checkbox" checked={allowed} onChange={(event) => setAllowed(event.target.checked)} />Allow this entry to inform suggestions</label>
      <button disabled={busy || !text.trim()}>Save reflection</button>
      <button type="button" disabled={busy} onClick={() => void run(false)}>Skip reflection</button>
    </form>
    {error && <p role="alert">{error}</p>}
  </section>;
}
