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

it("hides floating pose controls with Dev mode off and puts enabled controls after the toy", () => {
  const normal = renderToStaticMarkup(<PetPanel floating />);
  expect(normal).not.toContain("Ask your dog to stand");
  expect(normal).not.toContain("Developer mood controls");
  fixture.state.settings.devMode = true;
  const developer = renderToStaticMarkup(<PetPanel floating />);
  expect(developer).toContain("Ask your dog to stand");
  expect(developer).toContain("Developer mood controls");
  expect(developer.indexOf('data-toy="true"')).toBeLessThan(developer.indexOf("pose-controls"));
});

it("keeps the home pose action available independently of floating developer controls", () => {
  expect(renderToStaticMarkup(<PetPanel floating={false} />)).toContain("Ask your dog to stand");
});
