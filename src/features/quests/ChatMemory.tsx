import { useState } from "react";
import { MemoryCategorySelect, type Category } from "../world/MemoryCategories";
import { dispatch } from "../../state/store";
import { newId, now } from "../../shared/actions";
import type { Memory } from "../../shared/schema";

export function ChatMemory({ index, original, suggested, memories, onDone, onCancel }: {
  index: number; original: string; memories: Memory[]; suggested?: { quote: string; category: Category; replyIndex: number }; onDone: (updated: boolean) => void; onCancel: () => void;
}) {
  const [text, setText] = useState(suggested?.quote ?? original);
  const [category, setCategory] = useState<Category>(suggested?.category ?? "misc");
  const [allowed, setAllowed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [target, setTarget] = useState<Memory>();
  async function save() {
    setBusy(true); setError("");
    try {
      const suggestion = suggested ? { replyIndex: suggested.replyIndex, quote: suggested.quote } : undefined;
      if (target) await dispatch({ type: "correct-chat-memory", messageIndex: index, originalText: original, target, text, suggestion });
      else await dispatch({ type: "save-chat-memory", messageIndex: index, originalText: original,
        memory: { id: newId(), text, category, source: "chat", createdAt: now(), aiAllowed: allowed }, suggestion });
      onDone(Boolean(target));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save memory."); }
    finally { setBusy(false); }
  }
  return <form aria-label="Save conversation memory" onSubmit={(event) => { event.preventDefault(); void save(); }}>
    {suggested && <p>From your message: {original}</p>}
    {memories.length > 0 && <label>Save as<select value={target?.id ?? ""} disabled={busy}
      onChange={(event) => setTarget(memories.find((memory) => memory.id === event.target.value))}>
      <option value="">A new memory</option>
      {memories.map((memory) => <option key={memory.id} value={memory.id}>{memory.text.slice(0, 100)}</option>)}
    </select></label>}
    {target && <p>Replacing: {target.text}. Its category and personalization permission stay the same.</p>}
    <label>What should I remember?<textarea required value={text} maxLength={4000} onChange={(event) => setText(event.target.value)} /></label>
    {!target && <><MemoryCategorySelect value={category} onChange={setCategory} disabled={busy} />
      <label className="checkbox"><input type="checkbox" checked={allowed} onChange={(event) => setAllowed(event.target.checked)} />Allow this memory to inform suggestions</label></>}
    <button disabled={busy || !text.trim()}>{target ? "Update memory" : "Save memory"}</button>
    <button type="button" disabled={busy} onClick={onCancel}>Cancel</button>
    {error && <p role="alert">{error}</p>}
  </form>;
}
