import type { Quest } from "../../shared/schema";
import { dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";

export function QuestCard({ quest }: { quest: Quest }) {
  const { run, busy, message } = useAction();
  const terminal = quest.status === "completed" || quest.status === "dismissed";
  return <article className="quest"><p className="eyebrow">{quest.minutes} MIN · {quest.status}</p>
    <h3>{quest.title}</h3><p>{quest.reason}</p>
    {!terminal && <div className="actions">
      {quest.status !== "accepted" && <button disabled={busy} onClick={() => void run(() => dispatch({ type: "quest-status", id: quest.id, status: "accepted" }))}>Accept</button>}
      {quest.status === "accepted" && <button className="primary" disabled={busy} onClick={() => void run(() => dispatch({ type: "complete-quest", id: quest.id }), "Completed! Check your wardrobe for earned items.")}>Complete</button>}
      <button disabled={busy} onClick={() => void run(() => dispatch({ type: "quest-status", id: quest.id, status: "deferred" }))}>Later</button>
      <button disabled={busy} onClick={() => void run(() => dispatch({ type: "quest-status", id: quest.id, status: "dismissed" }))}>Dismiss</button>
    </div>}
    {message && <p role="status">{message}</p>}
  </article>;
}
