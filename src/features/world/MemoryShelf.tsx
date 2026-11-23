import { useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { RecentRecap } from "./RecentRecap";
import { newId, now } from "../../shared/actions";

export function MemoryShelf() {
  const state = useInova();
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [questId, setQuestId] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = state.memories.find((entry) => entry.id === selectedId);
  const { run, busy, message } = useAction();
  async function save() {
    await dispatch({ type: "add-memory", memory: { id: newId(), text, createdAt: now(), aiAllowed: allowed, ...(questId ? { questId } : {}) } });
    setText("");
    setQuestId("");
    setAllowed(false);
  }
  return <section className="memory-shelf" aria-label="Memories"><h2>Memories</h2>
    <RecentRecap state={state} />
    <form onSubmit={(event) => { event.preventDefault(); void run(save, "A memory was added to your shelf."); }}>
      <label>A reflection<textarea required value={text} maxLength={4000} onChange={(event) => setText(event.target.value)} placeholder="What helped today?" /></label>
      <label>Related completed adventure (optional)<select value={questId} disabled={busy} onChange={(event) => setQuestId(event.target.value)}>
        <option value="">No related adventure</option>
        {state.quests.filter((quest) => quest.status === "completed").map((quest) => <option key={quest.id} value={quest.id}>{quest.title}</option>)}
      </select></label>
      <label className="checkbox"><input type="checkbox" checked={allowed} onChange={(event) => setAllowed(event.target.checked)} />Allow this entry to inform suggestions</label>
      <button disabled={busy}>Save memory</button>
    </form>
    <div className="books">{state.memories.map((memory) => <button className="book" key={memory.id}
      onClick={() => void run(async () => { setSelectedId(memory.id); setEditing(false); }, "Book opened.")}>{new Date(memory.createdAt).toLocaleDateString()}</button>)}</div>
    {!state.memories.length && <p className="empty">Your first book is waiting to be written.</p>}
    {selected && <article className="open-book"><h4>{new Date(selected.createdAt).toLocaleString()}</h4>
      {selected.questId && <p>Adventure: {state.quests.find((quest) => quest.id === selected.questId)?.title ?? "Unavailable adventure"}</p>}
      {editing ? <form onSubmit={(event) => { event.preventDefault(); void run(async () => {
        await dispatch({ type: "edit-memory", id: selected.id, text: draft }); setEditing(false);
      }, "Memory updated."); }}><label>Edit reflection<textarea required maxLength={4000} value={draft}
        onChange={(event) => setDraft(event.target.value)} /></label><div className="actions">
        <button disabled={busy}>Save changes</button><button type="button" disabled={busy} onClick={() => setEditing(false)}>Cancel</button>
      </div></form> : <><p>{selected.text}</p><button disabled={busy} onClick={() => { setDraft(selected.text); setEditing(true); }}>Edit memory</button></>}
      <label className="checkbox"><input type="checkbox" checked={selected.aiAllowed} disabled={busy}
        onChange={(event) => void run(() => dispatch({ type: "memory-permission", id: selected.id, allowed: event.target.checked }))} />May inform suggestions</label>
      <button disabled={busy} onClick={() => void run(() => dispatch({ type: "delete-memory", id: selected.id }), "Memory deleted.")}>Delete memory</button>
      <button onClick={() => void run(async () => { setSelectedId(null); setEditing(false); }, "Book closed.")}>Close book</button>
    </article>}
    {message && <p role="status">{message}</p>}
  </section>;
}
