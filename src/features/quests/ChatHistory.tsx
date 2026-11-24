import { forwardRef } from "react";
import type { AppState } from "../../shared/schema";
import type { Category } from "../world/MemoryCategories";

export const ChatHistory = forwardRef<HTMLDivElement, {
  state: AppState; busy: boolean; onRemember: (index: number, text: string, suggested?: { quote: string; category: Category; replyIndex: number }) => void; onAsk: (index: number, text: string) => void;
  onDismiss: (replyIndex: number, sourceIndex: number, quote: string) => void;
  onPlan: (index: number, text: string, suggestionReplyIndex?: number) => void;
  onDismissQuest: (replyIndex: number, sourceIndex: number) => void;
  onExclude: (index: number, text: string, excluded: boolean) => void;
}>(function ChatHistory({ state, busy, onRemember, onAsk, onDismiss, onPlan, onDismissQuest, onExclude }, ref) {
  return <div ref={ref} className="chat-history" aria-label="Conversation history" role="log">
    {state.chat.messages.length === 0 && <p>What would you like to work on together?</p>}
    {state.chat.messages.map((entry, index) => <div key={index}><strong>{entry.role === "user" ? "You" : state.pet.name}:</strong> {entry.text}
      {entry.role === "user" && <><button type="button" disabled={busy || state.chat.phase !== "goal"} onClick={() => onPlan(index, entry.text)}>Make a quest</button>
      <details><summary>Message actions</summary>
        <button type="button" disabled={busy} onClick={() => onRemember(index, entry.text)}>Remember</button>
        <button type="button" disabled={busy} onClick={() => onAsk(index, entry.text)}>Ask dog</button>
        <button type="button" disabled={busy} onClick={() => onExclude(index, entry.text, !entry.contextExcluded)}>{entry.contextExcluded ? "Allow in recent context" : "Exclude from recent context"}</button>
      </details></>}
      {entry.role === "dog" && entry.memorySuggestion && state.chat.messages[entry.memorySuggestion.sourceIndex]?.role === "user" && <>
        <span> Remember: {entry.memorySuggestion.quote}</span><button type="button" disabled={busy} onClick={() => {
          const suggestion = entry.memorySuggestion!;
          onRemember(suggestion.sourceIndex, state.chat.messages[suggestion.sourceIndex].text, { ...suggestion, replyIndex: index });
        }}>Review memory</button><button type="button" disabled={busy} onClick={() => onDismiss(index, entry.memorySuggestion!.sourceIndex, entry.memorySuggestion!.quote)}>Dismiss suggestion</button></>}
      {entry.role === "dog" && entry.questSuggestion && state.chat.messages[entry.questSuggestion.sourceIndex]?.role === "user" && <>
        <span> Want to make a plan?</span><button type="button" disabled={busy || state.chat.phase !== "goal"} onClick={() => {
          const source = entry.questSuggestion!.sourceIndex; onPlan(source, state.chat.messages[source].text, index);
        }}>Plan together</button><button type="button" disabled={busy} onClick={() => onDismissQuest(index, entry.questSuggestion!.sourceIndex)}>Not now</button></>}</div>)}
  </div>;
});
