import { useRef, useState } from "react";
import type { AppState } from "../../shared/schema";
import { playCue } from "../../services/audio";
import { toyQuests } from "./toyQuests";
import { ToyQuestRow } from "./ToyQuestRow";
import { ToyComposer } from "./ToyComposer";

export function BoneQuestToy({ state, onExpandedChange }: { state: AppState; onExpandedChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const quests = toyQuests(state.quests);
  const active = quests.filter((quest) => quest.status !== "completed").length;
  function setExpanded(next: boolean) {
    setOpen(next);
    onExpandedChange?.(next);
    playCue("click", state.settings.muted);
  }
  return <div className={`bone-quest-wrap ${open ? "is-open" : ""}`} onKeyDown={(event) => {
    if (event.key === "Escape") { setExpanded(false); button.current?.focus(); }
  }}>
    <button ref={button} className="bone-toy" type="button" aria-label={open ? "Close quest toy" : "Open quest toy"}
      aria-expanded={open} aria-controls="toy-quest-board" title="Your next little adventures" onClick={() => setExpanded(!open)}>
      <img src="/art/quest-toy-icon-v1.png" alt="Golden bone toy with teal rope" draggable={false} />
      {active > 0 && <span className="toy-quest-count">{active}</span>}
    </button>
    {open && <section id="toy-quest-board" className="toy-quest-panel" aria-label="Pawprint adventures">
      <header className="toy-board-heading"><p>✦ SMALL STEPS, BIG ADVENTURES ✦</p>
        <h3>Fetch a little adventure</h3><button aria-label="Close quest board" title="Close" onClick={() => { setExpanded(false); button.current?.focus(); }}>×</button></header>
      <ToyComposer state={state} />
      {quests.length > 0 ? <ul className="toy-quest-list" aria-label="Your quests">{quests.map((quest) => <ToyQuestRow quest={quest} key={quest.id} />)}</ul>
        : <p className="toy-empty">Every adventure starts with a little plan. Add yours above.</p>}
      <p className="toy-board-footnote">Practice quests · sample planner</p>
    </section>}
  </div>;
}
