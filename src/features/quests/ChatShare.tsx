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
    <label>Message your dog<input value={text} maxLength={240} onChange={(event) => setText(event.target.value)} disabled={busy} placeholder="What's on your mind?" required /></label>
    <button disabled={busy || !text.trim()}>Send</button>
    {error && <p role="alert">{error}</p>}
  </form>;
}
