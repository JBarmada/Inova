import { afterEach, expect, it, vi } from "vitest";
import { localAiTransport } from "./localAiTransport";

afterEach(() => vi.unstubAllGlobals());

it("sends browser AI requests to the same-origin bridge and handles failures", async () => {
  const fetcher = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ result: "reply" }) })
    .mockResolvedValueOnce({ ok: false, json: async () => ({ error: "Local AI is unavailable." }) });
  vi.stubGlobal("fetch", fetcher);
  expect(await localAiTransport("local_companion_reply", { model: "gemma3:4b", input: "{}" })).toBe("reply");
  expect(fetcher.mock.calls[0][0]).toBe("/api/local-ai");
  expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({ command: "local_companion_reply", args: { model: "gemma3:4b", input: "{}" } });
  await expect(localAiTransport("local_companion_reply", {})).rejects.toThrow("unavailable");
});
