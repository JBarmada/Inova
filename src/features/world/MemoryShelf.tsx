import { useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { playCue } from "../../services/audio";
import { MemoryBook } from "./MemoryBook";
import { findMemories } from "./findMemories";
import { MemoryCategoryTabs, MemoryFilters, type MemoryFilter } from "./MemoryCategories";

export function MemoryShelf() {
  const state = useInova();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MemoryFilter>("all");
  const matches = findMemories(state.memories, query, filter);
  const selected = state.memories.find((entry) => entry.id === selectedId);
  const { run, busy, message } = useAction();
  const completed = state.quests.filter((quest) => quest.status === "completed").length;
  return <section className="memory-shelf" aria-label="Memories"><h2>Memories <small aria-label={`${completed} completed adventures, ${state.memories.length} memories`}>{completed} / {state.memories.length}</small></h2>
    <MemoryBook quests={state.quests} />
    {state.memories.length > 0 && <label>Search memories<input type="search" value={query} maxLength={4000}
      onChange={(event) => setQuery(event.target.value)} placeholder="Find words in your reflections" /></label>}
    {state.memories.length > 0 && <MemoryFilters value={filter} onChange={setFilter} />}
    <div className="books">{matches.map((memory, index) => <button className={`book book-${memory.category ?? "misc"}`} key={memory.id}
      title={memory.title ?? new Date(memory.createdAt).toLocaleDateString()}
      aria-label={`Open ${memory.title ?? `memory ${index + 1}`} from ${new Date(memory.createdAt).toLocaleString()}`}
      onClick={() => void run(async () => { setSelectedId(memory.id); setEditing(false); playCue("book", state.settings.muted); }, "Book opened.")}><span className="book-title">{memory.title ?? new Date(memory.createdAt).toLocaleDateString()}</span></button>)}</div>
    {!state.memories.length && <p className="empty">Your first book is waiting to be written.</p>}
    {state.memories.length > 0 && matches.length === 0 && <p className="empty" role="status">No memories match this filter and search.</p>}
    {selected && <article className="open-book"><h4>{selected.title ?? new Date(selected.createdAt).toLocaleString()}</h4>
      {selected.source === "chat" && <p>Saved from conversation</p>}
      {selected.questId && <p>Adventure: {state.quests.find((quest) => quest.id === selected.questId)?.title ?? "Unavailable adventure"}</p>}
      <MemoryCategoryTabs value={selected.category ?? "misc"} disabled={busy} onChange={(value) => void run(() => dispatch({ type: "memory-category", id: selected.id, category: value }))} />
      {editing ? <form onSubmit={(event) => { event.preventDefault(); void run(async () => {
        await dispatch({ type: "edit-memory", id: selected.id, text: draft }); setEditing(false);
      }, "Memory updated."); }}><label>Edit reflection<textarea required maxLength={4000} value={draft}
        onChange={(event) => setDraft(event.target.value)} /></label><div className="actions">
        <button disabled={busy}>Save changes</button><button type="button" disabled={busy} onClick={() => setEditing(false)}>Cancel</button>
      </div></form> : <><p>{selected.text}</p><button disabled={busy} onClick={() => { setDraft(selected.text); setEditing(true); }}>Edit memory</button></>}
      <button disabled={busy} onClick={() => void run(() => dispatch({ type: "delete-memory", id: selected.id }), "Memory deleted.")}>Delete memory</button>
      <button onClick={() => void run(async () => { setSelectedId(null); setEditing(false); playCue("book", state.settings.muted); }, "Book closed.")}>Close book</button>
    </article>}
    {message && <p role="status">{message}</p>}
  </section>;
}
