import { load } from "@tauri-apps/plugin-store";
import { layoutSchema, type WindowLayout } from "./windowGeometry";

const store = () => load("window-layout.json", { defaults: {}, autoSave: false });
let writes = Promise.resolve();

export async function readWindowLayout(): Promise<WindowLayout> {
  const raw = await (await store()).get("layout");
  return raw == null ? { version: 1 } : layoutSchema.parse(raw);
}

export function writeWindowLayout(layout: WindowLayout): Promise<void> {
  const snapshot = layoutSchema.parse(layout);
  writes = writes.catch(() => undefined).then(async () => {
    const file = await store();
    await file.set("layout", snapshot);
    await file.save();
  });
  return writes;
}
