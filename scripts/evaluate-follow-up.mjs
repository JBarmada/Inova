import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { createServer } from "vite";

const model = process.argv[2] ?? "gemma3:4b";
if (!["gemma3:4b", "gemma3:12b"].includes(model)) throw Error("Choose gemma3:4b or gemma3:12b.");
const source = await readFile(new URL("../src-tauri/src/local_plan.rs", import.meta.url), "utf8");
const prompt = source.match(/\{"role":"system", "content":"([^"]+)"\}/)?.[1];
if (!prompt) throw Error("The native planning prompt could not be located; update this evaluator.");
const vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });

try {
  const { initialState } = await vite.ssrLoadModule("/src/state/defaults.ts");
  const { reduce } = await vite.ssrLoadModule("/src/state/reducer.ts");
  const { proposeLocalPlan } = await vite.ssrLoadModule("/src/services/localPlan.ts");
  const { prepareChatPlan } = await vite.ssrLoadModule("/src/services/prepareChatPlan.ts");
  const at = "2026-11-23T00:00:00.000Z";
  const memory = { id: "support", text: "Short practice sessions help me focus", aiAllowed: true, createdAt: at };
  const commitment = { id: "goal", title: "Prepare an astronomy presentation", createdAt: at };
  let state = reduce(initialState(), { type: "chat-goal", text: commitment.title });
  state = reduce(state, { type: "chat-skip" });
  state = reduce(state, { type: "add-memory", memory });
  state = reduce(state, { type: "accept-planned-quest", commitment, memorySnapshot: [{ id: memory.id, text: memory.text }],
    quest: { id: "done", commitmentId: "goal", title: "Draft three presentation points", reason: "Start small", minutes: 10,
      sourceIds: ["goal", "support"], status: "proposed", planner: "local" } });
  state = reduce(state, { type: "complete-quest", id: "done" });
  state = reduce(state, { type: "add-memory", memory: { id: "reflection", text: "Speaking the points aloud helped; I want to practice transitions", aiAllowed: true, questId: "done", createdAt: at } });
  state = reduce(state, { type: "chat-follow-up", questId: "done" });
  let input, transportError, planningError;

  async function call(_command, args) {
    input = JSON.parse(args.input);
    try {
      const result = await fetch("http://127.0.0.1:11434/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(120_000),
        body: JSON.stringify({ model, stream: false, format: { type: "object", properties: {
          explanation: { type: "string" }, steps: { type: "array", minItems: 1, maxItems: 3, items: { type: "object", properties: {
            title: { type: "string" }, reason: { type: "string" }, minutes: { type: "integer", minimum: 1, maximum: 120 } }, required: ["title", "reason", "minutes"] } },
          deadlineLocal: { type: "string" }, deadlineDate: { type: "string" }, deadlineEvidence: { type: "string" }, effortMinutes: { type: "integer" }, effortEvidence: { type: "string" },
        }, required: ["explanation", "steps", "deadlineLocal", "deadlineDate", "deadlineEvidence", "effortMinutes", "effortEvidence"] },
        messages: [{ role: "system", content: prompt }, { role: "user", content: args.input }], options: { temperature: 0.2, num_predict: 400, num_ctx: 4096 } }) });
      if (!result.ok) throw Error(`Ollama HTTP ${result.status}`);
      return (await result.json()).message.content;
    } catch (error) { transportError = error.message; throw error; }
  }

  const started = performance.now();
  const draft = await prepareChatPlan(state.chat.goal, state, async (goal, current) => {
    try { return await proposeLocalPlan(goal, current, call); }
    catch (error) { planningError = error.message; throw error; }
  });
  process.stdout.write(`Elapsed: ${((performance.now() - started) / 1000).toFixed(1)}s\nInput: ${JSON.stringify(input)}\n`);
  process.stdout.write(`Provider: ${draft.fallback ? "sample fallback" : model}\nExplanation: ${JSON.stringify(draft.explanation)}\nSteps: ${JSON.stringify(draft.steps)}\n`);
  if (transportError) process.stdout.write(`Transport error: ${transportError}\n`);
  if (planningError) process.stdout.write(`Planning error: ${planningError}\n`);
  if (draft.fallback) process.exitCode = 1;
  else {
    const accepted = reduce(state, { type: "accept-planned-quest", ...draft, quest: { ...draft.quest, futureSteps: draft.steps.slice(1) } });
    process.stdout.write(`Simulated acceptance: ${JSON.stringify({ priorQuestId: accepted.quests.at(-1).priorQuestId, sourceIds: accepted.quests.at(-1).sourceIds, rewardedQuestIds: accepted.rewardedQuestIds })}\n`);
  }
  process.stdout.write("Fictional data only. Review for repeated work, unsupported details and usefulness; this does not exercise the native UI.\n");
} finally { await vite.close(); }
