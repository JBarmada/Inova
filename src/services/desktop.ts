import { invoke, isTauri } from "@tauri-apps/api/core";
import { availableMonitors, getCurrentWindow, LogicalSize, PhysicalPosition } from "@tauri-apps/api/window";
import { FLOAT_HEIGHT, FLOAT_WIDTH, visiblePosition, type Bounds, type WindowLayout } from "./windowGeometry";
import { readWindowLayout, writeWindowLayout } from "./windowLayoutStorage";

let layout: WindowLayout = { version: 1 };
let floating = false;
let switching = false;
let operations = Promise.resolve();
let timer: ReturnType<typeof setTimeout> | undefined;
let initialized: Promise<void> | undefined;

async function capture(): Promise<Bounds> {
  const window = getCurrentWindow();
  const [position, size, scale, maximized] = await Promise.all([
    window.outerPosition(), window.innerSize(), window.scaleFactor(), window.isMaximized(),
  ]);
  if (!floating && maximized && layout.home) return { ...layout.home, maximized };
  return { x: position.x, y: position.y, width: size.width / scale, height: size.height / scale, maximized };
}

async function remember(): Promise<void> {
  if (switching) return;
  layout = { ...layout, [floating ? "floating" : "home"]: await capture() };
  await writeWindowLayout(layout);
}

function scheduleSave(): void {
  if (switching) return;
  clearTimeout(timer);
  timer = setTimeout(() => { void enqueue(remember).catch(console.error); }, 180);
}

function enqueue(work: () => Promise<void>): Promise<void> {
  const next = operations.catch(() => undefined).then(work);
  operations = next;
  return next;
}

async function applyMode(enabled: boolean, bounds: Bounds): Promise<void> {
  const window = getCurrentWindow();
  await window.unmaximize();
  await window.setAlwaysOnTop(enabled);
  await window.setDecorations(!enabled);
  await window.setResizable(!enabled);
  await window.setPosition(new PhysicalPosition(bounds.x, bounds.y));
  await window.setSize(new LogicalSize(bounds.width, bounds.height));
  const [monitors, size] = await Promise.all([availableMonitors(), window.outerSize()]);
  const point = visiblePosition(bounds, size, monitors.map((monitor) => monitor.workArea));
  await window.setPosition(new PhysicalPosition(point.x, point.y));
  if (!enabled && bounds.maximized) await window.maximize();
}

export async function initializeDesktop(): Promise<void> {
  if (!isTauri()) return;
  initialized ??= startDesktop();
  return initialized;
}

async function startDesktop(): Promise<void> {
  try { layout = await readWindowLayout(); } catch (error) { console.warn("Window placement could not be loaded.", error); }
  switching = true;
  try { if (layout.home) await applyMode(false, layout.home); } finally { switching = false; }
  const window = getCurrentWindow();
  await window.onMoved(scheduleSave);
  await window.onResized(scheduleSave);
  let closing = false;
  await window.onCloseRequested(async (event) => {
    if (closing) return;
    event.preventDefault();
    clearTimeout(timer);
    try { await enqueue(remember); } catch (error) { console.error("Window placement could not be saved.", error); }
    closing = true;
    await window.close();
  });
}

export async function setPetMode(enabled: boolean): Promise<void> {
  if (!isTauri()) throw Error("Floating mode needs the desktop app. Run npm run desktop.");
  await initializeDesktop();
  return enqueue(async () => {
    if (floating === enabled) return;
    clearTimeout(timer);
    const previous = await capture();
    layout = { ...layout, [floating ? "floating" : "home"]: previous };
    await writeWindowLayout(layout);
    const target = enabled
      ? { ...previous, ...layout.floating, width: FLOAT_WIDTH, height: FLOAT_HEIGHT, maximized: false }
      : layout.home ?? { ...previous, width: 1040, height: 780, maximized: false };
    switching = true;
    try {
      await applyMode(enabled, target);
      floating = enabled;
    } catch (error) {
      await applyMode(floating, previous).catch(console.error);
      throw error;
    } finally { switching = false; }
    await remember();
  });
}

export function fitFloatingHeight(height: number): Promise<void> {
  return fitFloatingSize(FLOAT_WIDTH, height);
}

export function fitFloatingSize(width: number, height: number): Promise<void> {
  if (!isTauri()) return Promise.resolve();
  return enqueue(async () => {
    if (!floating) return;
    const window = getCurrentWindow();
    const [size, scale, position, previousOuter] = await Promise.all([
      window.innerSize(), window.scaleFactor(), window.outerPosition(), window.outerSize(),
    ]);
    const cssToLogical = (globalThis.devicePixelRatio || scale) / scale;
    const target = Math.ceil(Math.max(FLOAT_HEIGHT, height) * cssToLogical);
    const targetWidth = Math.ceil(Math.max(FLOAT_WIDTH, width) * cssToLogical);
    if (Math.abs(size.height / scale - target) > 1 || Math.abs(size.width / scale - targetWidth) > 1) {
      const monitors = await availableMonitors();
      const outer = { width: Math.round(targetWidth * scale), height: Math.round(target * scale) };
      const center = position.x + previousOuter.width / 2;
      const areas = monitors.map((monitor) => monitor.workArea);
      const area = areas.find(({ position: p, size: s }) => center >= p.x && center < p.x + s.width && position.y >= p.y && position.y < p.y + s.height);
      const anchored = { x: position.x + Math.trunc((previousOuter.width - outer.width) / 2), y: position.y, width: targetWidth, height: target, maximized: false };
      const point = visiblePosition(anchored, outer, area ? [area] : areas);
      await invoke("resize_floating", { x: point.x, y: point.y, width: outer.width, height: outer.height });
    }
  });
}
