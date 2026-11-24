import type { Memory } from "../../shared/schema";
import { InterfaceIcon } from "../../shared/InterfaceIcon";

export type Category = NonNullable<Memory["category"]>;
export type MemoryFilter = "all" | Category;
const choices = [{ id: "all", label: "All" }, { id: "people", label: "People" },
  { id: "events", label: "Events" }, { id: "you", label: "You" }, { id: "misc", label: "Misc" }] as const;

export function MemoryFilters({ value, onChange }: { value: MemoryFilter; onChange: (value: MemoryFilter) => void }) {
  return <div className="memory-filters" role="group" aria-label="Filter memories">
    {choices.map(({ id, label }) => <button type="button" key={id} className={`memory-filter memory-filter-${id}`}
      title={label} aria-label={label} aria-pressed={value === id} onClick={() => onChange(id)}><InterfaceIcon kind={id} /></button>)}
  </div>;
}

export function MemoryCategorySelect({ value, onChange, disabled = false }: {
  value: Category; onChange: (value: Category) => void; disabled?: boolean;
}) {
  return <label>Category<select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value as Category)}>
    {choices.filter((choice) => choice.id !== "all").map(({ id, label }) => <option value={id} key={id}>{label}</option>)}
  </select></label>;
}
