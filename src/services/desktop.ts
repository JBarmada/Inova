import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";

export async function setPetMode(enabled: boolean): Promise<void> {
  if (!isTauri()) throw Error("Floating mode needs the desktop app. Run npm run desktop.");
  const window = getCurrentWindow();
  await window.setAlwaysOnTop(enabled);
  await window.setDecorations(!enabled);
  await window.setSize(new LogicalSize(enabled ? 260 : 1040, enabled ? 300 : 780));
}
