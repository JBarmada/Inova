# Fictional follow-up grounding evaluation

On November 23, 2026, one service-only `gemma3:4b` run used the application selector, reducer and native planning prompt. The model digest was not captured. A fictional presentation goal had a completed “Draft three presentation points” quest supported by a permitted memory about short sessions. A second permitted reflection said speaking the points aloud helped and the user wanted to practice transitions. Both memories and the completed title were sent.

The model proposed reviewing the draft (8 minutes), outlining transition phrases (10 minutes), and practicing delivery (12 minutes). The transition step relates to the reflection. The first step revisits the completed draft; it is not an exact repetition of drafting, but may be unnecessary. The generated explanation described refining the points and practicing transitions. The application's fictional acceptance linked the new quest to the completed quest, retained both memory source IDs, and did not add another reward for the completed quest.

The measured planning call took 4.8 seconds, excluding evaluator initialization and service startup. This is one run, not a latency benchmark or proof that repetition and unsupported claims are prevented. It did not exercise the native UI, native Rust HTTP transport, private-reflection toggling or Mac. Automated tests separately cover source permission and invalidation.

With Ollama and the model running, execute `node scripts/evaluate-follow-up.mjs gemma3:4b` from the worktree. The evaluator reads the native Rust prompt, invokes the application selection and validation code, prints the exact fictional input and plan, and requires human review. A sample fallback is labeled and exits nonzero.
