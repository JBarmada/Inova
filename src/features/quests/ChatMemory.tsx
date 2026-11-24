import { useState } from "react";
import { MemoryCategorySelect, type Category } from "../world/MemoryCategories";
import { dispatch } from "../../state/store";
import { newId, now } from "../../shared/actions";

export function ChatMemory({ index, original, suggested, onDone, onCancel }: {
  index: number; original: string; suggested?: { quote: string; category: Category; replyIndex: number }; onDone: () => void; onCancel: () => void;
}) {
  const [text, setText] = useState(suggested?.quote ?? original);
  const [category, setCategory] = useState<Category>(suggested?.category ?? "misc");
  const [allowed, setAllowed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save() {
    setBusy(true); setError("");
    try {
      await dispatch({ type: "save-chat-memory", messageIndex: index, originalText: original,
        memory: { id: newId(), text, category, source: "chat", createdAt: now(), aiAllowed: allowed },
        ...(suggested ? { suggestion: { replyIndex: suggested.replyIndex, quote: suggested.quote } } : {}) });
      onDone();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save memory."); }
    finally { setBusy(false); }
  }
  return <form aria-label="Save conversation memory" onSubmit={(event) => { event.preventDefault(); void save(); }}>
    {suggested && <p>From your message: {original}</p>}
    <label>What should I remember?<textarea required value={text} maxLength={4000} onChange={(event) => setText(event.target.value)} /></label>
    <MemoryCategorySelect value={category} onChange={setCategory} disabled={busy} />
    <label className="checkbox"><input type="checkbox" checked={allowed} onChange={(event) => setAllowed(event.target.checked)} />Allow this memory to inform suggestions</label>
    <button disabled={busy || !text.trim()}>Save memory</button>
    <button type="button" disabled={busy} onClick={onCancel}>Cancel</button>
    {error && <p role="alert">{error}</p>}
  </form>;
}
