import { useState } from "react";
import { dispatch, useInova } from "../../state/store";
import { newId, now } from "../../shared/actions";
import { useAction } from "../../shared/useAction";
import { playCue } from "../../services/audio";
import { emptyPerspective, formatPerspective, perspectiveQuestions } from "./perspective";

export function PerspectiveExercise() {
  const state = useInova();
  const [draft, setDraft] = useState(emptyPerspective);
  const { run, busy, message } = useAction();
  return <details><summary onClick={() => playCue("click", state.settings.muted)}>Explore another perspective</summary>
    <p>These optional prompts are for your own thoughts. Other perspectives are possibilities, not facts. Your draft stays here until you save it or leave this page.</p>
    <form onSubmit={(event) => { event.preventDefault(); void run(async () => {
      const text = formatPerspective(draft);
      await dispatch({ type: "add-memory", memory: { id: newId(), text, createdAt: now(), aiAllowed: false } });
      setDraft(emptyPerspective());
    }, "Saved privately to your bookshelf. You can allow suggestions to use it later."); }}>
      {perspectiveQuestions.map(({ key, label }) => <label key={key}>{label}<textarea maxLength={800} value={draft[key]}
        onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} /></label>)}
      <button disabled={busy}>Save to Memories</button>
    </form>
    {message && <p role="status">{message}</p>}
  </details>;
}
