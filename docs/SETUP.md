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

If `cargo` is not found on a Mac that has Rust installed, rustup's folder is not on PATH. Add it for the session with `export PATH="$HOME/.cargo/bin:$PATH"`.

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

The wardrobe branch uses selected Pocket Pup dog exports, temporary equipment fitting markers, and synthesized tones. It has no recorded bark, final garment art, live AI, account integration, or actual schedule optimization. See WARDROBE_SPEC.md for isolated test outfits and pose previews.

## Checks and builds

```sh
npm run check
npm run tauri build -- --no-bundle
```

The first checks source sizes, types, domain behavior, and the frontend build. The second compiles the native app without producing an installer. `npm run tauri build` also requests platform bundles. GitHub runs the checks and native compilation on Windows and Mac.

To test natively without touching your real save, run `npm run tauri dev -- --config src-tauri/tauri.playtest.json`. It uses a separate `com.inova.nativefloat` data folder and the window title Inova Playtest. See [NATIVE_FLOAT_CHECKLIST.md](NATIVE_FLOAT_CHECKLIST.md).

Close a running Windows release executable before rebuilding it. If port 1420 is occupied, stop the other Inova development server. Do not change only one of the Vite port and Tauri devUrl.

## Data and troubleshooting

Desktop state is stored by the Tauri store plugin as `inova.json` in the application data directory for `com.inova.companion`. This local file is not encrypted. Use fictional data during development. A save-load error stops initialization instead of replacing the save with empty data. Back up a problem save before asking an assistant to repair or reset it.

Report issues with the repository's App issue template: platform, commit, exact steps, expected and actual result, and whether this was desktop or preview. Never include private journals or credentials in a report.
