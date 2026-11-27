import type { AppState } from "../../shared/schema";
import { CompanionChat } from "../quests/CompanionChat";

export function ToyComposer({ state }: { state: AppState }) {
  return <CompanionChat state={state} />;
}
