import { useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { CommitmentForm } from "./CommitmentForm";
import { formatDeadline } from "./commitmentDetails";
import { checkLocalModel, proposeLocal } from "../../services/localPlanner";
import { QuestCard } from "./QuestCard";
import { QuestClassificationBar } from "./QuestClassificationBar";
import { localModelSchema } from "../../shared/schema";

export function QuestsPanel() {
  const state = useInova();
  const [planning, setPlanning] = useState(false);
  const [activeCommitment, setActiveCommitment] = useState<string | null>(null);
  const [modelMessage, setModelMessage] = useState("");
  const { run, busy, message } = useAction();
  return <section><h2>Quests</h2>
    <details><summary>More options</summary>
    <label>Local model<select value={state.settings.localModel} disabled={busy} onChange={(event) => {
      setActiveCommitment(null);
      setModelMessage("");
      const model = localModelSchema.parse(event.target.value);
      void run(() => dispatch({ type: "local-model", model }), "Local model updated.");
    }}><option value="gemma3:12b">Gemma 3 12B · larger, provisional default</option>
      <option value="gemma3:4b">Gemma 3 4B · faster, may be less reliable</option></select></label>
    <button type="button" disabled={busy} onClick={() => { setActiveCommitment(null); void run(async () => {
      try {
        const available = await checkLocalModel(state.settings.localModel);
        setModelMessage(available ? "Selected local model is available." :
          `The selected model is not installed. Run ollama pull ${state.settings.localModel}.`);
      } catch (error) { setModelMessage(error instanceof Error ? error.message : "Could not check local AI. Start Ollama and try again."); }
    }, ""); }}>Check local AI</button>
    {modelMessage && <p role="status">{modelMessage}</p>}
    <label>Maximum suggested quest length<select value={state.settings.questMinuteLimit} disabled={busy} onChange={(event) =>
      { setActiveCommitment(null); void run(() => dispatch({ type: "quest-minute-limit", minutes: Number(event.target.value) }), "Quest length preference updated."); }}>
      <option value="0">No maximum</option><option value="5">5 minutes</option><option value="10">10 minutes</option>
      <option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option>
    </select></label><p>This limit applies to new suggestions; you can still edit a quest yourself.</p>
    <CommitmentForm adopted={state.pet.adopted} />
    {state.commitments.map((entry) => <div className="commitment" key={entry.id}><span>{entry.title}{entry.deadline && <> · Due {formatDeadline(entry.deadline)}</>}{entry.effortMinutes && <> · {entry.effortMinutes} min estimated total</>}</span>
      <div className="actions"><button disabled={busy} onClick={() => { setActiveCommitment(entry.id); void run(async () => {
        setPlanning(true);
        try {
          const result = await proposeLocal(entry, state);
          await dispatch({ type: "propose-quest", ...result });
        } finally { setPlanning(false); }
      }, "Local AI quest proposed."); }}>Make local AI quest</button>
</div>
      {activeCommitment === entry.id && planning && <p role="status">Your dog is thinking with local AI…</p>}
      {activeCommitment === entry.id && message && <p role="status">{message}</p>}</div>)}
    {!activeCommitment && message && <p role="status">{message}</p>}
    </details>
    <QuestClassificationBar state={state} />
    {state.quests.length === 0 && <p className="empty">Your first small adventure goes here.</p>}
    {state.quests.map((quest) => <QuestCard quest={quest} key={quest.id} />)}
  </section>;
}
