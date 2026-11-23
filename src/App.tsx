import { useState } from "react";
import { useInova, dispatch } from "./state/store";
import { useAction } from "./shared/useAction";
import { setPetMode } from "./services/desktop";
import { PetPanel } from "./features/companion/PetPanel";
import { QuestsPanel } from "./features/quests/QuestsPanel";
import { WorldPanel } from "./features/world/WorldPanel";
import { playCue } from "./services/audio";

const tabs = ["companion", "quests", "world"] as const;
type Tab = typeof tabs[number];

export function App() {
  const state = useInova();
  const [tab, setTab] = useState<Tab>("companion");
  const [floating, setFloating] = useState(false);
  const { run, message, busy } = useAction();
  async function toggleFloating() {
    await setPetMode(!floating);
    setFloating(!floating);
  }
  function selectTab(next: Tab) {
    setTab(next);
    playCue("click", state.settings.muted);
  }
  return <main className={floating ? "app floating" : "app"}>
    {!floating && <header className="masthead"><div><p className="eyebrow">A LITTLE GROWTH, TOGETHER</p>
      <h1>Inova<span> shared starter</span></h1></div>
      <button disabled={busy || !state.pet.adopted} onClick={() => void run(toggleFloating, "Desktop mode changed.")}>Float my dog ↗</button>
    </header>}
    <div className="utilities">
      <button onClick={() => void run(() => dispatch({ type: "mute", muted: !state.settings.muted }))}>{state.settings.muted ? "Sound off" : "Sound on"}</button>
      {floating && <button disabled={busy} onClick={() => void run(toggleFloating)}>Open home</button>}
    </div>
    {!floating && <><p className="notice">Prototype • original placeholder art and synthesized tones • sample planner, no live AI</p>
      <nav aria-label="Main navigation">{tabs.map((entry) => <button key={entry} aria-current={tab === entry ? "page" : undefined}
        onClick={() => selectTab(entry)}>{entry === "world" ? "Wardrobe & memories" : entry}</button>)}</nav></>}
    {(floating || tab === "companion") && <PetPanel floating={floating} />}
    {!floating && tab === "quests" && <QuestsPanel />}
    {!floating && tab === "world" && <WorldPanel />}
    {message && <p className="feedback" role="status">{message}</p>}
    {!floating && <footer>Working toward December 1 · All progress stays on this device.</footer>}
  </main>;
}
