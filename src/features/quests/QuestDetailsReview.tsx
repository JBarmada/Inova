import { useState } from "react";
import type { prepareQuest } from "../../services/prepareQuest";
import { deadlineFromLocal } from "./commitmentDetails";

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
      const minutes = effort ? Number(effort) : undefined;
      if (minutes !== undefined && (!Number.isInteger(minutes) || minutes < 1 || minutes > 10080))
        throw Error("Enter total effort between 1 and 10080 minutes.");
      if (minutes && draft.quest.minutes > minutes) throw Error("Total effort must cover the suggested quest duration.");
      setBusy(true);
      await onSave({ ...draft, commitment: { ...draft.commitment, deadline: deadlineFromLocal(deadline), effortMinutes: minutes } });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save. Please try again."); }
    finally { setBusy(false); }
  }
  return <div className="quest-details-review">
    <p>Check the details I found:</p>
    <label>Deadline <input type="datetime-local" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label>
    <label>Total effort (minutes) <input type="number" min="1" max="10080" value={effort} onChange={(event) => setEffort(event.target.value)} /></label>
    <button type="button" disabled={busy} onClick={() => void save()}>Add quest</button>
    <button type="button" disabled={busy} onClick={onCancel}>Back</button>
    {error && <p role="alert">{error}</p>}
  </div>;
}
