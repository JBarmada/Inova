import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { initialState } from "../../state/defaults";
import { PetPanel } from "./PetPanel";

const fixture = vi.hoisted(() => ({ state: {} as ReturnType<typeof initialState> }));
vi.mock("../../state/store", () => ({ useInova: () => fixture.state, dispatch: vi.fn() }));
vi.mock("./useDogPose", () => ({ useDogPose: () => ({ pose: "sitting", ready: true, error: "" }) }));
vi.mock("./DogSprite", () => ({ DogSprite: () => <span>Dog</span> }));
vi.mock("./BoneQuestToy", () => ({ BoneQuestToy: () => <div data-toy="true" /> }));

beforeEach(() => {
  fixture.state = initialState();
  fixture.state.pet.adopted = true;
});
afterEach(() => vi.clearAllMocks());

it.each([false, true])("gates every adopted dog control behind Dev mode (floating=%s)", (floating) => {
  const normal = renderToStaticMarkup(<PetPanel floating={floating} />);
  expect(normal).not.toContain("<button");
  expect(normal).not.toContain("Developer mood controls");
  expect(normal).not.toContain("Developer animation controls");
  expect(normal).not.toContain("Welcome walk (trial)");
  expect(normal).not.toContain("Art preview");
  fixture.state.settings.devMode = true;
  const developer = renderToStaticMarkup(<PetPanel floating={floating} />);
  expect(developer).toContain("Ask your dog to stand");
  expect(developer).toContain("Developer mood controls");
  expect(developer).not.toContain("Art preview");
  expect(developer).not.toContain("Pixel Engine");
  expect(developer).toContain("Developer animation controls");
  expect(developer).toContain("Welcome walk (trial)");
  expect(developer.match(/<option/g)).toHaveLength(20);
  expect(developer).not.toContain("Post-nap stretch");
  expect(developer.match(/<button/g)).toHaveLength(5);
  fixture.state.settings.devMode = false;
  expect(renderToStaticMarkup(<PetPanel floating={floating} />)).not.toContain("<button");
  if (floating) expect(developer.indexOf('data-toy="true"')).toBeLessThan(developer.indexOf("pose-controls"));
});

it("leaves adoption available without Dev mode", () => {
  fixture.state.pet.adopted = false;
  fixture.state.settings.devMode = true;
  expect(renderToStaticMarkup(<PetPanel floating={false} />)).toContain("Adopt this dog");
  expect(renderToStaticMarkup(<PetPanel floating={false} />)).not.toContain("Developer animation controls");
});
