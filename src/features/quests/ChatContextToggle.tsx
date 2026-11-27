export function ChatContextToggle({ enabled, busy, onChange }: { enabled: boolean; busy: boolean; onChange: (value: boolean) => void }) {
  return <label className="checkbox"><input type="checkbox" checked={enabled} disabled={busy} onChange={(event) => onChange(event.target.checked)} />Include recent conversation in replies</label>;
}
