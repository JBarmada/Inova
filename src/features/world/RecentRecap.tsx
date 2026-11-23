import { playCue } from "../../services/audio";
import type { AppState } from "../../shared/schema";
import { recentRecap } from "./recapData";

export function RecentRecap({ state }: { state: AppState }) {
  const recap = recentRecap(state, Date.now());
  return <details className="recent-recap"><summary onClick={() => playCue("click", state.settings.muted)}>Last 7 days</summary>
    <p>{recap.quests.length} completed {recap.quests.length === 1 ? "adventure" : "adventures"} · {recap.memoryCount} {recap.memoryCount === 1 ? "memory" : "memories"} saved</p>
    {recap.quests.length > 0 && <ul>{recap.quests.map((quest) => <li key={quest.id}>
      {quest.title} <time dateTime={quest.completedAt}>{new Date(quest.completedAt!).toLocaleDateString()}</time>
    </li>)}</ul>}
    {recap.quests.length === 0 && recap.memoryCount === 0 && <p>No dated activity in the last 7 days.</p>}
    {recap.undatedCount > 0 && <p>{recap.undatedCount} earlier completed {recap.undatedCount === 1 ? "adventure has" : "adventures have"} no recorded completion date and {recap.undatedCount === 1 ? "is" : "are"} excluded.</p>}
  </details>;
}
