import { isTauri } from "@tauri-apps/api/core";
import { load } from "@tauri-apps/plugin-store";
import type { StartupTimings } from "./startup";

export async function recordStartup(timings: StartupTimings): Promise<void> {
  console.info("[Inova startup] Durations in milliseconds", timings);
  performance.mark("inova:ui-ready");
  performance.measure("inova:navigation-to-ui", { start: 0, end: "inova:ui-ready" });
  if (!isTauri()) return;
  const file = await load("startup-diagnostics.json", { autoSave: false, defaults: {} });
  await file.set("latest", timings);
  await file.save();
}
