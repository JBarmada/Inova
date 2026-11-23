import { useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { newId, now } from "../../shared/actions";
import { proposeLocal } from "../../services/localPlanner";
import { samplePlanner } from "../../services/planner";
import { QuestCard } from "./QuestCard";

export function QuestsPanel() {
  const state = useInova();
  const [title, setTitle] = useState("");
  const [planning, setPlanning] = useState(false);
  const { run, busy, message } = useAction();
  async function add() {
    await dispatch({ type: "add-commitment", commitment: { id: newId(), title, createdAt: now() } });
    setTitle("");
  }
  return <section><p className="eyebrow">ONE SMALL STEP</p><h2>What would you like to start?</h2>
    <p>Choose a local AI suggestion or the deterministic sample. Local AI requires Ollama with gemma3:12b; only reflections you permit are included.</p>
    <form onSubmit={(event) => { event.preventDefault(); void run(add); }}>
      <label>A commitment<input required maxLength={4000} value={title} placeholder="Start my project outline" onChange={(event) => setTitle(event.target.value)} /></label>
      <button disabled={busy || !state.pet.adopted}>Add commitment</button>
    </form>
    {!state.pet.adopted && <p>Adopt your dog before beginning quests.</p>}
    {state.commitments.map((entry) => <div className="commitment" key={entry.id}><span>{entry.title}</span>
      <div className="actions"><button disabled={busy} onClick={() => void run(async () => {
        setPlanning(true);
        try {
          const result = await proposeLocal(entry, state);
          await dispatch({ type: "propose-quest", ...result });
        } finally { setPlanning(false); }
      }, "Local AI quest proposed.")}>Make local AI quest</button>
      <button disabled={busy} onClick={() => void run(async () => {
        const quest = await samplePlanner.propose(entry, state);
        await dispatch({ type: "propose-quest", quest });
      }, "Sample quest proposed.")}>Make sample quest</button></div></div>)}
    {planning && <p role="status">Your dog is thinking with local AI…</p>}
    {message && <p role="status">{message}</p>}
    {state.quests.length === 0 && <p className="empty">Your first small adventure goes here.</p>}
    {state.quests.map((quest) => <QuestCard quest={quest} key={quest.id} />)}
  </section>;
}
