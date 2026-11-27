import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { DogSprite } from "./DogSprite";
import { beePortraits, CostumePortrait } from "./CostumePortrait";
import { initialState } from "../../state/defaults";

it("renders the expression layer separately on each fitted bee pose", () => {
  for (const art of Object.values(beePortraits)) {
    const images = (["idle", "happy", "tired", "blink", "bark"] as const).map((expression) =>
      renderToStaticMarkup(<CostumePortrait art={art} expression={expression} />));
    expect(new Set(images).size).toBe(5);
    expect(images.every((html) => html.includes(art.source))).toBe(true);
  }
});

it("keeps the same full costume renderer across poses with an accessory equipped", () => {
  vi.stubGlobal("window", { matchMedia: () => ({ matches: true }) });
  try {
    const state = initialState();
    state.equipment.body = "bee";
    state.equipment.hat = "cap";
    for (const pose of ["standing", "sitting", "loaf"] as const) {
      const result = renderToStaticMarkup(<DogSprite state={state} pose={pose} />);
      expect(result).toContain('data-item="cap"');
      expect(result).toContain('data-costume-pose="' + pose + '"');
      expect(result).toContain('<image href="' + beePortraits[pose].source + '"');
      expect(result).not.toContain('class="dog-base"');
    }
  } finally { vi.unstubAllGlobals(); }
});

it("keeps fitted accessories on the portrait and lifts each sock with its own paw", () => {
  const state = initialState();
  state.equipment = { hat: "cap", glasses: "round-glasses", socks: "mint-socks", body: "bee" };
  const html = renderToStaticMarkup(<CostumePortrait art={beePortraits.standing}
    equipment={state.equipment} expression="happy" pawLifts={[2, 0, 2, 0]} />);
  expect(html).toContain('data-item="cap"');
  expect(html).toContain('data-item="round-glasses"');
  expect(html).toContain('data-item="mint-socks" x="395" y="878"');
  expect(html).toContain('data-item="mint-socks" x="578" y="906"');
  const loaf = renderToStaticMarkup(<CostumePortrait art={beePortraits.loaf}
    equipment={state.equipment} expression="blink" />);
  expect(loaf).toContain('data-item="round-glasses"');
  expect(loaf).not.toContain('data-item="mint-socks"');
});
