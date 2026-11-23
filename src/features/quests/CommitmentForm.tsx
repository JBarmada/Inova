import { useState } from "react";
import { dispatch } from "../../state/store";
import { newId, now } from "../../shared/actions";
import { useAction } from "../../shared/useAction";
import { deadlineFromLocal } from "./commitmentDetails";

export function CommitmentForm({ adopted }: { adopted: boolean }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [effort, setEffort] = useState("");
  const { run, busy, message } = useAction();
  async function add() {
    const due = deadlineFromLocal(deadline);
    const effortMinutes = effort ? Number(effort) : undefined;
    if (effortMinutes !== undefined && (!Number.isInteger(effortMinutes) || effortMinutes < 1 || effortMinutes > 10080))
      throw Error("Total effort must be 1–10080 whole minutes.");
    await dispatch({ type: "add-commitment", commitment: { id: newId(), title, createdAt: now(),
      ...(due ? { deadline: due } : {}), ...(effortMinutes ? { effortMinutes } : {}) } });
    setTitle(""); setDeadline(""); setEffort("");
  }
  return <form onSubmit={(event) => { event.preventDefault(); void run(add, "Commitment saved."); }}>
    <label>A commitment<input required maxLength={4000} value={title} placeholder="Start my project outline" onChange={(event) => setTitle(event.target.value)} /></label>
    <label>Deadline (optional, your local time)<input type="datetime-local" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label>
    <label>Estimated total effort in minutes (optional)<input type="number" min="1" max="10080" step="1" value={effort} onChange={(event) => setEffort(event.target.value)} /></label>
    <button disabled={busy || !adopted}>Add commitment</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
