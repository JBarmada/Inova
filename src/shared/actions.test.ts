import { afterEach, expect, it, vi } from "vitest";
import { newId } from "./actions";

afterEach(() => vi.unstubAllGlobals());

it("creates UUIDs using secure random bytes when randomUUID is unavailable", () => {
  const getRandomValues = vi.fn((bytes: Uint8Array) => { bytes.fill(0); return bytes; });
  vi.stubGlobal("crypto", { getRandomValues });
  expect(newId()).toBe("00000000-0000-4000-8000-000000000000");
  expect(getRandomValues).toHaveBeenCalledOnce();
});
