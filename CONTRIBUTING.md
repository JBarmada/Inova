# Contributing to Inova

## Before starting

Read [AGENTS.md](AGENTS.md), [AI context](docs/AI_CONTEXT.md), and [current status](docs/IMPLEMENTATION_STATUS.md). Agree on a small task and its visible completion criteria. Check [open decisions](docs/08-decisions-and-open-questions.md) for dependencies.

## Get the files

```sh
git clone git@github.com:JBarmada/Inova.git
cd Inova
```

Follow [setup](docs/SETUP.md), run `npm ci`, then `npm run desktop`. For interface work without Rust, use `npm run dev` and the browser preview. Read the [team plan](docs/TEAM_PLAN.md) and [shared contracts](docs/SHARED_CONTRACTS.md), then choose a focused work area and a small task from the current README table. The older A/B/C handoffs are background references.

## Work together

1. Pull the latest changes before starting a task.
2. Create a focused branch, such as `feature/adoption-flow` or `docs/reward-rules`.
3. Coordinate changes to shared interfaces, asset dimensions, and files another teammate is editing.
4. Make small commits and open a pull request explaining the user-visible change and validation.
5. Update the affected requirements and implementation status when behavior or setup changes.

Branches and pull requests are a suggested starting workflow, not an assertion that branch protection is configured. Owners and task assignments remain unassigned.

## Give your AI enough context

Point it at the repository's AGENTS.md and AI context, then state your specific task. Ask it to inspect the current implementation, preserve teammates' work, and flag shared decisions before introducing dependencies. Never assume the assistant has access to the original chat or private Pages.

## Before sharing changes

- Confirm the feature works as described, including relevant failure cases.
- Check the code-size limits in AGENTS.md.
- Label temporary mock data, simulated progression, and placeholder assets.
- Keep secrets and personal data out of both files and commit history.
- Record asset sources and permissions.
- Run `npm run check`; relevant native changes also need a desktop compile and Windows/Mac runtime reports. Keep setup and status current.

## Documentation ownership

Repository files are the shared implementation reference. Online Pages are companion discussion records and do not automatically sync. Reconcile a new decision into the repository instead of requiring teammates to recover it from chat.
