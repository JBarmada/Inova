# Floating dog native checklist (Mac and Windows)

Use this to confirm the floating desktop dog (must-have M2) on a real machine. Browser previews and compilation don't count. Use a fictional dog name only. The test profile (`src-tauri/tauri.playtest.json`, identifier `com.inova.nativefloat`, window title **Inova Playtest**) keeps its own data folder, so your real Inova save and window placement are never touched.

Mac passed all ten steps on November 26, 2026: [Mac results](evidence/native-float-mac/README.md). **Windows is pending:** fill in [the Windows results](evidence/native-float-windows/README.md).

## Launch

Close any other running Inova first, so only one window is titled Inova Playtest.

Windows (PowerShell, in your project folder):

```powershell
# From the latest integrated checkout; no branch switch is required.
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
npm ci
npm run tauri dev -- --config src-tauri/tauri.playtest.json
```

Mac:

```bash
# From the latest integrated checkout; no branch switch is required.
PATH="$HOME/.cargo/bin:$PATH" npm run tauri dev -- --config src-tauri/tauri.playtest.json
```

The first build takes a few minutes. When the app quits, the command ends too; run the same last line again to relaunch.

## Steps

| # | Do this | Pass if |
| --- | --- | --- |
| 1 | Adopt a dog with a made-up name | Home shows the named dog |
| 2 | Click the float icon (top right) | Window shrinks to the dog, with no title bar or frame |
| 3 | Look around the dog | Your desktop or other apps show through; there is no solid box |
| 4 | Click into another app (Explorer/Finder, a browser) | The dog stays in front |
| 5 | Drag the dog by its body | It moves and stays where dropped |
| 6 | Hover the dog; open Settings; open and close the bone toy; click outside the toy | Controls appear; the dog doesn't jump or get clipped; an outside click closes the toy |
| 7 | Click Home, then Float again | Home returns to its earlier size and place; float returns to the last dragged spot |
| 8 | While floating: Settings → **Quit Inova**. Relaunch | App fully exits; after relaunch the dog is still adopted, and home and float both reopen in their saved places |
| 9 | Click Home, move the big window, then click the window's close button. Relaunch | App fully exits; home reopens where you moved it |
| 10 | Settings: Sound off, Dev mode on. Float, click Sit, then tired. Wait about 9 s, then click Stand | Bend → tuck → loaf plays; Stand returns to standing |

For steps 8 and 9, also confirm in Task Manager (Windows) or Activity Monitor (Mac) that no `inova` process is left.

## Windows-only extras

- Change display scaling to 125% and then 150% (Settings → System → Display). Repeat steps 2, 3, 5 and 7 at each setting.
- Check how the floating dog appears in the taskbar and in Alt-Tab, and note what you see.
- If you have a second monitor: drag the dog onto it, click Home and then Float, and check it returns to the second monitor.

## Report

Copy the results table into `docs/evidence/native-float-windows/README.md`. Mark each step pass or fail, with one sentence for any failure. Add screenshots for step 3 (transparency) and any failure. Include your Windows version and display scaling. Keep the results on the integrated branch, without publishing until reviewed.
