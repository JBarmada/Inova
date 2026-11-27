import type { AppState } from "../shared/schema";
type Model = AppState["settings"]["localModel"];

export async function availableModel(selected: Model, check: (model: Model) => Promise<boolean>): Promise<Model> {
  if (selected !== "gemma3:12b" || await check(selected)) return selected;
  return await check("gemma3:4b") ? "gemma3:4b" : selected;
}
