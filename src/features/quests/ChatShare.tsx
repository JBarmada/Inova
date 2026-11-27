import { useState } from "react";

export function ChatShare({ busy, onSend }: { busy: boolean; onSend: (text: string) => Promise<string> }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  async function send() {
    setError("");
    try { const result = await onSend(text); setText(""); setError(result); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); }
  }
  return <form onSubmit={(event) => { event.preventDefault(); void send(); }}>
    <div className="chat-input-wrap"><input aria-label="Message your dog" value={text} maxLength={240} onChange={(event) => setText(event.target.value)} disabled={busy} placeholder="What's on your mind?" required />
    <button disabled={busy || !text.trim()}>Send</button></div>
    {error && <p role="alert">{error}</p>}
  </form>;
}
