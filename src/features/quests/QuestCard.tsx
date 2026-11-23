import { useState } from "react";
import type { Quest } from "../../shared/schema";
import { dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";

export function QuestCard({ quest }: { quest: Quest }) {
  const { run, busy, message } = useAction();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(quest.title);
  const terminal = quest.status === "completed" || quest.status === "dismissed";
  return <article className="quest"><p className="eyebrow">{quest.minutes} MIN · {quest.status} · {quest.planner === "local" ? "local AI" : "sample"}</p>
    {editing ? <form onSubmit={(event) => { event.preventDefault(); void run(async () => {
      await dispatch({ type: "edit-quest", id: quest.id, title }); setEditing(false);
    }, "Quest updated."); }}><label>Quest title<input value={title} required maxLength={4000}
      onChange={(event) => setTitle(event.target.value)} /></label><div className="actions">
      <button disabled={busy}>Save</button><button type="button" onClick={() => { setTitle(quest.title); setEditing(false); }}>Cancel</button>
    </div></form> : <h3>{quest.title}</h3>}<p>{quest.reason}</p>
    {!terminal && !editing && <div className="actions">
      <button disabled={busy} onClick={() => { setTitle(quest.title); setEditing(true); }}>Edit</button>
      {quest.status !== "accepted" && <button disabled={busy} onClick={() => void run(() => dispatch({ type: "quest-status", id: quest.id, status: "accepted" }))}>Accept</button>}
      {quest.status === "accepted" && <button className="primary" disabled={busy} onClick={() => void run(() => dispatch({ type: "complete-quest", id: quest.id }), "Completed! Check your wardrobe for earned items.")}>Complete</button>}
      <button disabled={busy} onClick={() => void run(() => dispatch({ type: "quest-status", id: quest.id, status: "deferred" }))}>Later</button>
      <button disabled={busy} onClick={() => void run(() => dispatch({ type: "quest-status", id: quest.id, status: "dismissed" }))}>Dismiss</button>
    </div>}
    {message && <p role="status">{message}</p>}
  </article>;
}
