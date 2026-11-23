import { useState } from "react";

export function useAction() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function run(work: () => Promise<void>, success = "Saved.") {
    setBusy(true);
    try {
      await work();
      setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed. Please retry.");
    } finally {
      setBusy(false);
    }
  }
  return { run, busy, message };
}
