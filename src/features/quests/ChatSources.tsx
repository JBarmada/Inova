import type { AppState } from "../../shared/schema";

export function ChatSources({ ids, memories }: { ids?: string[]; memories: AppState["memories"] }) {
  const included = ids?.map((id) => memories.find((memory) => memory.id === id && memory.aiAllowed)).filter((memory) => memory !== undefined) ?? [];
  if (!included.length) return null;
  return <details><summary>Memories included ({included.length})</summary>
    <ul>{included.map((memory) => <li key={memory.id}>{memory.text}</li>)}</ul>
  </details>;
}
