import { forwardRef } from "react";
import type { AppState } from "../../shared/schema";
import type { Category } from "../world/MemoryCategories";

export const ChatHistory = forwardRef<HTMLDivElement, {
  state: AppState; busy: boolean; onRemember: (index: number, text: string, suggested?: { quote: string; category: Category; replyIndex: number }) => void; onAsk: (index: number, text: string) => void;
  onDismiss: (replyIndex: number, sourceIndex: number, quote: string) => void;
}>(function ChatHistory({ state, busy, onRemember, onAsk, onDismiss }, ref) {
  return <div ref={ref} className="chat-history" aria-label="Conversation history" role="log">
    {state.chat.messages.length === 0 && <p>What would you like to work on together?</p>}
    {state.chat.messages.map((entry, index) => <p key={index}><strong>{entry.role === "user" ? "You" : state.pet.name}:</strong> {entry.text}
      {entry.role === "user" && <><button type="button" disabled={busy} onClick={() => onRemember(index, entry.text)}>Remember</button>
        <button type="button" disabled={busy} onClick={() => onAsk(index, entry.text)}>Ask dog</button></>}
      {entry.role === "dog" && entry.memorySuggestion && state.chat.messages[entry.memorySuggestion.sourceIndex]?.role === "user" && <>
        <span> Remember: {entry.memorySuggestion.quote}</span><button type="button" disabled={busy} onClick={() => {
          const suggestion = entry.memorySuggestion!;
          onRemember(suggestion.sourceIndex, state.chat.messages[suggestion.sourceIndex].text, { ...suggestion, replyIndex: index });
        }}>Review memory</button><button type="button" disabled={busy} onClick={() => onDismiss(index, entry.memorySuggestion!.sourceIndex, entry.memorySuggestion!.quote)}>Dismiss suggestion</button></>}</p>)}
  </div>;
});
