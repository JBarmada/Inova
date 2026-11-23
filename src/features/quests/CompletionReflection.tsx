import { useState } from "react";
import { dispatch, useInova } from "../../state/store";
import { newId, now } from "../../shared/actions";
import { useAction } from "../../shared/useAction";
import { playCue } from "../../services/audio";

export function CompletionReflection({ questId }: { questId: string }) {
  const state = useInova();
  const [text, setText] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [saved, setSaved] = useState(false);
  const { run, busy, message } = useAction();
  return <details className="completion-reflection"><summary onClick={() => playCue("click", state.settings.muted)}>Add an optional reflection</summary>
    {saved ? <p role="status">Reflection saved to Memories.</p> : <form onSubmit={(event) => {
      event.preventDefault(); void run(async () => {
        await dispatch({ type: "add-memory", memory: { id: newId(), text, createdAt: now(), aiAllowed: allowed, questId } });
        setSaved(true);
      }, "");
    }}><label>What helped?<textarea required maxLength={4000} value={text} onChange={(event) => setText(event.target.value)} /></label>
      <label className="checkbox"><input type="checkbox" checked={allowed} onChange={(event) => setAllowed(event.target.checked)} />Allow this entry to inform suggestions</label>
      <button disabled={busy}>Save reflection</button></form>}
    {message && <p role="status">{message}</p>}
  </details>;
}
