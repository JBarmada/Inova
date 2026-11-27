import { buildPayload } from "./preview-ai-payload.mjs";

const models = new Set(["gemma3:4b", "gemma3:12b"]);
const commands = new Set(["local_model_available", "local_companion_reply", "local_quest", "local_quest_plan"]);
let active = 0;

async function readLimited(stream, limit) {
  const chunks = []; let size = 0;
  for await (const chunk of stream) {
    size += chunk.length;
    if (size > limit) throw Error("Request or response is too large.");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function handleAi(request, response, origin) {
  const send = (status, value) => { response.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" }); response.end(JSON.stringify(value)); };
  if (request.method !== "POST" || request.headers.origin !== origin || !request.headers["content-type"]?.startsWith("application/json")) return send(403, { error: "Request denied." });
  if (active >= 2) return send(429, { error: "AI is busy." });
  active++;
  try {
    const { command, args } = JSON.parse(await readLimited(request, 25000));
    if (!commands.has(command) || !models.has(args?.model) || (command !== "local_model_available" && (typeof args?.input !== "string" || Buffer.byteLength(args.input) > 24000))) return send(400, { error: "Invalid request." });
    const checking = command === "local_model_available";
    const result = await fetch(`http://127.0.0.1:11434/api/${checking ? "tags" : "chat"}`, {
      method: checking ? "GET" : "POST", headers: { "Content-Type": "application/json" },
      ...(checking ? {} : { body: JSON.stringify(await buildPayload(command, args.model, args.input)) }),
      signal: AbortSignal.timeout(checking ? 4000 : 120000), redirect: "error",
    });
    if (result.status === 404 && !checking) return send(503, { error: `The selected model ${args.model} is not installed. Run ollama pull ${args.model}.` });
    if (!result.ok || !result.body) return send(503, { error: "Ollama could not process this request. Check the selected model and try again." });
    const data = JSON.parse(await readLimited(result.body, 65536));
    const value = checking ? data.models?.some((entry) => entry.name === args.model) : data.message?.content;
    if (checking ? typeof value !== "boolean" : typeof value !== "string") throw Error("Invalid model response.");
    return send(200, { result: value });
  } catch (error) { return send(503, { error: error?.name === "TimeoutError" ? "Ollama timed out. Try a smaller model or try again." : "Cannot connect to Ollama. Start Ollama and try again." }); }
  finally { active--; }
}
