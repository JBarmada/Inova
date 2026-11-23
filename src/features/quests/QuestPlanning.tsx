import { useState } from "react";
import type { Quest } from "../../shared/schema";
import { dispatch, useInova } from "../../state/store";
import { now } from "../../shared/actions";
import { useAction } from "../../shared/useAction";
import { playCue } from "../../services/audio";
import { deadlineFromLocal, formatDeadline } from "./commitmentDetails";

export function QuestPlanning({ quest }: { quest: Quest }) {
  const state = useInova();
  const [start, setStart] = useState("");
  const [until, setUntil] = useState("");
  const { run, busy, message } = useAction();
  async function save() {
    const beginning = deadlineFromLocal(start), ending = deadlineFromLocal(until);
    if (!beginning || !ending) throw Error("Enter both ends of your free window.");
    await dispatch({ type: "plan-quest", id: quest.id, request: {
      start: beginning.at, availableUntil: ending.at, timeZone: beginning.timeZone, recordedAt: now(),
    } });
  }
  return <div className="quest-planning">{quest.plan && <p>Planned: {formatDeadline({ at: quest.plan.start, timeZone: quest.plan.timeZone })} – {formatDeadline({ at: quest.plan.end, timeZone: quest.plan.timeZone })}. Calendar not checked.</p>}
    <details><summary onClick={() => playCue("click", state.settings.muted)}>Plan a time</summary>
    <p>Enter a free window. Inova checks the deadline and other saved quest plans, not your calendar.</p>
    <form onSubmit={(event) => { event.preventDefault(); void run(save, "Time saved."); }}>
      <label>Free from (local time)<input required type="datetime-local" value={start} onChange={(event) => setStart(event.target.value)} /></label>
      <label>Free until (local time)<input required type="datetime-local" value={until} onChange={(event) => setUntil(event.target.value)} /></label>
      <button disabled={busy}>Save time</button>
      {quest.plan && <button type="button" disabled={busy} onClick={() => void run(() => dispatch({ type: "clear-quest-plan", id: quest.id }), "Time removed.")}>Remove time</button>}
    </form>{message && <p role="status">{message}</p>}
  </details></div>;
}
