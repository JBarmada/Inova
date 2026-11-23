import { expect, it } from "vitest";
import { initialState } from "../../state/defaults";
import { prepareQuest } from "../../services/prepareQuest";
import { reviewQuestDetails } from "./reviewQuestDetails";

it("fits the quest into reviewed total effort without changing the original draft", async () => {
  const draft = await prepareQuest("Write a fictional outline", initialState(), async () => { throw Error("offline"); });
  const reviewed = reviewQuestDetails(draft, "", "1");
  expect(reviewed.commitment.effortMinutes).toBe(1);
  expect(reviewed.quest.minutes).toBe(1);
  expect(draft.commitment.effortMinutes).toBeUndefined();
  expect(() => reviewQuestDetails(draft, "", "0")).toThrow("total effort");
});
