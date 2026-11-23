import { useEffect, useRef, useState } from "react";
import type { Quest } from "../../shared/schema";
import { dispatch, dispatchWithReceipt } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { playCue } from "../../services/audio";
import { RewardReveal, type CompletionReveal } from "../quests/RewardReveal";
import { ToyQuestRow } from "./ToyQuestRow";

export function ToyQuestList({ quests, muted, mounted }: { quests: Quest[]; muted: boolean; mounted: boolean }) {
  const [reveal, setReveal] = useState<CompletionReveal | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  useEffect(() => { if (!mounted) setShowCompleted(false); }, [mounted]);
  const completedToggle = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const { run, busy, message } = useAction();
  const active = quests.filter((quest) => quest.status !== "completed");
  const completed = quests.filter((quest) => quest.status === "completed");
  function act(quest: Quest) {
    const finishing = quest.status === "accepted";
    void run(async () => {
      if (finishing) {
        const receipt = await dispatchWithReceipt({ type: "complete-quest", id: quest.id, completedAt: new Date().toISOString() });
        setReveal({ ...receipt, questId: quest.id, title: quest.title });
        requestAnimationFrame(() => { if (list.current) list.current.scrollTop = 0; completedToggle.current?.focus({ preventScroll: true }); });
      } else { setReveal(null); await dispatch({ type: "quest-status", id: quest.id, status: "accepted" }); }
    }, finishing ? "" : "Quest fetched. Let's go!");
  }
  return <div ref={list} className="toy-quest-list">
    {reveal && <RewardReveal result={reveal} />}
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
