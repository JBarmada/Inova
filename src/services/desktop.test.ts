import { beforeEach, expect, it, vi } from "vitest";
import type { WindowLayout } from "./windowGeometry";

const fake = vi.hoisted(() => ({
  position: { x: 100, y: 80 }, size: { width: 1040, height: 780 },
  maximized: false, decorated: true, resizable: true, onTop: false, scale: 1,
  saved: { version: 1 } as WindowLayout,
  rejectWrite: false,
}));

vi.mock("@tauri-apps/api/core", () => ({ isTauri: () => true }));
vi.mock("@tauri-apps/api/window", () => ({
  LogicalSize: class { constructor(public width: number, public height: number) {} },
  PhysicalPosition: class { constructor(public x: number, public y: number) {} },
  availableMonitors: async () => [{ workArea: { position: { x: 0, y: 0 }, size: { width: 1920, height: 1040 } } }],
  getCurrentWindow: () => ({
    outerPosition: async () => ({ ...fake.position }),
    innerSize: async () => ({ ...fake.size }),
    outerSize: async () => ({ ...fake.size }),
    scaleFactor: async () => fake.scale,
    isMaximized: async () => fake.maximized,
    unmaximize: async () => { fake.maximized = false; },
    maximize: async () => { fake.maximized = true; },
    setAlwaysOnTop: async (value: boolean) => { fake.onTop = value; },
    setDecorations: async (value: boolean) => { fake.decorated = value; },
    setResizable: async (value: boolean) => { fake.resizable = value; },
    setPosition: async (value: { x: number; y: number }) => { fake.position = { ...value }; },
    setSize: async (value: { width: number; height: number }) => { fake.size = { width: value.width * fake.scale, height: value.height * fake.scale }; },
    onMoved: async () => () => undefined,
    onResized: async () => () => undefined,
    onCloseRequested: async () => () => undefined,
  }),
}));
vi.mock("./windowLayoutStorage", () => ({
  readWindowLayout: async () => structuredClone(fake.saved),
  writeWindowLayout: async (layout: WindowLayout) => {
    if (fake.rejectWrite) throw Error("Disk unavailable");
    fake.saved = structuredClone(layout);
  },
}));

beforeEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
  Object.assign(fake, { position: { x: 100, y: 80 }, size: { width: 1040, height: 780 },
    maximized: false, decorated: true, resizable: true, onTop: false, scale: 1, saved: { version: 1 }, rejectWrite: false });
});

it("keeps home and floating positions independent through repeated switches", async () => {
  const desktop = await import("./desktop");
  await desktop.setPetMode(true);
  expect(fake.size).toEqual({ width: 248, height: 208 });
  fake.position = { x: 1100, y: 500 };
  await desktop.setPetMode(false);
  expect(fake.position).toEqual({ x: 100, y: 80 });
  expect(fake.size).toEqual({ width: 1040, height: 780 });
  expect(fake.onTop).toBe(false);
  await desktop.setPetMode(true);
  expect(fake.position).toEqual({ x: 1100, y: 500 });
  expect(fake.resizable).toBe(false);
});

it("restores persisted home placement after restart and retains the dog's location", async () => {
  fake.saved = { version: 1,
    home: { x: 250, y: 120, width: 900, height: 650, maximized: false },
    floating: { x: 1300, y: 600, width: 248, height: 208, maximized: false } };
  const desktop = await import("./desktop");
  await desktop.initializeDesktop();
  expect(fake.position).toEqual({ x: 250, y: 120 });
  expect(fake.size).toEqual({ width: 900, height: 650 });
  await desktop.setPetMode(true);
  expect(fake.position).toEqual({ x: 1300, y: 600 });
});

it("leaves the home window untouched when saving its placement fails", async () => {
  const desktop = await import("./desktop");
  fake.rejectWrite = true;
  await expect(desktop.setPetMode(true)).rejects.toThrow("Disk unavailable");
  expect(fake.position).toEqual({ x: 100, y: 80 });
  expect(fake.size).toEqual({ width: 1040, height: 780 });
  expect(fake.onTop).toBe(false);
});

it("fits floating content without changing home geometry", async () => {
  const desktop = await import("./desktop");
  await desktop.setPetMode(true);
  await desktop.fitFloatingHeight(350);
  expect(fake.size.height).toBe(350);
  await desktop.setPetMode(false);
  expect(fake.size).toEqual({ width: 1040, height: 780 });
  await desktop.fitFloatingHeight(250);
  expect(fake.size).toEqual({ width: 1040, height: 780 });
});

it("restores a maximized home window after floating", async () => {
  const desktop = await import("./desktop");
  fake.maximized = true;
  await desktop.setPetMode(true);
  expect(fake.maximized).toBe(false);
  await desktop.setPetMode(false);
  expect(fake.maximized).toBe(true);
  expect(fake.decorated).toBe(true);
  expect(fake.resizable).toBe(true);
});

it("widens for the quest board and collapses back to the dog's compact width", async () => {
  const desktop = await import("./desktop");
  await desktop.setPetMode(true);
  await desktop.fitFloatingSize(384, 650);
  expect(fake.size).toEqual({ width: 384, height: 650 });
  await desktop.fitFloatingSize(248, 208);
  expect(fake.size).toEqual({ width: 248, height: 208 });
});

it("fits zoomed CSS content into the native window without clipping", async () => {
  vi.stubGlobal("devicePixelRatio", 1.5);
  const desktop = await import("./desktop");
  await desktop.setPetMode(true);
  await desktop.fitFloatingSize(384, 600);
  expect(fake.size).toEqual({ width: 576, height: 900 });
  await desktop.setPetMode(false);
  expect(fake.size).toEqual({ width: 1040, height: 780 });
});

it("does not apply OS display scaling twice when fitting the board", async () => {
  fake.scale = 2;
  vi.stubGlobal("devicePixelRatio", 2);
  const desktop = await import("./desktop");
  await desktop.setPetMode(true);
  await desktop.fitFloatingSize(384, 300);
  expect(fake.size).toEqual({ width: 768, height: 600 });
});

it("keeps the compact window fitted when the webview is zoomed out", async () => {
  vi.stubGlobal("devicePixelRatio", 0.8);
  const desktop = await import("./desktop");
  await desktop.setPetMode(true);
  await desktop.fitFloatingSize(248, 208);
  expect(fake.size).toEqual({ width: 199, height: 167 });
});

it("keeps the dog's screen center and top fixed while the toy opens and closes", async () => {
  fake.scale = 1.5;
  vi.stubGlobal("devicePixelRatio", 1.875);
  const desktop = await import("./desktop");
  await desktop.setPetMode(true);
  await desktop.fitFloatingSize(248, 240);
  fake.position = { x: 600, y: 100 };
  const center = fake.position.x + fake.size.width / 2;
  for (const width of [384, 248, 384, 248]) {
    await desktop.fitFloatingSize(width, width === 384 ? 450 : 240);
    expect(Math.abs(fake.position.x + fake.size.width / 2 - center)).toBeLessThanOrEqual(0.5);
    expect(fake.position.y).toBe(100);
  }
  expect(fake.position.x).toBe(600);
});
