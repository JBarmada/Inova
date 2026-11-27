export function bodyChangeInterruptsWalk(walking: boolean, previous: string | null, next: string | null) {
  return walking && previous !== next;
}

import { useEffect, useRef } from "react";


export function useBodyWalkInterruption(body: string | null, walking: boolean, stop: () => void) {
  const previousBody = useRef(body);
  useEffect(() => {
    const interrupted = bodyChangeInterruptsWalk(walking, previousBody.current, body);
    previousBody.current = body;
    if (interrupted) stop();
  }, [body, walking, stop]);
}
