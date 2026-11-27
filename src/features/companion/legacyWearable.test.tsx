import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { items } from "../../shared/catalog";
import { emptyEquipment } from "../../shared/equipment";
import { isLegacyWearable, LegacyWearable } from "./LegacyWearable";
import { WearableLayers } from "./WearableLayers";

it("has a distinct drawing for every original item and renders it on both wardrobe poses", () => {
  const originals = items.filter((item) => isLegacyWearable(item.id));
  expect(originals).toHaveLength(10);
  const drawings = new Set<string>();
  for (const item of originals) {
    const drawing = renderToStaticMarkup(<svg><LegacyWearable id={item.id} color={item.color} /></svg>);
    expect(drawing).toMatch(/<(?:path|rect)/);
    drawings.add(drawing);
    for (const frame of ["standing", "sitting"] as const) {
      const equipment = { ...emptyEquipment(), [item.slot]: item.id };
      const html = renderToStaticMarkup(<WearableLayers equipment={equipment} frame={frame} />);
      expect(html).toContain(`data-item="${item.id}"`);
      expect(html).toMatch(/<(?:path|rect)/);
    }
  }
  expect(drawings.size).toBe(originals.length);
});

it.each([
  ["standing", "stand"], ["happy", "stand"], ["tired", "stand"],
  ["sit-05", "stand"], ["sitting", "sit"], ["sitting-happy", "sit"],
  ["loaf-bend", "sit"], ["loaf-tuck", "loaf"], ["loaf-idle", "loaf"],
  ["sleep-drowsy", "loaf"], ["sleeping", "loaf"], ["wake-eyes", "loaf"],
] as const)("fits the four original body items to %s", (frame, fit) => {
  for (const body of ["raincoat", "hoodie", "notebook", "bandana"] as const) {
    const html = renderToStaticMarkup(<WearableLayers equipment={{ ...emptyEquipment(), body }} frame={frame} />);
    expect(html).toContain(`data-legacy-fit="${fit}"`);
  }
});

it("uses wider head art and larger socks without covering hidden paws", () => {
  const equipment = { ...emptyEquipment(), hat: "cap", glasses: "round-glasses", socks: "gold-socks" } as const;
  const standing = renderToStaticMarkup(<WearableLayers equipment={equipment} frame="standing" />);
  expect(standing).toContain('width="31" height="15" preserveAspectRatio="none"');
  expect(standing).toContain('width="27" height="10" preserveAspectRatio="none"');
  expect(standing.match(/width="6" height="6"/g)).toHaveLength(4);
  const loaf = renderToStaticMarkup(<WearableLayers equipment={equipment} frame="loaf-idle" />);
  expect(loaf).not.toContain('width="6" height="6"');
});

it("follows visible paw anchors without extending below the canvas ground line", () => {
  const equipment = { ...emptyEquipment(), body: "raincoat", socks: "mint-socks" } as const;
  const walking = renderToStaticMarkup(<WearableLayers equipment={equipment} frame="standing"
    motion={{ feet: [[20, 45], [33, 55]], walk: true, walkFrame: 3 }} />);
  expect(walking).toContain('data-legacy-fit="stand" transform="translate(2.5 -2)');
  expect(walking).toContain('x="17" y="42" width="6" height="6"');
  expect(walking).toContain('x="30" y="50" width="6" height="6"');
});
