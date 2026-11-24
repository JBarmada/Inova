import { useEffect, useRef } from "react";

export function useChatAutoScroll(count: number) {
  const history = useRef<HTMLDivElement>(null);
  useEffect(() => { if (history.current) history.current.scrollTop = history.current.scrollHeight; }, [count]);
  return history;
}
