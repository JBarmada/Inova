import { createRoot } from "react-dom/client";
import { App } from "./App";
import { initialize } from "./state/store";
import { initializeDesktop } from "./services/desktop";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);
Promise.all([initialize(), initializeDesktop()]).then(() => root.render(<App />)).catch((error: unknown) => {
  root.render(<main className="startup-error"><h1>Your save could not be opened.</h1>
    <p>Inova has not replaced your saved data. Check the error before trying again.</p>
    <pre>{error instanceof Error ? error.message : String(error)}</pre>
    <button onClick={() => location.reload()}>Retry</button></main>);
});
