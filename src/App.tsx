import { useState } from "react";
import { useInova } from "./state/store";
import { useAction } from "./shared/useAction";
import { setPetMode } from "./services/desktop";
import { PetPanel } from "./features/companion/PetPanel";
import { QuestsPanel } from "./features/quests/QuestsPanel";
import { WorldPanel } from "./features/world/WorldPanel";
import { playCue } from "./services/audio";
import { CompanionControls } from "./features/companion/CompanionControls";
import { PixelStatus } from "./features/companion/PixelStatus";
import { useFloatingLayout } from "./features/companion/useFloatingLayout";

const tabs = ["companion", "quests", "world"] as const;
type Tab = typeof tabs[number];

export function App() {
  const state = useInova();
  const [tab, setTab] = useState<Tab>("companion");
  const [floating, setFloating] = useState(false);
  const appElement = useFloatingLayout(floating);
  const { run, message, busy } = useAction();
  async function toggleFloating() {
    await setPetMode(!floating);
    setFloating(!floating);
    playCue("click", state.settings.muted);
  }
  function selectTab(next: Tab) {
    setTab(next);
    playCue("click", state.settings.muted);
  }
  function openHome() {
    if (floating) void run(async () => { await toggleFloating(); setTab("companion"); }, "");
    else selectTab("companion");
  }
  return <main ref={appElement} className={floating ? "app floating" : "app"}>
    {!floating && <header className="masthead"><div><p className="eyebrow">A LITTLE GROWTH, TOGETHER</p>
      <h1>Inova<span> shared starter</span></h1></div>
      <button disabled={busy || !state.pet.adopted} onClick={() => void run(toggleFloating, "")}>Float my dog ↗</button>
    </header>}
    <CompanionControls onHome={openHome} disabled={busy} floating={floating} />
    {!floating && <><p className="notice">Prototype • original placeholder art and synthesized tones • sample planner, no live AI</p>
      <nav aria-label="Main navigation">{tabs.map((entry) => <button key={entry} aria-current={tab === entry ? "page" : undefined}
        onClick={() => selectTab(entry)}>{entry === "world" ? "Wardrobe & memories" : entry}</button>)}</nav></>}
    {(floating || tab === "companion") && <PetPanel floating={floating} />}
    {!floating && tab === "quests" && <QuestsPanel />}
    {!floating && tab === "world" && <WorldPanel />}
    {message && <PixelStatus text={message} />}
    {!floating && <footer>Working toward December 1 · All progress stays on this device.</footer>}
  </main>;
}
