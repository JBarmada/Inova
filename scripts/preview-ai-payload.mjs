import { readFile } from "node:fs/promises";

const root = new URL("../src-tauri/src/", import.meta.url);
const string = { type: "string" }, integer = { type: "integer" };
const details = { deadlineLocal: string, deadlineDate: string, deadlineEvidence: string, effortMinutes: integer, effortEvidence: string };
const reply = { reply: string, memoryQuote: string, memoryCategory: { type: "string", enum: ["people", "events", "you", "misc"] }, offerQuest: { type: "boolean" } };
const step = { type: "object", properties: { title: string, reason: string, minutes: integer }, required: ["title", "reason", "minutes"] };
const formats = {
  local_companion_reply: reply,
  local_quest: { title: string, reason: string, minutes: integer, ...details },
  local_quest_plan: { explanation: string, steps: { type: "array", minItems: 1, maxItems: 3, items: step }, ...details },
};

export async function buildPayload(command, model, input) {
  const properties = formats[command];
  if (!properties) throw Error("Unsupported request.");
  const file = command === "local_quest_plan" ? "local_plan.rs" : "local_planner.rs";
  const rust = command === "local_companion_reply" ? "" : await readFile(new URL(file, root), "utf8");
  const prompt = command === "local_companion_reply" ? await readFile(new URL("local_chat_prompt.txt", root), "utf8") :
    rust.match(/"role":"system",\s*"content":"([^"\n]+)"/)?.[1];
  if (!prompt) throw Error("Planner prompt unavailable.");
  return { model, stream: false, format: { type: "object", properties, required: Object.keys(properties) },
    messages: [{ role: "system", content: prompt }, { role: "user", content: input }],
    options: { temperature: command === "local_companion_reply" ? 0.3 : 0.2,
      num_predict: command === "local_companion_reply" ? 120 : command === "local_quest_plan" ? 400 : 256, num_ctx: 4096 } };
}
