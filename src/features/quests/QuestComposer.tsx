import { useEffect, useRef, useState } from "react";
import type { AppState } from "../../shared/schema";
import { dispatch } from "../../state/store";
import { prepareDirectPlan } from "../../services/prepareDirectPlan";
import { QuestDetailsReview } from "./QuestDetailsReview";
import { PlanPreview } from "./PlanPreview";
import { skipFirstPlanStep, type ChatDraft } from "./planReview";
import { retainedPlanSteps } from "./retainedPlanSteps";
import { latestPlanRequest } from "./latestPlan";

type Draft = ChatDraft;
export function QuestComposer({ state, compact = false }: { state: AppState; compact?: boolean }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState<Draft>();
  const request = useRef(latestPlanRequest<Draft>());
  useEffect(() => () => request.current.invalidate(), []);
  async function save(result: Draft) {
    const futureSteps = retainedPlanSteps(result.steps, result.quest.title);
    await dispatch({ type: "accept-direct-plan", commitment: result.commitment, quest: { ...result.quest, futureSteps }, memorySnapshot: result.memorySnapshot });
    setDraft(undefined); setText("");
    setMessage(result.fallback ? "Sample quest accepted." : "Quest accepted.");
  }
  async function submit(sample = false) {
    setBusy(true); setMessage("Thinking…");
    await request.current.run(() => prepareDirectPlan(text, state, sample), (result) => { setMessage(""); setDraft(result); },
      (error) => setMessage(error instanceof Error ? error.message : "Could not plan. Please try again."), () => setBusy(false));
  }
  function stopWaiting() {
    request.current.invalidate(); setBusy(false); setMessage("Stopped waiting. Your goal is still here.");
  }
  return <div className={compact ? "toy-composer-wrap" : "quest-composer-wrap"}>
    {draft ? <div className={compact ? "toy-plan-review" : "quest-plan-review"} role="region" aria-label="Review quest plan" tabIndex={0}>
      <PlanPreview draft={draft} onSkip={() => setDraft(skipFirstPlanStep(draft))} />
      <QuestDetailsReview key={`${draft.quest.id}:${draft.steps.length}:${draft.quest.title}`} draft={draft} onSave={(reviewed) => save({ ...draft, ...reviewed })} onCancel={() => { setDraft(undefined); setMessage(""); }} saveLabel="Accept first quest" hasFutureSteps={draft.steps.length > 1} /></div> :
      <form className={compact ? "toy-composer" : "quest-composer"} onSubmit={(event) => { event.preventDefault(); void submit(); }}>
        <input aria-label="Your next adventure" placeholder="What would you like to do?" value={text} maxLength={240}
          disabled={busy} onChange={(event) => setText(event.target.value)} required />
        <button type="submit" disabled={busy || !text.trim() || !state.pet.adopted} className={compact ? "toy-add" : "primary"}
          aria-label="Make a quest" title="Make a quest">{busy ? "…" : compact ? "✓" : "Make a quest"}</button>
      </form>}
    {busy && <button type="button" onClick={stopWaiting}>Stop waiting</button>}
    {!state.pet.adopted && <p>Adopt your dog to start a quest.</p>}
    {message && <p className={compact ? "toy-composer-feedback" : "quest-composer-feedback"} role="status">{message}</p>}
  </div>;
}
