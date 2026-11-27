import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { initialState } from "../../state/defaults";
import { DogSprite } from "./DogSprite";
import { clipTiming } from "./dogClips";
import { useDogClip } from "./useDogClip";

vi.mock("./useDogClip", () => ({ useDogClip: vi.fn() }));
afterEach(() => vi.unstubAllGlobals());

it("keeps expression and transition art and equipment through the whole bark", () => {
  vi.stubGlobal("window", { matchMedia: () => ({ matches: true }) });
  const state = initialState();
  state.equipment = { hat: null, glasses: "round-glasses", socks: "mint-socks", body: "usc-hoodie" };
  const bark = clipTiming["12-single-bark"].markers.bark;
  const cases = [
    ["sitting", "idle", "sitting", 29], ["loaf", "idle", "loaf-idle", 39],
    ["standing", "idle", "neutral", 32], ["standing", "happy", "happy", 33], ["standing", "tired", "tired", 35],
    ["sit-06", "idle", "fitted/sit-06", 30], ["loaf-tuck", "idle", "loaf-tuck", 36],
    ["wake-eyes", "idle", "wake-eyes", 40], ["sleeping", "idle", "sleeping", 41],
  ] as const;
  for (const [pose, mood, sprite, mouth] of cases) {
    state.pet.mood = mood;
    for (const elapsed of [0, bark]) {
      vi.mocked(useDogClip).mockReturnValue({ clip: "12-single-bark", demo: true, index: elapsed ? 2 : 0, elapsed });
      const html = renderToStaticMarkup(<DogSprite state={state} pose={pose} />);
      expect(html).toContain(`/dog/${sprite}.png`);
      expect(html).toContain('data-item="usc-hoodie"');
      expect(html).toContain('data-item="round-glasses"');
      expect(html).not.toContain("/dog/clips/12-single-bark.png");
      if (elapsed === bark) expect(html).toContain(`data-bark-mouth="${mouth}"`);
      else expect(html).not.toContain("data-bark-mouth");
    }
  }
});
