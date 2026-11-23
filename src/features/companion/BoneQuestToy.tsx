import { useState } from "react";
import type { AppState, Quest } from "../../shared/schema";
import { playCue } from "../../services/audio";

function currentQuest(quests: Quest[]): Quest | undefined {
  return quests.find((quest) => quest.status === "accepted")
    ?? quests.find((quest) => quest.status === "proposed")
    ?? quests.find((quest) => quest.status === "deferred");
}

function QuestBox({ quest }: { quest?: Quest }) {
  if (!quest) return <div className="bone-quest-box" role="status">
    <p className="eyebrow">NO QUEST YET</p>
    <p>Open the quests page to give your pup a small adventure.</p>
  </div>;
  return <div className="bone-quest-box" role="dialog" aria-label="Current quest">
    <p className="eyebrow">{quest.minutes} MIN · {quest.status}</p>
    <h3>{quest.title}</h3>
    <p>{quest.reason}</p>
  </div>;
}

export function BoneQuestToy({ state }: { state: AppState }) {
  const [open, setOpen] = useState(false);
  const quest = currentQuest(state.quests);
  function toggle() {
    setOpen((value) => !value);
    playCue("click", state.settings.muted);
  }
  return <div className="bone-quest-wrap">
    <button className="bone-toy" type="button" aria-label="Open quest toy" aria-expanded={open} onClick={toggle}>
      <span className="bone-end bone-end-left" aria-hidden="true" />
      <span className="bone-middle" aria-hidden="true" />
      <span className="bone-end bone-end-right" aria-hidden="true" />
    </button>
    {open && <QuestBox quest={quest} />}
  </div>;
}
