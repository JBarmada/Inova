import { useRef, useState } from "react";
import type { Quest } from "../../shared/schema";
import { dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { playCue } from "../../services/audio";
import { ToyQuestRow } from "./ToyQuestRow";

export function ToyQuestList({ quests, muted }: { quests: Quest[]; muted: boolean }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const completedToggle = useRef<HTMLButtonElement>(null);
  const { run, busy, message } = useAction();
  const active = quests.filter((quest) => quest.status !== "completed");
  const completed = quests.filter((quest) => quest.status === "completed");
  function act(quest: Quest) {
    const finishing = quest.status === "accepted";
    void run(async () => {
      await dispatch(finishing ? { type: "complete-quest", id: quest.id }
        : { type: "quest-status", id: quest.id, status: "accepted" });
      if (finishing) requestAnimationFrame(() => completedToggle.current?.focus());
    }, finishing ? "Adventure complete! Saved under Completed." : "Quest fetched. Let's go!");
  }
  return <div className="toy-quest-list">
    {message && <p className="toy-row-feedback" role="status">{message}</p>}
    {active.length > 0 && <ul className="toy-quest-items" aria-label="Active quests">
      {active.map((quest) => <ToyQuestRow key={quest.id} quest={quest} busy={busy} onAction={act} />)}
    </ul>}
    {completed.length > 0 && <>
      <button ref={completedToggle} className="toy-completed-toggle" aria-expanded={showCompleted} aria-controls="toy-completed-quests"
        onClick={() => { setShowCompleted(!showCompleted); playCue("click", muted); }}>
        <span aria-hidden="true">{showCompleted ? "▾" : "▸"}</span> Completed ({completed.length})
      </button>
      <ul id="toy-completed-quests" className="toy-quest-items" aria-label="Completed quests" hidden={!showCompleted}>
        {completed.map((quest) => <ToyQuestRow key={quest.id} quest={quest} busy={busy} onAction={act} />)}
      </ul>
    </>}
  </div>;
}
