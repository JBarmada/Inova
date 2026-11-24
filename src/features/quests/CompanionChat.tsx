import { useEffect, useRef, useState } from "react";
import type { AppState } from "../../shared/schema";
import { dispatch } from "../../state/store";
import { prepareChatPlan } from "../../services/prepareChatPlan";
import { QuestDetailsReview } from "./QuestDetailsReview";
import { latestPlanRequest } from "./latestPlan";
import { ChatReflection } from "./ChatReflection";

type Draft = Awaited<ReturnType<typeof prepareChatPlan>>;

export function CompanionChat({ state }: { state: AppState }) {
  const [text, setText] = useState("");
  const [draft, setDraft] = useState<Draft>();
  const [busy, setBusy] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [message, setMessage] = useState("");
  const history = useRef<HTMLDivElement>(null);
  const reflectionQuest = state.quests.find((quest) => quest.id === state.chat.pendingReflections[0] && quest.status === "completed");
  const request = useRef(latestPlanRequest<Draft>());
  useEffect(() => { if (history.current) history.current.scrollTop = history.current.scrollHeight; }, [state.chat.messages.length]);
  useEffect(() => () => { request.current.invalidate(); }, []);
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
  async function plan(sample = false) {
    setBusy(true); setPlanning(true); setMessage("");
    await request.current.run(
      () => sample ? prepareChatPlan(state.chat.goal, state, async () => { throw Error("sample selected"); })
        : prepareChatPlan(state.chat.goal, state),
      setDraft, (error) => setMessage(error instanceof Error ? error.message : "Please try again."),
      () => { setBusy(false); setPlanning(false); });
  }
  return <details className="companion-chat"><summary>Chat with {state.pet.name}</summary>
    <div ref={history} className="chat-history" aria-label="Conversation history" role="log">
      {state.chat.messages.length === 0 && <p>What would you like to work on together?</p>}
      {state.chat.messages.map((entry, index) => <p key={index}><strong>{entry.role === "user" ? "You" : state.pet.name}:</strong> {entry.text}</p>)}
    </div>
    {reflectionQuest && <ChatReflection key={reflectionQuest.id} quest={reflectionQuest} onDone={setMessage} />}
    {draft ? <>
      {draft.explanation && <p>{draft.explanation}</p>}
      {draft.steps.length > 1 && <><p>Possible next steps (only the first is saved if you accept):</p>
        <ol>{draft.steps.map((step, index) => <li key={index}>{step.title} · {step.minutes} min</li>)}</ol></>}
      <QuestDetailsReview draft={draft} onSave={(reviewed) => accept({ ...draft, ...reviewed })} onCancel={() => setDraft(undefined)} saveLabel="Accept first quest" />
    </> : <>
      {state.chat.phase !== "ready" ? <form onSubmit={(event) => { event.preventDefault(); void run(send); }}>
        <label>{state.chat.phase === "goal" ? "Your goal" : "Anything else?"}
          <input value={text} maxLength={240} onChange={(event) => setText(event.target.value)} disabled={busy} required /></label>
        <button disabled={busy || !text.trim()}>Send</button>
        {state.chat.phase === "context" && <button type="button" disabled={busy} onClick={() => void run(() => dispatch({ type: "chat-skip" }))}>Skip</button>}
      </form> : <button disabled={busy} onClick={() => void plan()}>Make a plan</button>}
      {state.chat.phase !== "goal" && <button type="button" disabled={busy} onClick={() => void run(() => dispatch({ type: "chat-reset" }))}>Start over</button>}
    </>}
    {state.chat.messages.length > 0 && <button type="button" disabled={busy} onClick={() => void run(async () => {
      await dispatch({ type: "chat-clear" }); setDraft(undefined); setText("");
    })}>Clear conversation</button>}
    {busy && <p role="status">Thinking…</p>}
    {planning && <button type="button" onClick={() => void plan(true)}>Use sample instead</button>}
    {message && <p role="status">{message}</p>}
  </details>;
}
