import { useEffect, useRef, useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { playCue } from "../../services/audio";
import { PixelIcon } from "./PixelIcon";
import { PixelStatus } from "./PixelStatus";
import { quitDesktop } from "../../services/desktop";

export function CompanionControls({ onHome, onFloat, disabled, floating }: { onHome: () => void; onFloat?: () => void; disabled: boolean; floating: boolean }) {
  const state = useInova();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const settingsButton = useRef<HTMLButtonElement>(null);
  const { run, busy, message } = useAction();
  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !panel.current?.contains(event.target)) setOpen(false);
    }
    if (open) document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);
  function toggleSettings() {
    setOpen(!open);
    playCue("click", state.settings.muted);
  }
  return <div className="companion-controls hover-reveal" ref={panel} onKeyDown={(event) => {
    if (event.key === "Escape") { setOpen(false); settingsButton.current?.focus(); }
  }}>
    {!floating && onFloat && <button className="pixel-icon-button" title="Float my dog" aria-label="Float my dog" disabled={disabled || !state.pet.adopted}
      onClick={() => { setOpen(false); onFloat(); }}><PixelIcon kind="float" /></button>}
    {floating && <button className="pixel-icon-button" title="Home" aria-label="Home" disabled={disabled}
      onClick={() => { setOpen(false); onHome(); }}><PixelIcon kind="home" /></button>}
    <button className="pixel-icon-button" title="Settings" aria-label="Settings" ref={settingsButton}
      aria-expanded={open} aria-controls="companion-settings" onClick={toggleSettings}><PixelIcon kind="settings" /></button>
    {open && <section id="companion-settings" className="companion-settings" aria-label="Companion settings">
      <h2>Settings</h2>
      <label className="setting-row"><span>Sound</span><input type="checkbox" checked={!state.settings.muted} disabled={busy}
        onChange={(event) => void run(() => dispatch({ type: "mute", muted: !event.target.checked }), "")} /></label>
      <label className="setting-row"><span>Dev mode</span><input type="checkbox" checked={state.settings.devMode} disabled={busy}
        onChange={(event) => void run(() => dispatch({ type: "dev-mode", enabled: event.target.checked }), "")} /></label>
      <label className="setting-row"><span>Status bar</span><input type="checkbox" checked={state.settings.showStatus} disabled={busy}
        onChange={(event) => void run(() => dispatch({ type: "status-bar", enabled: event.target.checked }), "")} /></label>
      {floating && <button className="quit-inova" type="button" disabled={busy || disabled} aria-busy={busy}
        onClick={() => { playCue("click", state.settings.muted); void run(quitDesktop, ""); }}>Quit Inova</button>}
      {message && <PixelStatus text={message} />}
    </section>}
  </div>;
}
