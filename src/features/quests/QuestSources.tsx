import type { AppState, Quest } from "../../shared/schema";
import { formatDeadline } from "./commitmentDetails";
import { playCue } from "../../services/audio";

export function QuestSources({ quest, state }: { quest: Quest; state: AppState }) {
  const commitment = state.commitments.find((entry) => entry.id === quest.commitmentId);
  const memories = state.memories.filter((entry) => entry.aiAllowed && quest.sourceIds.includes(entry.id));
  return <details className="quest-sources"><summary onClick={() => playCue("click", state.settings.muted)}>View suggestion context</summary>
    {commitment && <p><strong>Commitment:</strong> {commitment.title}{commitment.deadline && <> · Due {formatDeadline(commitment.deadline)}</>}{commitment.effortMinutes && <> · {commitment.effortMinutes} min estimated total</>}</p>}
    {memories.length > 0 ? <><p>Reflections provided to the {quest.planner === "local" ? "local AI" : "sample planner"}:</p>
      <ul>{memories.map((memory) => <li key={memory.id}><time dateTime={memory.createdAt}>
        {new Date(memory.createdAt).toLocaleDateString()}</time>: {memory.text}</li>)}</ul></>
      : <p>No reflections currently linked.</p>}
    <p>Manage reflection permissions in Memories.</p>
  </details>;
}
