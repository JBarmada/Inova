import { useEffect, useRef, useState } from "react";
import type { AppState } from "../../shared/schema";
import { dispatch } from "../../state/store";
import { prepareChatPlan } from "../../services/prepareChatPlan";
import { QuestDetailsReview } from "./QuestDetailsReview";
import { latestPlanRequest } from "./latestPlan";
import { ChatReflection } from "./ChatReflection";
import { prepareSavedPlan } from "../../services/savedPlan";
import { ChatMemory } from "./ChatMemory";
import { ChatShare } from "./ChatShare";
import { localChat } from "../../services/localChat";
import { ChatHistory } from "./ChatHistory";
import { shareAndReply } from "../../services/shareAndReply";
import type { Category } from "../world/MemoryCategories";
import { ChatContextToggle } from "./ChatContextToggle";
import { useChatAutoScroll } from "./useChatAutoScroll";

type Draft = Awaited<ReturnType<typeof prepareChatPlan>> & { usesSavedPlan?: boolean };

export function CompanionChat({ state }: { state: AppState }) {
  const [text, setText] = useState("");
  const [draft, setDraft] = useState<Draft>();
  const [busy, setBusy] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [message, setMessage] = useState("");
  const [remember, setRemember] = useState<{ index: number; text: string; suggested?: { quote: string; category: Category; replyIndex: number } }>();
  const [includeRecent, setIncludeRecent] = useState(false);
  const history = useChatAutoScroll(state.chat.messages.length);
  const reflectionQuest = state.quests.find((quest) => quest.id === state.chat.pendingReflections[0] && quest.status === "completed");
  const request = useRef(latestPlanRequest<Draft>());
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
    await dispatch({ type: "accept-planned-quest", commitment: result.commitment, quest: { ...result.quest, futureSteps: result.steps.slice(1).map(({ title, reason, minutes }) => ({ title, reason, minutes })) }, memorySnapshot: result.memorySnapshot, previousQuest: result.previousQuest, consumesSavedPlan: result.usesSavedPlan });
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
    <ChatHistory ref={history} state={state} busy={busy} onRemember={(index, text, suggested) => setRemember({ index, text, suggested })}
      onPlan={(messageIndex, originalText, suggestionReplyIndex) => void run(() => dispatch({ type: "chat-plan-message", messageIndex, originalText, suggestionReplyIndex }))}
      onDismissQuest={(replyIndex, sourceIndex) => void run(() => dispatch({ type: "dismiss-quest-suggestion", replyIndex, sourceIndex }))}
      onDismiss={(replyIndex, sourceIndex, quote) => void run(() => dispatch({ type: "dismiss-memory-suggestion", replyIndex, sourceIndex, quote }))}
      onAsk={(index, text) => void run(async () => { const result = await localChat(text, state, undefined, { includeRecent, beforeIndex: index });
        await dispatch({ type: "chat-reply", messageIndex: index, originalText: text, ...result }); })} />
    {remember && <ChatMemory key={`${remember.index}:${remember.text}:${remember.suggested?.quote ?? ""}`} index={remember.index} original={remember.text} suggested={remember.suggested}
      onCancel={() => setRemember(undefined)} onDone={() => { setRemember(undefined); setMessage("Saved to Memories."); }} />}
    <ChatContextToggle enabled={includeRecent} busy={busy} onChange={setIncludeRecent} />
    <ChatShare busy={busy} onSend={async (value) => { setBusy(true); setMessage("");
      try { return await shareAndReply(value, state, dispatch, undefined, includeRecent); } finally { setBusy(false); } }} />
    {reflectionQuest && <ChatReflection key={reflectionQuest.id} quest={reflectionQuest} onDone={setMessage} />}
    {state.chat.contextQuestId && <p>Continuing: {state.chat.goal}</p>}
    {!reflectionQuest && !draft && state.chat.phase === "goal" && state.chat.followUpQuestId && <button type="button" disabled={busy}
      onClick={() => void run(() => dispatch({ type: "chat-follow-up", questId: state.chat.followUpQuestId! }))}>Plan the next step</button>}
    {draft ? <>
      {draft.explanation && <p>{draft.explanation}</p>}
      {draft.steps.length > 1 && <><p>Plan preview (only the first quest is accepted; later steps remain suggestions):</p>
        <ol>{draft.steps.map((step, index) => <li key={index}>{step.title} · {step.minutes} min</li>)}</ol></>}
      <QuestDetailsReview draft={draft} onSave={(reviewed) => accept({ ...draft, ...reviewed })} onCancel={() => setDraft(undefined)} saveLabel="Accept first quest" />
    </> : <>
      {state.chat.phase !== "ready" ? <form onSubmit={(event) => { event.preventDefault(); void run(send); }}>
        <label>{state.chat.phase === "goal" ? "Your goal" : "Anything else?"}
          <input value={text} maxLength={240} onChange={(event) => setText(event.target.value)} disabled={busy} required /></label>
        <button disabled={busy || !text.trim()}>Send</button>
        {state.chat.phase === "context" && <button type="button" disabled={busy} onClick={() => void run(() => dispatch({ type: "chat-skip" }))}>Skip</button>}
      </form> : <>
        {state.quests.find((quest) => quest.id === state.chat.contextQuestId)?.futureSteps?.length ? <button type="button" disabled={busy} onClick={() => void run(async () => setDraft(prepareSavedPlan(state)))}>Review saved next step</button> : null}
        <button disabled={busy} onClick={() => void plan()}>Make a new plan</button>
      </>}
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
