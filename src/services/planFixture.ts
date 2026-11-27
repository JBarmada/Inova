import type { AppState, Commitment } from "../shared/schema";
import { proposeLocalPlan } from "./localPlan";

// Fictional model response for tests; production never uses this fixture.
export function fictionalPlan(commitment: Commitment, state: AppState) {
  const response = JSON.stringify({ explanation: "Start with one concrete action.", steps: [
    { title: "Gather the materials", reason: "Prepare the first step.", minutes: 5 },
  ] });
  return proposeLocalPlan(commitment, state, async () => response as never);
}
