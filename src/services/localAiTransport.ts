import { invoke, isTauri } from "@tauri-apps/api/core";

export const localAiTransport: typeof invoke = async (command, args) => {
  if (isTauri()) return invoke(command, args);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 125_000);
  try {
    const response = await fetch("/api/local-ai", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command, args }), signal: controller.signal,
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw Error(typeof body.error === "string" ? body.error : "Local AI is unavailable. Start the AI preview and Ollama.");
    }
    return (await response.json()).result;
  } catch (error) {
    if (error instanceof TypeError) throw Error("Cannot reach the AI preview. Start the Tailscale preview and Ollama.");
    if (error instanceof Error && error.name === "AbortError") throw Error("Local AI timed out. Check Ollama and try a smaller model.");
    throw error;
  } finally { clearTimeout(timer); }
};
