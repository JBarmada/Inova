import { useEffect, useRef, useState } from "react";
import { clipSource, clipTiming, createClipPlayback, type ClipFrame, type ClipRequest } from "./dogClips";
import { playCue } from "../../services/audio";

export function useDogClip(request: ClipRequest | null | undefined, muted: boolean, reduced: boolean) {
  const [frame, setFrame] = useState<ClipFrame | null>(null);
  const mute = useRef(muted);
  mute.current = muted;
  useEffect(() => {
    setFrame(null);
    if (!request) return;
    let cancel: (() => void) | undefined;
    let played = false;
    const start = () => {
      const { markers } = clipTiming[request.clip];
      cancel = createClipPlayback(request, reduced, (next) => {
        setFrame(next);
        if (!next || played) return;
        if ("bark" in markers && next.elapsed === markers.bark) {
          played = true;
          playCue("bark", mute.current);
        } else if (request.demo && "fanfare" in markers && next.elapsed === markers.fanfare) {
          played = true;
          playCue("reward", mute.current);
        }
      });
    };
    if (request.clip === "12-single-bark") {
      start();
      return () => cancel?.();
    }
    const image = new Image();
    image.onload = start;
    image.src = clipSource(request.clip);
    return () => { image.onload = null; cancel?.(); };
  }, [request, reduced]);
  return frame && frame.clip === request?.clip && frame.demo === request.demo ? frame : null;
}
