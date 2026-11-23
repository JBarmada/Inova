# Agent and Data Requirements

Working specifications for the proposed minimum. Exact field names, database, and APIs remain open; these are behavioral constraints to preserve when defining shared interfaces.

## Planning and quests

| ID | Requirement | Completion example |
| --- | --- | --- |
| A1 | Store a commitment's title, source, known deadline, supplied effort estimate, and status | An absent deadline stays unknown |
| A2 | Suggest concrete small actions connected to commitments or chosen goals | Each suggestion explains why it is useful |
| A3 | Keep evidence references with personalized suggestions | The user can inspect the underlying commitment or approved memory |
| A4 | Respect supplied availability, fixed events, timezone, and deadlines | A proposed session fits the known free interval |
| A5 | Ask about missing constraints or mark a suggestion provisional | Unknown availability does not become an invented opening |
| A6 | Support acceptance, editing, dismissal, deferral, and completion | Dismissal never awards completion credit |
| A7 | Keep rewards deterministic and prevent duplicates | Repeating the same completion does not grant another unlock |
| A8 | Bound model tool use and validate structured output | Invalid output or exhausted retries leads to a useful fallback |

## Memory and adaptation

| ID | Requirement | Completion example |
| --- | --- | --- |
| A9 | Distinguish original user writing, summaries, inferences, and approved preferences | A summary is labeled and does not replace the original |
| A10 | Give the user control over memory used for personalization | A private visible entry can be excluded from the model's context |
| A11 | Support correction and deletion | Deleted information is removed from maintained summaries and retrieval copies |
| A12 | Demonstrate relevant adaptation | A saved preference for short sessions changes a later planning suggestion |
| A13 | Preserve source and freshness information | Old imported records display their last-known status honestly |

## Suggested data concepts

- **Commitment:** source, title, known deadline and timezone, optional effort, status, last update.
- **Quest:** concrete action, goal or commitment reference, estimated duration, proposed time if any, evidence references, lifecycle status.
- **Experience/check-in:** user report, timestamp, quest reference if relevant, optional reflection, reward application record.
- **Memory:** original text, date, optional summary, source, personalization preference, approval state for inferred preferences.
- **Pet and inventory:** selected dog, current expression, owned item IDs, equipped slots, progression records.
- **Reward rule:** qualifying event, stable event identity, unlock, and rule version if needed.

These are concepts for a shared contract, not a finalized schema. Agree on identifiers and state transitions before separate teammates build dependent components.

## Application boundaries

The model may retrieve relevant records and propose actions. Application code validates proposals, enforces available capabilities, applies approved state changes, and calculates rewards. Tool calls need explicit success or failure results and an execution limit.

Use narrow capabilities such as listing commitments, retrieving details, searching approved memories, proposing quests, and recording user-accepted check-ins. Imported documents, journal text, and calendar descriptions cannot authorize new capabilities or external actions.

Keep manual entry usable. Default external connections to read-only, and request authorization for a specific calendar change or outgoing message if those actions are added. Model credentials belong outside client bundles; send only context needed for the request. Shared fixtures must be fictional.
