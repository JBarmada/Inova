import type { Quest } from "../../shared/schema";
import { dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { adventureTitle, toyStatus } from "./toyQuests";
import { QuestToyIcon } from "./QuestToyIcon";

export function ToyQuestRow({ quest }: { quest: Quest }) {
  const { run, busy, message } = useAction();
  const fetchable = quest.status === "proposed" || quest.status === "deferred";
  return <li className={`toy-quest-row is-${quest.status}`}>
    <div className="toy-quest-copy"><p className="toy-quest-meta">{quest.minutes} min · {toyStatus[quest.status]}</p>
      <h4>{adventureTitle(quest.title)}</h4></div>
    {fetchable && <button className="toy-accept" disabled={busy}
      title="Fetch this quest" aria-label={`Accept quest: ${quest.title}`}
      onClick={() => void run(() => dispatch({ type: "quest-status", id: quest.id, status: "accepted" }), "Quest fetched. Let's go!")}>
      <QuestToyIcon /><span>Fetch</span></button>}
    {quest.status === "accepted" && <button className="toy-complete" disabled={busy}
      title="Mark adventure complete" aria-label={`Complete quest: ${quest.title}`}
      onClick={() => void run(() => dispatch({ type: "complete-quest", id: quest.id }), "A little adventure, a little growth.")}>✓</button>}
    {quest.status === "completed" && <span className="toy-done" aria-label="Completed">✦</span>}
    {message && <p className="toy-row-feedback" role="status">{message}</p>}
  </li>;
}
