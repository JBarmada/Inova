import { expect, it } from "vitest";
import { classifyQuest, type QuestCategory } from "./questClassification";

const examples: Record<QuestCategory, string> = {
  general: "Finish the first draft",
  romance: "Go on a first date",
  nature: "Plant native trees",
  study: "Review lecture notes",
  career: "Send my résumé",
  posture: "Take a break to fix my desk posture",
  swamp: "Make onion rings",
  music: "Practice my guitar chords",
  gaming: "Play a Pokémon video game",
  fortnite: "Play Fortnite",
  precision: "Improve accuracy in Valorant",
  gifts: "Wrap my brother's present",
  canada: "Try poutine",
  gratitude: "Write a thank-you note",
  ufc: "Attend a UFC fight",
  barbie: "Throw a Barbie movie night",
  nuggets: "Pick up McNuggets",
  dinner: "Cook Korean BBQ",
  civic: "Attend a city council meeting",
  impressions: "Practice my Elmo impression",
  animals: "Volunteer at the animal shelter",
  courage: "Face my fear of public speaking",
  flowers: "Arrange a birthday bouquet",
  strategy: "Solve a chess puzzle",
  maker: "Build an Arduino prototype",
  league: "Practice Ahri in League of Legends",
  exploring: "Try a new route",
  goth: "Visit a haunted house",
  discord: "Organize a Discord hangout",
};

const classify = (title: string, source?: string) => classifyQuest({ title, commitmentId: "c" },
  source ? [{ id: "c", title: source, createdAt: "2026-11-23T00:00:00.000Z" }] : []);

it.each(Object.entries(examples))("recognizes %s in a quest title", (category, title) => {
  expect(classify(title)).toEqual([category]);
});

it("uses the linked commitment for a generic first step and keeps specific game themes distinct", () => {
  expect(classify("Set up a practice session", "Play Fortnite video games with friends")).toEqual(["fortnite"]);
  expect(classify("Play Pokémon", "Win a Nintendo game")).toEqual(["gaming"]);
  expect(classify("Win the match", "Play a video game in League of Legends")).toEqual(["league"]);
});

it("labels sports attendance only when the quest is to attend the event", () => {
  const source = "Attend a UFC event";
  expect(classify("Buy tickets for the UFC event", source)).toEqual(["general"]);
  expect(classify("Watch UFC at home", source)).toEqual(["general"]);
  expect(classify("Plan to go to the UFC event", source)).toEqual(["general"]);
  expect(classify("Attend the main card", source)).toEqual(["ufc"]);
  expect(classify("Go watch the UFC fight in person")).toEqual(["ufc"]);
  expect(classify("Go to a UFC watch party")).toEqual(["general"]);
  expect(classify("Attend a UFC fight watch party", source)).toEqual(["general"]);
  expect(classify("Attend the main card watch party", source)).toEqual(["general"]);
  expect(classify("Watch the UFC fight live on TV")).toEqual(["general"]);
});

it("recognizes natural wording for planning dates and cleaning up a park", () => {
  expect(classify("Ask Sam on a date")).toEqual(["romance"]);
  expect(classify("Clean up the neighborhood park")).toEqual(["nature"]);
});
