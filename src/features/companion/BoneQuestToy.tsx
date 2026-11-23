import { useCallback, useEffect } from "react";
import type { AppState } from "../../shared/schema";
import { playCue } from "../../services/audio";
import { toyQuests } from "./toyQuests";
import { ToyQuestList } from "./ToyQuestList";
import { ToyComposer } from "./ToyComposer";
import { QuestToyIcon } from "./QuestToyIcon";
import { useOutsideDismiss } from "./useOutsideDismiss";
import { useToyExpansion } from "./useToyExpansion";

export function BoneQuestToy({ state, onExpandedChange }: { state: AppState; onExpandedChange?: (open: boolean) => void }) {
  const { phase, open, mounted, button, panel, expand, collapse } = useToyExpansion();
  const quests = toyQuests(state.quests);
  const active = quests.filter((quest) => quest.status !== "completed").length;
  const minimize = useCallback((returnFocus = false) => {
    collapse(returnFocus);
    playCue("squeak", state.settings.muted);
  }, [collapse, state.settings.muted]);
  const dismiss = useCallback(() => minimize(), [minimize]);
  useEffect(() => { onExpandedChange?.(mounted); }, [mounted, onExpandedChange]);
  useOutsideDismiss(open, button, panel, dismiss);
  return <div className={`bone-quest-wrap ${mounted ? "is-open" : ""}`} data-phase={phase} onKeyDown={(event) => {
    if (event.key === "Escape" && open) { event.stopPropagation(); minimize(true); }
  }}>
    <button ref={button} className={`bone-toy${state.settings.devMode ? " is-dev" : ""}`} type="button" aria-label="Open quest toy"
      aria-hidden={mounted} tabIndex={mounted ? -1 : 0} aria-expanded={open} aria-controls="toy-quest-board"
      title="Your next little adventures" onClick={() => { expand(); playCue("squeak", state.settings.muted); }}>
      <QuestToyIcon alt="Golden bone toy with teal rope" />
      {active > 0 && <span className="toy-quest-count">{active}</span>}
    </button>
    {mounted && <section ref={panel} id="toy-quest-board" className="toy-quest-panel" aria-label="Pawprint adventures"
      tabIndex={-1} inert={!open}>
      <header className="toy-board-heading">
        <h3><span aria-hidden="true">✦</span><span>Fetch a Lil' Side Quest</span><span aria-hidden="true">✦</span></h3></header>
      <ToyComposer state={state} />
      {quests.length > 0 ? <ToyQuestList quests={quests} muted={state.settings.muted} />
        : <p className="toy-empty">Every adventure starts with a little plan. Add yours above.</p>}
    </section>}
  </div>;
}
