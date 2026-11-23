import { useState } from "react";
import type { prepareQuest } from "../../services/prepareQuest";
import { reviewQuestDetails } from "./reviewQuestDetails";

type Draft = Awaited<ReturnType<typeof prepareQuest>>;
export function QuestDetailsReview({ draft, onSave, onCancel }: {
  draft: Draft; onSave: (draft: Draft) => Promise<void>; onCancel: () => void;
}) {
  const [deadline, setDeadline] = useState(draft.details?.deadlineLocal ?? "");
  const [effort, setEffort] = useState(draft.details?.effortMinutes?.toString() ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function save() {
    try {
      const reviewed = reviewQuestDetails(draft, deadline, effort);
      setBusy(true);
      await onSave(reviewed);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save. Please try again."); }
    finally { setBusy(false); }
  }
  return <div className="quest-details-review">
    <p>Check the details I found:</p>
    <label>Deadline (your local time) <input type="datetime-local" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label>
    <label>Total effort (minutes) <input type="number" min="1" max="10080" value={effort} onChange={(event) => setEffort(event.target.value)} /></label>
    {effort && <p>The quest will fit within your total effort.</p>}
    <button type="button" disabled={busy} onClick={() => void save()}>Add quest</button>
    <button type="button" disabled={busy} onClick={onCancel}>Back</button>
    {error && <p role="alert">{error}</p>}
  </div>;
}
