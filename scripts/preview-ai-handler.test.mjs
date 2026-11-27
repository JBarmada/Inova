import { test } from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { handleAi } from "./preview-ai-handler.mjs";
import { buildPayload } from "./preview-ai-payload.mjs";

async function request(body, origin = "http://100.64.0.1:4175") {
  const req = Readable.from([Buffer.from(JSON.stringify(body))]);
  req.method = "POST"; req.headers = { origin, "content-type": "application/json" };
  const result = {};
  await handleAi(req, { writeHead: (status) => { result.status = status; }, end: (body) => { result.body = JSON.parse(body); } }, "http://100.64.0.1:4175");
  return result;
}

test("bridge limits origin, model and supported commands", async () => {
  assert.equal((await request({}, "http://attacker.invalid")).status, 403);
  assert.equal((await request({ command: "arbitrary", args: { model: "gemma3:4b" } })).status, 400);
  assert.equal((await request({ command: "local_quest_plan", args: { model: "other", input: "{}" } })).status, 400);
  assert.equal((await request({ command: "local_quest_plan", args: { model: "gemma3:4b", input: "x".repeat(24001) } })).status, 400);
});

test("bridge builds native prompts and handles model results", async () => {
  const payload = await buildPayload("local_quest_plan", "gemma3:4b", "{}");
  assert.match(payload.messages[0].content, /Plan 1 to 3 concrete/);
  const previous = globalThis.fetch;
  globalThis.fetch = async (_url, options) => {
    assert.equal(JSON.parse(options.body).model, "gemma3:4b");
    return new Response(JSON.stringify({ message: { content: "{\"reply\":\"Hi\"}" } }));
  };
  try {
    const result = await request({ command: "local_companion_reply", args: { model: "gemma3:4b", input: "{}" } });
    assert.equal(result.status, 200);
    assert.equal(result.body.result, '{"reply":"Hi"}');
  } finally { globalThis.fetch = previous; }
});

test("bridge checks model availability and handles an unavailable service", async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ models: [{ name: "gemma3:4b" }] }));
  try {
    assert.equal((await request({ command: "local_model_available", args: { model: "gemma3:4b" } })).body.result, true);
    assert.equal((await request({ command: "local_model_available", args: { model: "gemma3:12b" } })).body.result, false);
    globalThis.fetch = async () => { throw Error("offline"); };
    assert.equal((await request({ command: "local_model_available", args: { model: "gemma3:4b" } })).status, 503);
  } finally { globalThis.fetch = previous; }
});

test("bridge explains when the selected model is missing", async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = async () => new Response("not found", { status: 404 });
  try {
    const result = await request({ command: "local_companion_reply", args: { model: "gemma3:12b", input: "{}" } });
    assert.equal(result.status, 503);
    assert.match(result.body.error, /gemma3:12b.*not installed/);
  } finally { globalThis.fetch = previous; }
});
