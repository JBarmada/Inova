import { useState } from "react";
import type { Quest } from "../../shared/schema";
import { dispatch, dispatchWithReceipt, useInova } from "../../state/store";
import { RewardReveal, type CompletionReveal } from "./RewardReveal";
import { useAction } from "../../shared/useAction";
import { QuestSources } from "./QuestSources";

export function QuestCard({ quest }: { quest: Quest }) {
  const state = useInova();
  const { run, busy, message } = useAction();
  const [reveal, setReveal] = useState<CompletionReveal | null>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(quest.title);
  const [minutes, setMinutes] = useState(String(quest.minutes));
  const terminal = quest.status === "completed" || quest.status === "dismissed";
  return <article className="quest"><p className="eyebrow">{quest.minutes} MIN · {quest.status} · {quest.planner === "local" ? "local AI" : "sample"}</p>
    {editing ? <form onSubmit={(event) => { event.preventDefault(); void run(async () => {
      await dispatch({ type: "edit-quest", id: quest.id, title, minutes: Number(minutes) }); setEditing(false);
    }, "Quest updated."); }}><label>Quest title<input value={title} required maxLength={4000}
      onChange={(event) => setTitle(event.target.value)} /></label>
      <label>Duration (minutes)<input type="number" min="1" max="120" step="1" required value={minutes}
        onChange={(event) => setMinutes(event.target.value)} /></label><div className="actions">
      <button disabled={busy}>Save</button><button type="button" onClick={() => { setTitle(quest.title); setMinutes(String(quest.minutes)); setEditing(false); }}>Cancel</button>
    </div></form> : <h3>{quest.title}</h3>}<p>{quest.reason}</p>
    <QuestSources quest={quest} state={state} />
    {!terminal && !editing && <div className="actions">
      <button disabled={busy} onClick={() => { setTitle(quest.title); setMinutes(String(quest.minutes)); setEditing(true); }}>Edit</button>
      {quest.status !== "accepted" && <button disabled={busy} onClick={() => void run(() => dispatch({ type: "quest-status", id: quest.id, status: "accepted" }))}>Accept</button>}
      {quest.status === "accepted" && <button className="primary" disabled={busy} onClick={() => void run(async () => { const receipt = await dispatchWithReceipt({ type: "complete-quest", id: quest.id, completedAt: new Date().toISOString() }); setReveal({ ...receipt, title: quest.title }); }, "")}>Complete</button>}
      <button disabled={busy} onClick={() => void run(() => dispatch({ type: "quest-status", id: quest.id, status: "deferred" }))}>Later</button>
      <button disabled={busy} onClick={() => void run(() => dispatch({ type: "quest-status", id: quest.id, status: "dismissed" }))}>Dismiss</button>
    </div>}
    {reveal && <RewardReveal result={reveal} />}
    {message && <p role="status">{message}</p>}
  </article>;
}
