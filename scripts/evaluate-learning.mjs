import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { createServer } from "vite";

const model = process.argv[2] ?? "gemma3:4b";
if (!["gemma3:4b", "gemma3:12b"].includes(model)) throw Error("Choose gemma3:4b or gemma3:12b.");
const dryRun = process.argv.includes("--dry-run");
if (dryRun) process.stdout.write("DRY RUN: placeholder replies only; no model quality is being evaluated.\n");
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
    if (dryRun) return JSON.stringify({ reply: "Dry-run placeholder.", memoryQuote: "", memoryCategory: "misc", offerQuest: false });
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

  async function ask(label, text, includeRecent = false) {
    state = reduce(state, { type: "chat-share", text });
    const messageIndex = state.chat.messages.length - 1;
    const started = performance.now();
    try {
      const result = await localChat(text, state, call, { includeRecent, beforeIndex: messageIndex });
      state = reduce(state, { type: "chat-reply", messageIndex, originalText: text, ...result });
      process.stdout.write(`${label}: REVIEW (${((performance.now() - started) / 1000).toFixed(1)}s) ${JSON.stringify(result.reply)}\n`);
      process.stdout.write(`  Sent memories: ${JSON.stringify(lastInput.memories)}\n`);
      if (includeRecent) process.stdout.write(`  Sent conversation: ${JSON.stringify(lastInput.recentConversation ?? [])}\n`);
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
  state = initialState();
  remember("Sam's birthday is December 8", "sam-date", "events");
  remember("Alex's birthday is June 9", "alex-date", "events");
  remember("Lee's birthday is May 2", "lee-date", "events");
  remember("Pat's birthday is July 1", "pat-date", "events");
  remember("My friend Sam likes tea", "sam-friend", "people");
  await ask("introduce Sam", "Tell me about Sam");
  await ask("follow-up among competing dates", "When is her birthday?", true);
  state = reduce(state, { type: "memory-permission", id: "sam-date", allowed: false });
  await ask("revoked birthday", "When is Sam's birthday?");
  process.stdout.write("All records are fictional. Review replies, sent memories and conversation for wrong people, dates and unsupported claims. This does not test the native app.\n");
  if (errors) process.exitCode = 1;
} finally { await vite.close(); }
