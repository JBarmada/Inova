# Shared Architecture

Working agreement for the November 22 starter. Tauri is team-selected; the implementation defaults below keep the three feature tracks compatible until the team deliberately changes them.

## Framework and boundaries

- Tauri 2 and Rust for the desktop application and native capabilities.
- React, TypeScript, Vite, and CSS for the interface. Node 24 and npm are the common development tools.
- Zod schemas validate saved state. Commit npm and Cargo lockfiles.
- One app window, one shared store, and one mutation queue for the initial build.
- Tauri's store plugin persists desktop state. The browser preview adapter uses localStorage.
- No cloud account, hosted backend, external integration, or AI provider is selected or required to run the starter.

The single window switches between the home interface and a compact transparent always-on-top companion mode. This avoids separate windows maintaining conflicting state. A second window requires a coordinated state-sync design before implementation.

## Directory map

| Path | Responsibility |
| --- | --- |
| src/features/companion | Adoption, dog appearance, and companion interactions |
| src/features/quests | Commitment entry, quest suggestions, and quest actions |
| src/features/world | Wardrobe and memory bookshelf |
| src/shared | Schemas, action contract, item catalog, shared action feedback helper |
| src/state | Defaults, reducer, quest rewards, serialized persistent store |
| src/services | Storage, desktop controls, sound, and replaceable sample planner |
| src-tauri | Rust shell, desktop configuration, capabilities, and generated icons |
| public | Shared assets; starter dog SVG is original placeholder art |

## Update flow

Feature UI dispatches an Action. The shared store applies the pure reducer, validates the result, saves it, and only then publishes new state to React. This serializes updates in the one app window and reports save errors instead of displaying unsaved success.

Use `useInova()` to read state and `dispatch(action)` to change it. Use the shared `useAction()` helper for waiting and visible success/error feedback. Do not create separate inventory, pet, or memory copies in feature folders.

## Shared ownership

The companion developer is the initial integration owner for App.tsx, native configuration, window controls, package dependencies, and shared styles. The quest developer owns quest domain rules and the planner. The world developer owns the item catalog and memory UI. Changes to schemas, action types, storage, or the shared reducer require coordination with the affected developers.

The integration role is a merge responsibility, not a claim that this person must author every shared change. Keep feature styles in separate files once work grows; avoid three people repeatedly editing styles.css.

## Starter limitations

Transparency does not imply click-through. Transparent padding can still intercept desktop clicks; selective click-through and full-screen/virtual-desktop behavior need platform testing and further work. Floating mode currently changes the same window size and does not restore its prior exact position or dimensions. Its control area can scroll if content exceeds the compact window.

The sample planner is deterministic and includes only explicitly allowed memories in its context. There is no AI request, model credential, RAG index, or background scheduler. Future live requests belong behind a Rust command/provider boundary, not a secret exposed through VITE_ variables.

## Sources

- [Tauri process model](https://v2.tauri.app/concept/process-model/).
- [Window API](https://v2.tauri.app/reference/javascript/api/namespacewindow/) and [window configuration](https://v2.tauri.app/reference/config/).
- [Persistent store](https://v2.tauri.app/plugin/store/).
- [Calling Rust](https://v2.tauri.app/develop/calling-rust/) and [capabilities](https://v2.tauri.app/security/capabilities/).

API support is not evidence of hands-on success on every platform. See IMPLEMENTATION_STATUS.md for actual verification.
