import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useOutsideDismiss } from "./useOutsideDismiss";

const fixture = vi.hoisted(() => ({ cleanup: undefined as (() => void) | undefined }));
vi.mock("react", () => ({ useEffect: (effect: () => (() => void) | undefined) => { fixture.cleanup = effect(); } }));
vi.mock("@tauri-apps/api/core", () => ({ isTauri: () => false }));

class TestNode {
  children = new Set<TestNode>();
  contains(node: TestNode) { return node === this || this.children.has(node); }
}
let pointer: ((event: { target: TestNode }) => void) | undefined;
let blur: (() => void) | undefined;
const removedDocument = vi.fn();
const removedWindow = vi.fn();

beforeEach(() => {
  pointer = undefined;
  blur = undefined;
  vi.stubGlobal("Node", TestNode);
  vi.stubGlobal("document", { addEventListener: (_: string, fn: typeof pointer) => { pointer = fn; }, removeEventListener: removedDocument });
  vi.stubGlobal("window", { addEventListener: (_: string, fn: typeof blur) => { blur = fn; }, removeEventListener: removedWindow });
});
afterEach(() => { fixture.cleanup?.(); fixture.cleanup = undefined; vi.unstubAllGlobals(); vi.clearAllMocks(); });

it("keeps inside clicks open and dismisses blank wrapper/outside clicks once", () => {
  const trigger = new TestNode();
  const panel = new TestNode();
  const child = new TestNode();
  panel.children.add(child);
  const dismiss = vi.fn();
  useOutsideDismiss(true, { current: trigger as unknown as HTMLElement }, { current: panel as unknown as HTMLElement }, dismiss);
  pointer?.({ target: trigger });
  pointer?.({ target: child });
  expect(dismiss).not.toHaveBeenCalled();
  pointer?.({ target: new TestNode() });
  blur?.();
  expect(dismiss).toHaveBeenCalledTimes(1);
});

it("dismisses on focus loss and cleans up listeners without stealing focus", () => {
  const dismiss = vi.fn();
  useOutsideDismiss(true, { current: null }, { current: null }, dismiss);
  blur?.();
  expect(dismiss).toHaveBeenCalledOnce();
  fixture.cleanup?.();
  expect(removedDocument).toHaveBeenCalledWith("pointerdown", pointer, true);
  expect(removedWindow).toHaveBeenCalledWith("blur", blur);
});

it("does not register dismissal handlers when closed", () => {
  useOutsideDismiss(false, { current: null }, { current: null }, vi.fn());
  expect(pointer).toBeUndefined();
  expect(blur).toBeUndefined();
});
