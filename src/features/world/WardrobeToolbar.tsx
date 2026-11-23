import { wearableSlots, type WearableSlot } from "../../shared/equipment";
import { WardrobeIcon } from "./WardrobeIcon";

export type WardrobeFilter = "all" | WearableSlot;
export type PreviewPose = "standing" | "sitting";
const labels = { all: "All items", hat: "Hats", glasses: "Glasses", socks: "Socks", body: "Body clothing" };

export function WardrobeFilters({ filter, onFilter }: { filter: WardrobeFilter; onFilter: (filter: WardrobeFilter) => void }) {
  return <div className="wardrobe-filters" role="group" aria-label="Filter wardrobe">
    {(["all", ...wearableSlots] as const).map((slot) => <button key={slot} className="wardrobe-icon-button"
      aria-label={labels[slot]} title={labels[slot]} aria-pressed={filter === slot} onClick={() => onFilter(slot)}>
      <WardrobeIcon kind={slot} /></button>)}
  </div>;
}

export function WardrobePoses({ pose, onPose }: { pose: PreviewPose; onPose: (pose: PreviewPose) => void }) {
  return <div className="wardrobe-poses" role="group" aria-label="Preview pose">
    {(["standing", "sitting"] as const).map((value) => <button key={value} className="wardrobe-icon-button"
      aria-label={value === "standing" ? "Stand" : "Sit"} title={value === "standing" ? "Stand" : "Sit"}
      aria-pressed={pose === value} onClick={() => onPose(value)}><WardrobeIcon kind={value === "standing" ? "stand" : "sit"} /></button>)}
  </div>;
}
