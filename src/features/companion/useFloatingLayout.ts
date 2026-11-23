import { useEffect, useRef } from "react";
import { fitFloatingHeight } from "../../services/desktop";

export function useFloatingLayout(floating: boolean) {
  const element = useRef<HTMLElement>(null);
  useEffect(() => {
    document.documentElement.classList.toggle("pet-mode", floating);
    if (!floating || !element.current) return;
    let frame = 0;
    function measure() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (element.current) void fitFloatingHeight(element.current.getBoundingClientRect().height).catch(console.error);
      });
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element.current);
    measure();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("pet-mode");
    };
  }, [floating]);
  return element;
}
