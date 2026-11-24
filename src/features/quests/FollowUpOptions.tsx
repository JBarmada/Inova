import type { AppState } from "../../shared/schema";
import { followUpIds } from "../../state/followUps";

export function FollowUpOptions({ state, busy, onChoose }: { state: AppState; busy: boolean; onChoose: (id: string) => void }) {
  const quests = followUpIds(state.chat).map((id) => state.quests.find((quest) => quest.id === id && quest.status === "completed")).filter((quest) => quest !== undefined);
  if (!quests.length) return null;
  return <section aria-label="Quest follow-ups"><p>Continue a completed quest:</p>
    {quests.map((quest) => <button key={quest.id} type="button" disabled={busy} onClick={() => onChoose(quest.id)}>Plan next step: {quest.title}</button>)}
  </section>;
}
