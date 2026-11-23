import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { App } from "./App";
import { initialize } from "./state/store";
import { initializeDesktop } from "./services/desktop";
import "./styles.css";
import { runStartup, StartupFailure, type StartupTimings } from "./services/startup";
import { recordStartup } from "./services/startupDiagnostics";

function ReadyApp({ timings }: { timings: StartupTimings }) {
  useEffect(() => {
    void recordStartup({ ...timings, uiReadyMs: Math.round(performance.now()) }).catch(console.error);
  }, [timings]);
  return <App />;
}

const root = createRoot(document.getElementById("root")!);
void runStartup({ loadSave: initialize, prepareWindow: initializeDesktop, onPhase: (text) => {
  const stage = document.getElementById("startup-stage");
  if (stage) stage.textContent = text;
} }).then((timings) => root.render(<ReadyApp timings={timings} />)).catch((error: unknown) => {
  root.render(<main className="startup-error"><h1>{error instanceof StartupFailure && error.phase === "save" ? "Your save could not be opened." : "Inova could not finish starting."}</h1>
    <p>Inova has not replaced your saved data. Check the error before trying again.</p>
    <pre>{error instanceof Error ? error.message : String(error)}</pre>
    <button onClick={() => location.reload()}>Retry</button></main>);
});
