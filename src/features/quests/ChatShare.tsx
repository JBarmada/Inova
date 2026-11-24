import { useState } from "react";

export function ChatShare({ busy, onSend }: { busy: boolean; onSend: (text: string) => Promise<string> }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  async function send() {
    setError("");
    try { const result = await onSend(text); setText(""); setError(result); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); }
  }
  return <details><summary>Share something with your dog</summary>
    <form onSubmit={(event) => { event.preventDefault(); void send(); }}>
      <label>Message<input value={text} maxLength={240} onChange={(event) => setText(event.target.value)} disabled={busy} required /></label>
      <button disabled={busy || !text.trim()}>Send</button>
    </form>
    {error && <p role="alert">{error}</p>}
  </details>;
}
