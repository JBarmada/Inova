# Run Inova

Target: Windows and macOS. Deadline: December 1, 2026. The browser preview is a convenient workspace for interface features; it cannot prove desktop transparency, dragging, or always-on-top behavior.

## First time on each computer

Install Node.js 24 LTS and a current stable Rust toolchain, then follow the platform prerequisites below. Restart the terminal after installation and check:

```sh
node --version
npm --version
rustc --version
cargo --version
```

Rust must satisfy the dependencies in Cargo.lock; use current stable rather than assuming an old installation works.

### Windows

Install Microsoft C++ Build Tools with Desktop development with C++, the Windows SDK, and Microsoft Edge WebView2. Follow [Tauri's official prerequisites](https://v2.tauri.app/start/prerequisites/).

Rust was installed on the initial Windows workstation without modifying PATH. If `cargo` is not found there, add it to the current PowerShell session:

```powershell
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
```

### Mac

Install Apple's command line developer tools and Rust using the [official Tauri prerequisites](https://v2.tauri.app/start/prerequisites/). The command line tools are sufficient for the desktop target:

```sh
xcode-select --install
```

Build the Mac app on a Mac. The starter does not require an Apple developer account for local development. Signing and public distribution are separate work.

## Clone and run

```sh
git clone git@github.com:JBarmada/Inova.git
cd Inova
npm ci
npm run desktop
```

Use the existing project folder instead of cloning into it again if you already have the checkout. The first desktop build downloads and compiles Rust dependencies and can take several minutes.

## Quick interface preview

```sh
npm run dev
```

Open the printed local URL. No Rust toolchain is needed for this preview. Browser saves use localStorage and are separate from desktop saves. Use one preview tab at a time; cross-tab synchronization is not implemented.

## Try the starter

1. Adopt a dog and name it.
2. On desktop, select Float my dog, drag the dog area, and select Open home to return.
3. Add a commitment under quests; make, accept, and complete a sample quest.
4. Equip the unlocked notebook under Wardrobe (shirt icon). Open Memories separately with the open-book icon.
5. Open the bookshelf and save/read a reflection. Personalization is opt-in per entry.
6. Restart or reload and confirm that state persists.

The wardrobe branch uses selected Pocket Pup dog exports, temporary equipment fitting markers, and synthesized tones. It has no recorded bark, final garment art, account integration, or actual schedule optimization. Local AI is optional and requires the separate service described below. See WARDROBE_SPEC.md for isolated test outfits and pose previews.

## Checks and builds

```sh
npm run check
npm run tauri build -- --no-bundle
```

The first checks source sizes, types, domain behavior, and the frontend build. The second compiles the native app without producing an installer. `npm run tauri build` also requests platform bundles. GitHub runs the checks and native compilation on Windows and Mac.

Close a running Windows release executable before rebuilding it. If port 1420 is occupied, stop the other Inova development server. Do not change only one of the Vite port and Tauri devUrl.

## Data and troubleshooting

Desktop state is stored by the Tauri store plugin as `inova.json` in the application data directory for `com.inova.companion`. This local file is not encrypted. Use fictional data during development. A save-load error stops initialization instead of replacing the save with empty data. Back up a problem save before asking an assistant to repair or reset it.

Report issues with the repository's App issue template: platform, commit, exact steps, expected and actual result, and whether this was desktop or preview. Never include private journals or credentials in a report.

## Local AI (build-out worktree)

The Quests page can request a local `gemma3:12b` or `gemma3:4b` proposal using an Ollama service at `127.0.0.1:11434`. Select a model in Quests; 12B is the provisional default, while 4B can be faster but may be less reliable. Install Ollama using its [official setup instructions](https://docs.ollama.com/), pull the selected model with `ollama pull gemma3:12b` or `ollama pull gemma3:4b`, and start Ollama. Models run locally; downloads require internet and disk space. Inova does not currently bundle, install, or start the service. Use Check local AI on the Quests page to see whether the selected model is available. If it is unavailable, use the separately labeled sample option. The Quests screen includes only reflections explicitly permitted for suggestions.

The development benchmark in this checkout used a verified portable Windows Ollama installation and models under ignored `.tools/ollama`; they are not in Git and do not automatically start after a restart. See [measured trial](evidence/local-models-2026-11-23/README.md) and [build-out checklist](BUILD_OUT_CHECKLIST.md).

To start this checkout's already-downloaded portable runtime on Windows, open a separate PowerShell window in the worktree and run:

```powershell
$env:OLLAMA_MODELS = (Resolve-Path '.tools/ollama').Path + '\models'
.\.tools\ollama\runtime\ollama.exe serve
```

Keep that window open while using local AI. Stop the service with Ctrl+C when finished. If a different Ollama service is already running on port 11434, use that service and install the model into its model store instead.
