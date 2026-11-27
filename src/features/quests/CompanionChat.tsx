import { useEffect, useRef, useState } from "react";
import type { AppState } from "../../shared/schema";
import { dispatch } from "../../state/store";
import { prepareChatPlan } from "../../services/prepareChatPlan";
import { latestPlanRequest } from "./latestPlan";
import { ChatReflection } from "./ChatReflection";
import { ChatMemory } from "./ChatMemory";
import { ChatShare } from "./ChatShare";
import { ChatHistory } from "./ChatHistory";
import type { Category } from "../world/MemoryCategories";
import { ChatContextToggle } from "./ChatContextToggle";
import { useChatAutoScroll } from "./useChatAutoScroll";
import { useChatReply } from "./useChatReply";
import { retainedPlanSteps } from "./retainedPlanSteps";
import { FollowUpOptions } from "./FollowUpOptions";
import { PlanPreview } from "./PlanPreview";
import { skipFirstPlanStep, type ChatDraft } from "./planReview";
import { sendPlanningReply } from "./sendPlanningReply";

type Draft = ChatDraft;

export function CompanionChat({ state }: { state: AppState }) {
  const [text, setText] = useState("");
  const [draft, setDraft] = useState<Draft>();
  const [busy, setBusy] = useState(false); const [planning, setPlanning] = useState(false);
  const [message, setMessage] = useState("");
  const [remember, setRemember] = useState<{ index: number; text: string; suggested?: { quote: string; category: Category; replyIndex: number } }>();
  const [includeRecent, setIncludeRecent] = useState(true);
  const chatReply = useChatReply(state, includeRecent, setBusy, setMessage);
  const history = useChatAutoScroll(state.chat.messages.length);
  const reflectionQuest = state.quests.find((quest) => quest.id === state.chat.pendingReflections[0] && quest.status === "completed");
  const request = useRef(latestPlanRequest<Draft>());
  const plannedGoal = useRef("");
  useEffect(() => () => { request.current.invalidate(); }, []);
  useEffect(() => {
    if (state.chat.phase !== "ready") { plannedGoal.current = ""; return; }
    if (!state.chat.goal || draft || busy || plannedGoal.current === state.chat.goal) return;
    plannedGoal.current = state.chat.goal;
    void plan();
  }, [state.chat.phase, state.chat.goal, busy, draft]);
  async function run(work: () => Promise<void>) {
    setBusy(true); setMessage("");
    try { await work(); } catch (error) { setMessage(error instanceof Error ? error.message : "Please try again."); }
    finally { setBusy(false); }
  }
  async function send() { await sendPlanningReply(text, state.chat.goal, chatReply.share, dispatch); setText(""); }
  async function accept(result: Draft) {
    const futureSteps = retainedPlanSteps(result.steps, result.quest.title);
    await dispatch({ type: "accept-planned-quest", commitment: result.commitment, quest: { ...result.quest, futureSteps }, memorySnapshot: result.memorySnapshot, previousQuest: result.previousQuest, consumesSavedPlan: result.usesSavedPlan, savedPlanSnapshot: result.usesSavedPlan ? result.savedPlanSnapshot ?? result.steps : undefined, savedPlanSkipped: result.savedPlanSkipped });
    setDraft(undefined); setMessage("Quest accepted! Find it in Quests.");
  }
  async function plan() {
    setBusy(true); setPlanning(true); setMessage("");
    await request.current.run(
      () => prepareChatPlan(state.chat.goal, state),
      setDraft, (error) => setMessage(error instanceof Error ? error.message : "Please try again."),
      () => { setBusy(false); setPlanning(false); });
  }
  function stopPlanning() { request.current.invalidate(); setBusy(false); setPlanning(false); setMessage("Stopped waiting. Your goal is still here."); }
  return <section className="companion-chat" aria-label={`Chat with ${state.pet.name}`}>
    {!reflectionQuest && !remember && !draft && state.chat.phase === "goal" && <ChatShare busy={busy} onSend={chatReply.share} />}
    <ChatContextToggle enabled={includeRecent} busy={busy} onChange={setIncludeRecent} />
    <ChatHistory ref={history} state={state} busy={busy} onRemember={(index, text, suggested) => setRemember({ index, text, suggested })}
      onPlan={(messageIndex, originalText, suggestionReplyIndex) => void run(() => dispatch({ type: "chat-plan-message", messageIndex, originalText, suggestionReplyIndex }))}
      onDismissQuest={(replyIndex, sourceIndex) => void run(() => dispatch({ type: "dismiss-quest-suggestion", replyIndex, sourceIndex }))}
      onDismiss={(replyIndex, sourceIndex, quote) => void run(() => dispatch({ type: "dismiss-memory-suggestion", replyIndex, sourceIndex, quote }))}
      onExclude={(messageIndex, originalText, excluded) => void run(() => dispatch({ type: "chat-context-exclusion", messageIndex, originalText, excluded }))}
      onAsk={chatReply.start} />
    {remember && <ChatMemory key={`${remember.index}:${remember.text}:${remember.suggested?.quote ?? ""}`} index={remember.index} original={remember.text} suggested={remember.suggested} memories={state.memories}
      onCancel={() => setRemember(undefined)} onDone={(updated) => { setRemember(undefined); setMessage(updated ? "Memory updated." : "Saved to Memories."); }} />}
    {reflectionQuest && <ChatReflection key={reflectionQuest.id} quest={reflectionQuest} onDone={setMessage} />}
    {state.chat.contextQuestId && <p>Continuing: {state.chat.goal}</p>}
    {!reflectionQuest && !draft && state.chat.phase === "goal" && <FollowUpOptions state={state} busy={busy}
      onChoose={(questId) => void run(() => dispatch({ type: "chat-follow-up", questId }))} />}
    {draft ? <div className="chat-plan-review">
      <PlanPreview draft={draft} onSkip={() => setDraft(skipFirstPlanStep(draft))} />
      <p><strong>{draft.quest.title}</strong> · {draft.quest.minutes} min</p>
      <p>{draft.quest.reason}</p>
      <button disabled={busy} onClick={() => void run(() => accept(draft))}>Accept first quest</button>
      <button disabled={busy} onClick={() => { setDraft(undefined); void run(() => dispatch({ type: "chat-reset" })); }}>Not now</button>
    </div> : state.chat.phase === "context" ? <form onSubmit={(event) => { event.preventDefault(); void run(send); }}>
      <div className="chat-input-wrap"><input aria-label="Your reply" placeholder="What's on your mind?" value={text} maxLength={240}
        onChange={(event) => setText(event.target.value)} disabled={busy || chatReply.replying} required /><button disabled={busy || chatReply.replying || !text.trim()}>Send</button></div>
    </form> : null}
    {state.chat.phase === "ready" && !draft && !busy && message && <button type="button" onClick={() => void plan()}>Try again</button>}
    {state.chat.messages.length > 0 && <button type="button" disabled={busy} onClick={() => void run(async () => {
      await dispatch({ type: "chat-clear" }); setDraft(undefined); setText(""); chatReply.clearRetry();
    })}>Clear conversation</button>}
    {busy && <p role="status">Thinking…</p>}
    {chatReply.replying && <button type="button" onClick={chatReply.stop}>Stop waiting</button>}
    {planning && <button type="button" onClick={stopPlanning}>Stop waiting for plan</button>}
    {message && <p role="status">{message}</p>}
    {chatReply.retryMessage && <button type="button" disabled={busy} onClick={() => chatReply.start(chatReply.retryMessage!.index, chatReply.retryMessage!.text)}>Try again</button>}
  </section>;
}
