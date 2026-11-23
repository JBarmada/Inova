import type { AppState } from "../../shared/schema";
import { QuestComposer } from "../quests/QuestComposer";

export function ToyComposer({ state }: { state: AppState }) {
  return <QuestComposer state={state} compact />;
}
