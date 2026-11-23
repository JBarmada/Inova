import { useState } from "react";
import { useInova } from "./state/store";
import { useAction } from "./shared/useAction";
import { setPetMode } from "./services/desktop";
import { PetPanel } from "./features/companion/PetPanel";
import { QuestsPanel } from "./features/quests/QuestsPanel";
import { WardrobePanel } from "./features/world/WardrobePanel";
import { MemoryShelf } from "./features/world/MemoryShelf";
import { playCue } from "./services/audio";
import { CompanionControls } from "./features/companion/CompanionControls";
import { PixelStatus } from "./features/companion/PixelStatus";
import { useFloatingLayout } from "./features/companion/useFloatingLayout";
import { PixelIcon } from "./features/companion/PixelIcon";
import { QuestToyIcon } from "./features/companion/QuestToyIcon";

const tabs = ["companion", "quests", "wardrobe", "memories"] as const;
type Tab = typeof tabs[number];
const tabLabels = { companion: "Companion", quests: "Quests", wardrobe: "Wardrobe", memories: "Memories" };

export function App() {
  const state = useInova();
  const [tab, setTab] = useState<Tab>("companion");
  const [floating, setFloating] = useState(false);
  const [toyExpanded, setToyExpanded] = useState(false);
  const appElement = useFloatingLayout(floating);
  const { run, message, busy } = useAction();
  async function toggleFloating() {
    await setPetMode(!floating);
    setFloating(!floating);
    setToyExpanded(false);
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
  return <main ref={appElement} className={floating ? `app floating${toyExpanded ? " toy-expanded" : ""}` : "app"}>
    {floating ? <CompanionControls onHome={openHome} disabled={busy} floating />
      : <header className="masthead"><h1>Inova</h1>
        <nav className="home-navigation" aria-label="Main navigation">{tabs.map((entry) => <button key={entry} className="nav-icon-button"
          aria-label={tabLabels[entry]} title={tabLabels[entry]} aria-current={tab === entry ? "page" : undefined}
          onClick={() => selectTab(entry)}>{entry === "quests" ? <QuestToyIcon className="nav-quest-toy" /> : <PixelIcon kind={entry} />}</button>)}</nav>
        <CompanionControls onHome={openHome} onFloat={() => void run(toggleFloating, "")} disabled={busy} floating={false} />
      </header>}
    {(floating || tab === "companion") && <PetPanel floating={floating} onToyExpanded={setToyExpanded} />}
    {!floating && tab === "quests" && <QuestsPanel />}
    {!floating && tab === "wardrobe" && <WardrobePanel />}
    {!floating && tab === "memories" && <MemoryShelf />}
    {message && <PixelStatus text={message} />}
  </main>;
}
