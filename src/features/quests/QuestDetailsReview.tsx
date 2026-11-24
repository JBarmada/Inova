import { useState } from "react";
import type { prepareQuest } from "../../services/prepareQuest";
import { dateOnlyDeadline, reviewQuestDetails } from "./reviewQuestDetails";

type Draft = Awaited<ReturnType<typeof prepareQuest>>;
export function QuestDetailsReview({ draft, onSave, onCancel, saveLabel = "Add quest", hasFutureSteps = false }: {
  draft: Draft; onSave: (draft: Draft) => Promise<void>; onCancel: () => void;
  saveLabel?: string; hasFutureSteps?: boolean;
}) {
  const [title, setTitle] = useState(draft.quest.title);
  const [questMinutes, setQuestMinutes] = useState(String(draft.quest.minutes));
  const [deadline, setDeadline] = useState(draft.details?.deadlineLocal ?? "");
  const dateOnly = !!draft.details?.deadlineDate && !draft.details?.deadlineLocal;
  const [date, setDate] = useState(draft.details?.deadlineDate ?? "");
  const [time, setTime] = useState("");
  const [effort, setEffort] = useState(draft.details?.effortMinutes?.toString() ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const showDetails = !!(draft.detailsWarning || deadline || date || effort);
  async function save() {
    try {
      const reviewed = reviewQuestDetails(draft, dateOnly ? dateOnlyDeadline(date, time) : deadline, effort, { title, minutes: questMinutes });
      setBusy(true);
      await onSave(reviewed);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save. Please try again."); }
    finally { setBusy(false); }
  }
  return <div className="quest-details-review" role="region" tabIndex={0} aria-label="Review suggested quest">
    <p>{draft.fallback ? "Sample quest" : "Suggested quest"}</p>
    <label>Quest <input value={title} maxLength={4000} onChange={(event) => setTitle(event.target.value)} /></label>
    {title.trim() === draft.quest.title ? <p>{draft.quest.reason}</p> : <p>You edited this quest.</p>}
    {draft.memorySnapshot.length > 0 && <details><summary>Memories included ({draft.memorySnapshot.length})</summary>
      <ul>{draft.memorySnapshot.map((memory) => <li key={memory.id}>{memory.text}</li>)}</ul></details>}
    <label>Quest length (minutes) <input type="number" min="1" max="120" value={questMinutes} onChange={(event) => setQuestMinutes(event.target.value)} /></label>
    {hasFutureSteps && title.trim() !== draft.quest.title && <p>Changing the first quest removes the later suggested steps.</p>}
    {draft.detailsWarning && <p>Some details need your help.</p>}
    <details open={showDetails}><summary>Deadline and effort</summary>
    {dateOnly ? <>
      <label>Deadline date <input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
      {date && <label>Deadline time (your local time) <input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label>}
    </> : <label>Deadline (your local time) <input type="datetime-local" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label>}
    <label>Total effort (minutes) <input type="number" min="1" max="10080" value={effort} onChange={(event) => setEffort(event.target.value)} /></label>
    {effort && <p>The quest will fit within your total effort.</p>}
    </details>
    <button type="button" disabled={busy} onClick={() => void save()}>{saveLabel}</button>
    <button type="button" disabled={busy} onClick={onCancel}>Back</button>
    {error && <p role="alert">{error}</p>}
  </div>;
}
