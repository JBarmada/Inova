import { useEffect, type RefObject } from "react";
import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function useOutsideDismiss(open: boolean, trigger: RefObject<HTMLElement | null>, panel: RefObject<HTMLElement | null>, onDismiss: () => void) {
  useEffect(() => {
    if (!open) return;
    let active = true;
    let stopNative: (() => void) | undefined;
    function dismiss() {
      if (!active) return;
      active = false;
      onDismiss();
    }
    function pointerDown(event: PointerEvent) {
      if (!(event.target instanceof Node)) return;
      if (!trigger.current?.contains(event.target) && !panel.current?.contains(event.target)) dismiss();
    }
    document.addEventListener("pointerdown", pointerDown, true);
    window.addEventListener("blur", dismiss);
    if (isTauri()) void getCurrentWindow().onFocusChanged(({ payload }) => {
      if (!payload) dismiss();
    }).then((stop) => {
      if (active) stopNative = stop;
      else stop();
    }).catch(console.error);
    return () => {
      active = false;
      document.removeEventListener("pointerdown", pointerDown, true);
      window.removeEventListener("blur", dismiss);
      stopNative?.();
    };
  }, [open, trigger, panel, onDismiss]);
}
