import { possibleRepeat, type ChatDraft } from "./planReview";

export function PlanPreview({ draft, onSkip }: { draft: ChatDraft; onSkip: () => void }) {
  return <>
    {draft.explanation && <p>{draft.explanation}</p>}
    {draft.steps.length > 1 && <><p>Plan preview (only the first quest is accepted; later steps remain suggestions):</p>
      <ol>{draft.steps.map((step, index) => <li key={index}>{step.title} · {step.minutes} min</li>)}</ol></>}
    {possibleRepeat(draft.previousQuest?.title, draft.quest.title) && <p>Some words match your completed quest. Check whether you want to repeat this step.</p>}
    {!draft.usesSavedPlan && draft.steps.length > 1 && <button type="button" onClick={onSkip}>Skip this step</button>}
  </>;
}
