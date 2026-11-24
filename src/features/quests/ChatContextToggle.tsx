export function ChatContextToggle({ enabled, busy, onChange }: { enabled: boolean; busy: boolean; onChange: (value: boolean) => void }) {
  return <><label className="checkbox"><input type="checkbox" checked={enabled} disabled={busy} onChange={(event) => onChange(event.target.checked)} />Include my last four messages in replies</label>
    {enabled && <p>Messages remain in chat until cleared, even if a saved memory is deleted.</p>}</>;
}
