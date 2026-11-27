import { expect, it, vi } from "vitest";
import { availableModel } from "./availableModel";

it("switches only when the selected 12B is missing and 4B is confirmed installed", async () => {
  const check = vi.fn(async (model) => model === "gemma3:4b");
  expect(await availableModel("gemma3:12b", check)).toBe("gemma3:4b");
  expect(await availableModel("gemma3:12b", async () => true)).toBe("gemma3:12b");
  expect(await availableModel("gemma3:12b", async () => false)).toBe("gemma3:12b");
  await expect(availableModel("gemma3:12b", async () => { throw Error("offline"); })).rejects.toThrow("offline");
});
