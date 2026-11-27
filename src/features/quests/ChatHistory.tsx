import { forwardRef } from "react";
import type { AppState } from "../../shared/schema";
import type { Category } from "../world/MemoryCategories";
import { ChatSources } from "./ChatSources";

export const ChatHistory = forwardRef<HTMLDivElement, {
  state: AppState; busy: boolean; onRemember: (index: number, text: string, suggested?: { quote: string; category: Category; replyIndex: number }) => void; onAsk: (index: number, text: string) => void;
  onDismiss: (replyIndex: number, sourceIndex: number, quote: string) => void;
  onPlan: (index: number, text: string, suggestionReplyIndex?: number) => void;
  onDismissQuest: (replyIndex: number, sourceIndex: number) => void;
  onExclude: (index: number, text: string, excluded: boolean) => void;
}>(function ChatHistory({ state, busy, onRemember, onDismiss }, ref) {
  return <div ref={ref} className="chat-history" aria-label="Conversation history" role="log">
    {state.chat.messages.map((entry, index) => <div key={index}><strong>{entry.role === "user" ? "You" : state.pet.name}:</strong> <span className="chat-message-text">{entry.text}</span>
      {entry.role === "dog" && <ChatSources ids={entry.sourceIds} memories={state.memories} />}
      {entry.role === "dog" && entry.memorySuggestion && state.chat.messages[entry.memorySuggestion.sourceIndex]?.role === "user" && <>
        <span> Remember: {entry.memorySuggestion.quote}</span><button type="button" disabled={busy} onClick={() => {
          const suggestion = entry.memorySuggestion!;
          onRemember(suggestion.sourceIndex, state.chat.messages[suggestion.sourceIndex].text, { ...suggestion, replyIndex: index });
        }}>Review memory</button><button type="button" disabled={busy} onClick={() => onDismiss(index, entry.memorySuggestion!.sourceIndex, entry.memorySuggestion!.quote)}>Dismiss suggestion</button></>}
    </div>)}
  </div>;
});
