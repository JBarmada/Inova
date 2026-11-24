import { useState } from "react";
import type { AppState } from "../../shared/schema";
import { dispatch } from "../../state/store";
import { prepareQuest } from "../../services/prepareQuest";
import { QuestDetailsReview } from "./QuestDetailsReview";

type Draft = Awaited<ReturnType<typeof prepareQuest>>;

export function CompanionChat({ state }: { state: AppState }) {
  const [text, setText] = useState("");
  const [draft, setDraft] = useState<Draft>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function run(work: () => Promise<void>) {
    setBusy(true); setMessage("");
    try { await work(); } catch (error) { setMessage(error instanceof Error ? error.message : "Please try again."); }
    finally { setBusy(false); }
  }
  async function send() {
    await dispatch({ type: state.chat.phase === "goal" ? "chat-goal" : "chat-context", text });
    setText("");
  }
  async function accept(result: Draft) {
    await dispatch({ type: "accept-planned-quest", commitment: result.commitment, quest: result.quest, memorySnapshot: result.memorySnapshot });
    setDraft(undefined); setMessage("Quest accepted! Find it in Quests.");
  }
  return <details className="companion-chat"><summary>Chat with {state.pet.name}</summary>
    <div className="chat-history" aria-label="Conversation history" role="log">
      {state.chat.messages.length === 0 && <p>What would you like to work on together?</p>}
      {state.chat.messages.map((entry, index) => <p key={index}><strong>{entry.role === "user" ? "You" : state.pet.name}:</strong> {entry.text}</p>)}
    </div>
    {draft ? <QuestDetailsReview draft={draft} onSave={accept} onCancel={() => setDraft(undefined)} saveLabel="Accept quest" /> : <>
      {state.chat.phase !== "ready" ? <form onSubmit={(event) => { event.preventDefault(); void run(send); }}>
        <label>{state.chat.phase === "goal" ? "Your goal" : "Anything else?"}
          <input value={text} maxLength={240} onChange={(event) => setText(event.target.value)} disabled={busy} required /></label>
        <button disabled={busy || !text.trim()}>Send</button>
        {state.chat.phase === "context" && <button type="button" disabled={busy} onClick={() => void run(() => dispatch({ type: "chat-skip" }))}>Skip</button>}
      </form> : <button disabled={busy} onClick={() => void run(async () => setDraft(await prepareQuest(state.chat.goal, state)))}>Make a quest</button>}
      {state.chat.phase !== "goal" && <button type="button" disabled={busy} onClick={() => void run(() => dispatch({ type: "chat-reset" }))}>Start over</button>}
    </>}
    {state.chat.messages.length > 0 && <button type="button" disabled={busy} onClick={() => void run(async () => {
      await dispatch({ type: "chat-clear" }); setDraft(undefined); setText("");
    })}>Clear conversation</button>}
    {busy && <p role="status">Thinking…</p>}
    {message && <p role="status">{message}</p>}
  </details>;
}
