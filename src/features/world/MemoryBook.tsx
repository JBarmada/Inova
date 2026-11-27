import { useRef, useState } from "react";
import type { Quest } from "../../shared/schema";
import { newId, now } from "../../shared/actions";
import { dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { MemoryCategoryTabs, type Category } from "./MemoryCategories";

export function MemoryBook({ quests }: { quests: Quest[] }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [questId, setQuestId] = useState("");
  const [category, setCategory] = useState<Category>("misc");
  const body = useRef<HTMLTextAreaElement>(null);
  const { run, busy, message } = useAction();
  const suggestions = title.trim() && !questId ? quests.filter((quest) => quest.title.toLocaleLowerCase().includes(title.trim().toLocaleLowerCase())).slice(0, 5) : [];
  async function save() {
    await dispatch({ type: "add-memory", memory: { id: newId(), title, text, createdAt: now(), aiAllowed: true, category, ...(questId ? { questId } : {}) } });
    setTitle(""); setText(""); setQuestId(""); setCategory("misc");
  }
  return <form className="memory-book" onSubmit={(event) => { event.preventDefault(); void run(save, "Memory saved."); }}>
    <div className="memory-pages"><div className="memory-page">
      <input aria-label="Memory title" placeholder="Title your memory..." maxLength={240} required value={title}
        onChange={(event) => { setTitle(event.target.value); setQuestId(""); }}
        onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); body.current?.focus(); } }} />
      {suggestions.length > 0 && <div className="adventure-suggestions" aria-label="Matching adventures">
        {suggestions.map((quest) => <button type="button" key={quest.id} onClick={() => { setTitle(quest.title.slice(0, 240)); setQuestId(quest.id); body.current?.focus(); }}>{quest.title}</button>)}
      </div>}
      {questId && <small>Linked to adventure</small>}
      <textarea ref={body} aria-label="Memory" placeholder="Write your memory..." maxLength={4000} required value={text} onChange={(event) => setText(event.target.value)} />
      <button className="primary" disabled={busy || !title.trim() || !text.trim()}>Save memory</button>
      {message && <p role="status">{message}</p>}
    </div></div>
    <MemoryCategoryTabs value={category} onChange={setCategory} disabled={busy} />
  </form>;
}
