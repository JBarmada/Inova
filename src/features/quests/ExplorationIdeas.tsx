import { useState } from "react";
import { dispatch, useInova } from "../../state/store";
import { newId, now } from "../../shared/actions";
import { useAction } from "../../shared/useAction";
import { playCue } from "../../services/audio";
import { explorationIdea, type Challenge, type ExplorationIdea } from "./explorationIdea";

export function ExplorationIdeas() {
  const state = useInova();
  const [interest, setInterest] = useState("");
  const [minutes, setMinutes] = useState("10");
  const [challenge, setChallenge] = useState<Challenge>("gentle");
  const [idea, setIdea] = useState<ExplorationIdea | null>(null);
  const [saved, setSaved] = useState(false);
  const { run, busy, message } = useAction();
  const duration = idea ? Math.min(idea.minutes, state.settings.questMinuteLimit || 120) : 0;
  async function save() {
    if (!idea) return;
    const commitment = { id: newId(), title: `Explore ${idea.interest}`, createdAt: now() };
    const quest = { id: newId(), commitmentId: commitment.id, title: idea.title,
      reason: "A sample idea based on the interest, time, and challenge you entered. No calendar was checked.",
      sourceIds: [commitment.id], minutes: duration, status: "proposed" as const, planner: "sample" as const };
    await dispatch({ type: "add-exploration", commitment, quest });
    setSaved(true);
  }
  return <details className="exploration-ideas"><summary onClick={() => playCue("click", state.settings.muted)}>Explore something new</summary>
    <p>Make an on-demand idea for this month. It uses only the details you enter and does not check your calendar.</p>
    <form onSubmit={(event) => { event.preventDefault(); void run(async () => {
      setIdea(explorationIdea(interest, Number(minutes), challenge, new Date())); setSaved(false);
      playCue("click", state.settings.muted);
    }, ""); }}>
      <label>An interest<input required maxLength={240} value={interest} onChange={(event) => setInterest(event.target.value)} /></label>
      <label>Minutes available<input required type="number" min="1" max="120" step="1" value={minutes} onChange={(event) => setMinutes(event.target.value)} /></label>
      <label>Challenge<select value={challenge} onChange={(event) => setChallenge(event.target.value as Challenge)}>
        <option value="gentle">Gentle</option><option value="explore">Explore</option><option value="stretch">Stretch</option>
      </select></label><button disabled={busy}>Make an idea</button>
    </form>
    {idea && <div><p>Idea for {idea.month} · {duration} minutes</p><p>{idea.title}</p>
      <button disabled={busy || saved || !state.pet.adopted} onClick={() => void run(save, "Exploration quest proposed.")}>{saved ? "Added to quests" : "Add as quest"}</button></div>}
    {message && <p role="status">{message}</p>}
  </details>;
}
