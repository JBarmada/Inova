import { expect, it, vi } from "vitest";
import type { invoke } from "@tauri-apps/api/core";
import { initialState } from "../state/defaults";
import { reduce } from "../state/reducer";
import { proposeLocal } from "./localPlanner";

const commitment = { id: "c", title: "Study", createdAt: "2026-11-23T00:00:00.000Z" };
const allowed = { id: "yes", text: "Short sessions help", createdAt: commitment.createdAt, aiAllowed: true };
const privateEntry = { ...allowed, id: "private", text: "Private entry", aiAllowed: false };

it("sends only permitted memories and constructs a validated proposal", async () => {
  const state = { ...initialState(), commitments: [commitment], memories: [allowed, privateEntry] };
  const call = vi.fn().mockResolvedValue(JSON.stringify({ title: "Read one page", reason: "A short start", minutes: 5 }));
  const result = await proposeLocal(commitment, state, call as unknown as typeof invoke);
  const input = JSON.parse(call.mock.calls[0][1].input);
  expect(input.reflections).toEqual([{ id: "yes", text: allowed.text }]);
  expect(JSON.stringify(input)).not.toContain(privateEntry.text);
  expect(result.quest).toMatchObject({ status: "proposed", planner: "local", sourceIds: ["c", "yes"] });
  expect(reduce(state, { type: "propose-quest", ...result }).quests).toHaveLength(1);
  expect(() => reduce(state, { type: "propose-quest", quest: result.quest })).toThrow("evidence is incomplete");
  const revoked = { ...state, memories: [{ ...allowed, aiAllowed: false }] };
  expect(() => reduce(revoked, { type: "propose-quest", ...result })).toThrow("changed");
  const edited = { ...state, memories: [{ ...allowed, text: "Changed" }] };
  expect(() => reduce(edited, { type: "propose-quest", ...result })).toThrow("changed");
});

it("rejects malformed and invalid model outputs", async () => {
  const state = initialState();
  for (const response of ["not json", JSON.stringify({ title: "", reason: "x", minutes: 5 }),
    JSON.stringify({ title: "x", reason: "x", minutes: 999 }), JSON.stringify({ title: "x", reason: "x", minutes: 5, extra: true })]) {
    const call = vi.fn().mockResolvedValue(response);
    await expect(proposeLocal(commitment, state, call as unknown as typeof invoke)).rejects.toThrow("invalid");
  }
});

it("removes model-written title and rationale when supporting memory is revoked", () => {
  const state = { ...initialState(), memories: [allowed], quests: [{ id: "q", commitmentId: "c", title: allowed.text,
    reason: allowed.text, minutes: 5, status: "proposed" as const, planner: "local" as const, sourceIds: ["c", "yes"] }] };
  const result = reduce(state, { type: "memory-permission", id: "yes", allowed: false });
  expect(result.quests[0].title).not.toContain(allowed.text);
  expect(result.quests[0].reason).not.toContain(allowed.text);
  expect(result.quests[0].sourceIds).toEqual(["c"]);
});

it("surfaces local service errors without preventing the sample fallback", async () => {
  const call = vi.fn().mockRejectedValue("Local AI is unavailable. Start Ollama.");
  await expect(proposeLocal(commitment, initialState(), call as unknown as typeof invoke)).rejects.toThrow("Start Ollama");
});

it("sends the selected local model to the native boundary", async () => {
  const state = { ...initialState(), settings: { ...initialState().settings, localModel: "gemma3:4b" as const } };
  const call = vi.fn().mockResolvedValue(JSON.stringify({ title: "A step", reason: "Start small", minutes: 5 }));
  await proposeLocal(commitment, state, call as unknown as typeof invoke);
  expect(call.mock.calls[0][1].model).toBe("gemma3:4b");
});

it("checks only the selected model and reports a stopped service", async () => {
  const { checkLocalModel } = await import("./localPlanner");
  const call = vi.fn().mockResolvedValue(false);
  expect(await checkLocalModel("gemma3:4b", call as unknown as typeof invoke)).toBe(false);
  expect(call).toHaveBeenCalledWith("local_model_available", { model: "gemma3:4b" });
  call.mockRejectedValue("Ollama is not responding. Start it or use the sample planner.");
  await expect(checkLocalModel("gemma3:4b", call as unknown as typeof invoke)).rejects.toThrow("sample planner");
});

it("passes supplied commitment constraints and rejects a quest longer than estimated total effort", async () => {
  const detailed = { ...commitment, deadline: { at: "2026-12-01T20:00:00.000Z", timeZone: "America/Los_Angeles" }, effortMinutes: 5 };
  const call = vi.fn().mockResolvedValue(JSON.stringify({ title: "A step", reason: "Start small", minutes: 10 }));
  await expect(proposeLocal(detailed, initialState(), call as unknown as typeof invoke)).rejects.toThrow("estimated total effort");
  const sent = JSON.parse(call.mock.calls[0][1].input);
  expect(sent.commitment.deadline).toEqual(detailed.deadline);
  expect(sent.commitment.effortMinutes).toBe(5);
});

it("sends and enforces an explicit maximum quest length", async () => {
  const state = { ...initialState(), settings: { ...initialState().settings, questMinuteLimit: 5 } };
  const call = vi.fn().mockResolvedValue(JSON.stringify({ title: "A step", reason: "Start small", minutes: 10 }));
  await expect(proposeLocal(commitment, state, call as unknown as typeof invoke)).rejects.toThrow("length limit");
  expect(JSON.parse(call.mock.calls[0][1].input).maxQuestMinutes).toBe(5);
});

it("returns grounded model details separately from the quest", async () => {
  const entry = { ...commitment, title: "Write by Friday at 5pm, two hours total" };
  const call = vi.fn().mockResolvedValue(JSON.stringify({ title: "Begin writing", reason: "Start small", minutes: 10,
    deadlineLocal: "2026-11-27T17:00", deadlineEvidence: "Friday at 5pm", effortMinutes: 120, effortEvidence: "two hours" }));
  const result = await proposeLocal(entry, initialState(), call as unknown as typeof invoke);
  expect(result.details).toEqual({ deadlineLocal: "2026-11-27T17:00", effortMinutes: 120 });
  expect(result.quest).not.toHaveProperty("deadlineEvidence");
});
