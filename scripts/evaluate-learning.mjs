import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { createServer } from "vite";

const model = process.argv[2] ?? "gemma3:4b";
if (!["gemma3:4b", "gemma3:12b"].includes(model)) throw Error("Choose gemma3:4b or gemma3:12b.");
const prompt = await readFile(new URL("../src-tauri/src/local_chat_prompt.txt", import.meta.url), "utf8");
const vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });

try {
  const { initialState } = await vite.ssrLoadModule("/src/state/defaults.ts");
  const { reduce } = await vite.ssrLoadModule("/src/state/reducer.ts");
  const { localChat } = await vite.ssrLoadModule("/src/services/localChat.ts");
  const { stateSchema } = await vite.ssrLoadModule("/src/shared/schema.ts");
  let state = initialState();
  let lastInput;
  let errors = 0;

  async function call(_command, args) {
    lastInput = JSON.parse(args.input);
    const response = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(120_000),
      body: JSON.stringify({ model, stream: false,
        format: { type: "object", properties: { reply: { type: "string" }, memoryQuote: { type: "string" },
          memoryCategory: { type: "string", enum: ["people", "events", "you", "misc"] }, offerQuest: { type: "boolean" } },
        required: ["reply", "memoryQuote", "memoryCategory", "offerQuest"] },
        messages: [{ role: "system", content: prompt }, { role: "user", content: args.input }],
        options: { temperature: 0.3, num_predict: 120, num_ctx: 4096 } }),
    });
    if (!response.ok) throw Error(`Ollama HTTP ${response.status}`);
    return (await response.json()).message.content;
  }

  function remember(text, id, category) {
    state = reduce(state, { type: "chat-share", text });
    state = reduce(state, { type: "save-chat-memory", messageIndex: state.chat.messages.length - 1, originalText: text,
      memory: { id, text, category, source: "chat", aiAllowed: true, createdAt: "2026-11-23T00:00:00.000Z" } });
  }

  async function ask(label, text) {
    state = reduce(state, { type: "chat-share", text });
    const messageIndex = state.chat.messages.length - 1;
    const started = performance.now();
    try {
      const result = await localChat(text, state, call, { includeRecent: false, beforeIndex: messageIndex });
      state = reduce(state, { type: "chat-reply", messageIndex, originalText: text, ...result });
      process.stdout.write(`${label}: REVIEW (${((performance.now() - started) / 1000).toFixed(1)}s) ${JSON.stringify(result.reply)}\n`);
      process.stdout.write(`  Sent memories: ${JSON.stringify(lastInput.memories)}\n`);
    } catch (error) { errors += 1; process.stdout.write(`${label}: ERROR ${error.message}\n`); }
  }

  await ask("before learning", "What is my name?");
  remember("My name is Alex", "name", "you");
  await ask("name", "What is my name?");
  remember("I take astronomy", "class", "you");
  await ask("class", "What class am I taking?");
  remember("My friend Sam likes tea", "friend", "people");
  remember("Sam's birthday is December 8", "date", "events");
  await ask("friend", "What does Sam like?");
  await ask("date", "When is Sam's birthday?");
  remember("I studied astronomy for three hours", "effort", "you");
  await ask("effort is not preference", "Do I like astronomy?");
  state = reduce(state, { type: "chat-share", text: "Sam prefers coffee now" });
  state = reduce(state, { type: "correct-chat-memory", messageIndex: state.chat.messages.length - 1,
    originalText: "Sam prefers coffee now", target: state.memories.find((entry) => entry.id === "friend"), text: "Sam prefers coffee now" });
  state = stateSchema.parse(JSON.parse(JSON.stringify(state)));
  await ask("corrected friend after reload", "What does Sam like?");
  state = reduce(state, { type: "memory-permission", id: "friend", allowed: false });
  await ask("revoked friend", "What does Sam like?");
  process.stdout.write("All records are fictional. Review every response for invented facts; this does not test the native app or conversation opt-in.\n");
  if (errors) process.exitCode = 1;
} finally { await vite.close(); }
