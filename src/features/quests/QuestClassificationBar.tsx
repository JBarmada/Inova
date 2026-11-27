import type { AppState } from "../../shared/schema";
import { classifyQuest, questCategoryLabel } from "../../shared/questClassification";

export function QuestClassificationBar({ state }: { state: AppState }) {
  if (!state.settings.devMode || !state.quests.length) return null;
  return <details className="quest-classification-bar" aria-label="Developer quest bar">
    <summary>Quest classifications</summary>
    <ul>{state.quests.map((quest) =>
      <li key={quest.id}>{quest.title} · {classifyQuest(quest, state.commitments).map(questCategoryLabel).join(", ")}</li>
    )}</ul>
  </details>;
}
