# Track B Commitments and AI Quests

Choose one builder. Branch suggestion: feature/quests. Read ../SETUP.md, ../ARCHITECTURE.md, and ../SHARED_CONTRACTS.md first.

## Your complete feature

A student adds a real commitment, receives a useful small-step suggestion, accepts or edits it, and checks in. Completion updates shared progress once and unlocks items Track C can display. Approved reflection can improve later suggestions.

## Start in these files

- src/features/quests/QuestsPanel.tsx and QuestCard.tsx.
- src/services/planner.ts.
- src/state/quests.ts and relevant reducer tests.
- Add Rust provider code in a clearly named src-tauri/src module after selecting a provider.

## First small milestone

Run the existing sample path. Add editable quest wording through a coordinated Action, and improve the starting-step quality while keeping the sample fallback visibly labeled. Make proposed, accepted, deferred, dismissed, and completed states understandable.

## Next increments

1. Agree on provider and spending limit before introducing live calls; no provider is configured now.
2. Add a narrow Rust command for planning and validate inputs/outputs. Keep credentials out of VITE_ variables and commits.
3. Send only the chosen commitment and relevant approved memories. Preserve evidence IDs.
4. Handle no key, request failure, invalid output, and bounded retries without losing state.
5. If time permits, add deadlines and supplied availability with coordinated schema changes and genuine conflict checks.

## Agreements

The sample Planner interface currently returns only planner: sample. A live provider requires deliberate schema extension. Model-generated prose cannot directly award items or complete quests. Preserve the reward guard per quest ID. Starter balancing unlocks notebook at one completion and bandana at three; agree on changes with Track C.

Do not store separate summaries or embeddings without extending deletion and permission revocation. Saved private memories must not reach a provider. Do not claim mock scheduling or sample responses are live AI functionality.

## Acceptance demonstration

Add a commitment; get and edit a grounded suggestion; accept and complete; see the reward in wardrobe; repeat completion without duplicate credit. Save a permitted preference and show a later meaningful adaptation. Revoke/delete it and verify future requests exclude it. Disconnect the provider and show the labeled fallback.

## Paste into your AI

> Read AGENTS.md, docs/AI_CONTEXT.md, docs/IMPLEMENTATION_STATUS.md, docs/SHARED_CONTRACTS.md, and docs/tasks/B_QUESTS.md. I own Track B. Inspect the sample planner and domain rules, then implement the next small quest improvement without disrupting Track A or C. Coordinate shared schema changes. Keep the sample fallback runnable, secrets out of the interface, and reward logic deterministic.
