import { useEffect, useRef, useState } from "react";
import type { AppState } from "../../shared/schema";
import { dispatch } from "../../state/store";
import { localChat } from "../../services/localChat";
import { replyRequest } from "./replyRequest";
import { saveChatMessage } from "../../services/saveChatMessage";

export function useChatReply(state: AppState, includeRecent: boolean, setBusy: (value: boolean) => void, setMessage: (value: string) => void) {
  const gate = useRef(replyRequest<Awaited<ReturnType<typeof localChat>>>());
  const mounted = useRef(true);
  const [replying, setReplying] = useState(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; gate.current.dispose(); }; }, []);
  function start(index: number, text: string) {
    if (!mounted.current) return;
    setBusy(true); setReplying(true); setMessage("");
    void gate.current.run(() => localChat(text, state, undefined, { includeRecent, beforeIndex: index }),
      async (result) => { setReplying(false); await dispatch({ type: "chat-reply", messageIndex: index, originalText: text, ...result }); },
      () => setMessage("The dog could not reply. Use Ask dog on your message to try again."),
      () => { setBusy(false); setReplying(false); });
  }
  async function share(value: string) {
    setBusy(true);
    try { await saveChatMessage(value, state, dispatch, start); }
    catch (error) { if (mounted.current) setBusy(false); throw error; }
    return "";
  }
  function stop() {
    if (!gate.current.cancel()) return;
    setReplying(false); setBusy(false); setMessage("Stopped waiting. Your message remains in chat.");
  }
  return { start, share, stop, replying };
}
