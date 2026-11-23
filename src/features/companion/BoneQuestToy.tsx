import { useCallback, useRef, useState } from "react";
import type { AppState } from "../../shared/schema";
import { playCue } from "../../services/audio";
import { toyQuests } from "./toyQuests";
import { ToyQuestRow } from "./ToyQuestRow";
import { ToyComposer } from "./ToyComposer";
import { QuestToyIcon } from "./QuestToyIcon";
import { useOutsideDismiss } from "./useOutsideDismiss";

export function BoneQuestToy({ state, onExpandedChange }: { state: AppState; onExpandedChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const quests = toyQuests(state.quests);
  const active = quests.filter((quest) => quest.status !== "completed").length;
  const setExpanded = useCallback((next: boolean) => {
    setOpen(next);
    onExpandedChange?.(next);
    playCue("squeak", state.settings.muted);
  }, [onExpandedChange, state.settings.muted]);
  const collapse = useCallback(() => setExpanded(false), [setExpanded]);
  useOutsideDismiss(open, button, panel, collapse);
  return <div className={`bone-quest-wrap ${open ? "is-open" : ""}`} onKeyDown={(event) => {
    if (event.key === "Escape") { setExpanded(false); button.current?.focus(); }
  }}>
    <button ref={button} className={`bone-toy${state.settings.devMode ? " is-dev" : ""}`} type="button" aria-label={open ? "Close quest toy" : "Open quest toy"}
      aria-expanded={open} aria-controls="toy-quest-board" title="Your next little adventures" onClick={() => setExpanded(!open)}>
      <QuestToyIcon alt="Golden bone toy with teal rope" />
      {active > 0 && <span className="toy-quest-count">{active}</span>}
    </button>
    {open && <section ref={panel} id="toy-quest-board" className="toy-quest-panel" aria-label="Pawprint adventures">
      <header className="toy-board-heading">
        <h3><span aria-hidden="true">✦</span><span>Fetch a Lil' Side Quest</span><span aria-hidden="true">✦</span></h3></header>
      <ToyComposer state={state} />
      {quests.length > 0 ? <ul className="toy-quest-list" aria-label="Your quests">{quests.map((quest) => <ToyQuestRow quest={quest} key={quest.id} />)}</ul>
        : <p className="toy-empty">Every adventure starts with a little plan. Add yours above.</p>}
    </section>}
  </div>;
}
