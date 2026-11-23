import { useEffect, useRef } from "react";
import { fitFloatingSize } from "../../services/desktop";
import { currentMonitor } from "@tauri-apps/api/window";
import { isTauri } from "@tauri-apps/api/core";

export function useFloatingLayout(floating: boolean) {
  const element = useRef<HTMLElement>(null);
  useEffect(() => {
    document.documentElement.classList.toggle("pet-mode", floating);
    if (!floating || !element.current) return;
    const root = element.current;
    let disposed = false;
    if (isTauri()) void currentMonitor().then((monitor) => {
      if (monitor && !disposed) root.style.setProperty("--float-work-height", `${monitor.workArea.size.height / (window.devicePixelRatio || monitor.scaleFactor)}px`);
    }).catch(console.error);
    let frame = 0;
    function measure() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (element.current) {
          const bounds = element.current.getBoundingClientRect();
          void fitFloatingSize(bounds.width, bounds.height).catch(console.error);
        }
      });
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element.current);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      disposed = true;
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("pet-mode");
    };
  }, [floating]);
  return element;
}
