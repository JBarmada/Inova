import { expect, it } from "vitest";
import { costumeUnlocks } from "../shared/costumeUnlocks";
import type { CostumeId } from "../shared/costumes";
import type { AppState, Quest } from "../shared/schema";
import { initialState } from "./defaults";
import { reduce } from "./reducer";

function withQuest(state: AppState, title: string, id: string, status: Quest["status"] = "accepted") {
  const quest: Quest = { id, commitmentId: "c", title, reason: "A next step", sourceIds: ["c"], minutes: 5, status, planner: "local" };
  return { ...state, quests: [...state.quests, quest] };
}

function complete(state: AppState, id: string) {
  return reduce(state, { type: "complete-quest", id });
}

it("gives basic milestones at their exact count and leaves unrelated themed items locked", () => {
  let state = initialState();
  for (let count = 1; count <= 20; count++) {
    const id = `quest-${count}`;
    state = complete(withQuest(state, "Draft the next step", id), id);
    for (const [item, rule] of Object.entries(costumeUnlocks)) {
      expect(state.ownedItems.includes(item as AppState["ownedItems"][number]), item)
        .toBe(!("category" in rule) && rule.count <= count);
    }
    expect(complete(state, id)).toEqual(state);
  }
});

it("awards a matching theme after an accepted quest and preserves older ownership and equipment", () => {
  const initial = initialState();
  const existing: AppState = { ...initial, ownedItems: ["farquaad"], equipment: { ...initial.equipment, body: "farquaad" } };
  const proposed = withQuest(existing, "Plant native trees", "tree", "proposed");
  expect(complete(proposed, "tree")).toEqual(proposed);
  const accepted = reduce(proposed, { type: "quest-status", id: "tree", status: "accepted" });
  const done = complete(accepted, "tree");
  expect(done.ownedItems).toEqual(["farquaad", "notebook", "lorax"]);
  expect(done.equipment).toEqual(existing.equipment);
  expect(complete(done, "tree")).toEqual(done);
});

it("counts distinct matching completions from old saves, including their original commitment", () => {
  const old = withQuest({
    ...initialState(),
    commitments: [{ id: "c", title: "Study for my history midterm", createdAt: "2026-11-23T00:00:00.000Z" }],
    rewardedQuestIds: ["one", "one"],
  }, "Make the outline", "one", "completed");
  const next = withQuest({ ...old, quests: [...old.quests, ...old.quests] }, "Start the outline", "two");
  expect(next.ownedItems).not.toContain("harry-potter");
  const unrelated = { ...next, quests: next.quests.map((quest) => quest.id === "two" ? { ...quest, commitmentId: "other" } : quest) };
  expect(complete(unrelated, "two").ownedItems).not.toContain("harry-potter");
  const completed = complete(next, "two");
  expect(completed.ownedItems).toEqual(["notebook", "harry-potter"]);
  expect(complete(completed, "two")).toEqual(completed);
});

const themeExamples = {
  farquaad: ["Ask Sam on a date"],
  lorax: ["Clean up the neighborhood park"],
  "harry-potter": ["Review lecture notes", "Make flashcards for chapter four"],
  mustache: ["Send my résumé"],
  shrimp: ["Fix my desk posture"],
  shrek: ["Make onion rings"],
  britney: ["Practice my guitar chords"],
  pikachu: ["Play a Pokémon video game"],
  bush: ["Play Fortnite"],
  iso: ["Improve accuracy in Valorant"],
  "christmas-present": ["Wrap my brother's present"],
  "maple-leaf": ["Try poutine"],
  turkey: ["Write a thank-you note"],
  "usc-hoodie": ["Go watch the UFC fight in person"],
  bibble: ["Throw a Barbie movie night"],
  "chicken-nugget": ["Pick up McNuggets"],
  soju: ["Cook Korean BBQ"],
  "white-house": ["Attend a city council meeting"],
  elmo: ["Practice my Elmo impression"],
  mort: ["Volunteer at the animal shelter"],
  trojan: ["Face my fear of public speaking"],
  flower: ["Arrange a birthday bouquet"],
  omen: ["Solve a chess puzzle"],
  killjoy: ["Build an Arduino prototype"],
  ahri: ["Practice Ahri in League of Legends"],
  teemo: ["Try a new route"],
  goth: ["Visit a haunted house"],
  egirl: ["Organize a Discord hangout"],
} satisfies Partial<Record<CostumeId, string[]>>;

it("has one player-earned fixture for each themed outfit", () => {
  const themed = Object.entries(costumeUnlocks).filter(([, rule]) => "category" in rule).map(([item]) => item).sort();
  expect(Object.keys(themeExamples).sort()).toEqual(themed);
});

it.each(Object.entries(themeExamples))("awards %s through ordinary quest completion", (item, titles) => {
  let state = initialState();
  for (const [index, title] of titles.entries()) {
    const id = `themed-${index}`;
    const proposed = withQuest(state, title, id, "proposed");
    expect(complete(proposed, id)).toEqual(proposed);
    expect(state.ownedItems).not.toContain(item);
    const accepted = reduce(proposed, { type: "quest-status", id, status: "accepted" });
    state = complete(accepted, id);
    expect(complete(state, id)).toEqual(state);
  }
  expect(state.settings.devMode).toBe(false);
  expect(state.ownedItems).toEqual(["notebook", item]);
  expect(state.equipment.body).toBeNull();
});
