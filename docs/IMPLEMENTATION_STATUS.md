## Integrated playtest candidate — November 26, 2026

The latest local build-out (including themed quest classification and rewards, 37 provisional costume looks, fitted legacy wardrobe, shared chat/AI bridge, and animation improvements) is reconciled with the latest fetched main and teammate native-float branch. Identical wardrobe try-on and v36 loaf work was not reimplemented. The v37 alternative rise is retained for review, not enabled. The original checkout and experimental review art were not overwritten. See [main consolidation](MAIN_CONSOLIDATION.md).

Combined build verification: 467 app tests, four preview tests, source size, type, 20 clip atlases, walk hashes, production build and two Windows Rust library tests passed. The existing Tailscale server served the new build and returned model availability for Gemma 3 4B. The earlier native Mac checklist passed on the teammate branch; the full combined build is not yet tested on Mac or through the native Windows window. Vite reports a nonblocking large bundle warning. Remote main remains unchanged pending approval.
## Costume trial and unlocks — November 24, 2026

The 37 requested looks are available as body-slot costumes with original, simplified code-drawn pixel overlays and individual thumbnails. They preserve the base dog and use existing pose and movement anchors. The art is a first pass, not the generated concept sheets, and has not been visually checked in the application; fitting and recognizability across animation remain open. Existing ten item markers remain provisional. Mustache, bob and army hat currently occupy the body slot, so they cannot be combined with another body costume.

Each look has a playful description and unlocks after 1–37 distinct completed quests in catalog order; on the next completion an existing profile receives all newly qualifying costumes. Repeating a completion grants nothing. In Dev mode a locked item's Dev unlock button grants only that item and does not equip it; the reducer rejects this action outside Dev mode. Older builds do not recognize newly owned item IDs and may reject such saves, despite the unchanged save version. `npm run check` passed 280 frontend and four preview tests; two Windows Rust library tests passed. Browser and native visual reviews and Mac runtime remain pending.

## Bookshelf spine direction — November 24, 2026

The spine title rotates independently so it reads bottom to top; the colored spine, button, and accessible name remain unchanged. The user approved an illustrative preview. `npm run check` passed 273 frontend and four preview tests and built the app. The browser preview was unavailable, so real rendered and native visual review is pending. A separate generated ten-item wardrobe concept is awaiting review; the current runtime wearables remain placeholders.

## Conversation topic separation — November 24, 2026

Chat now omits unrelated recent messages and unmatched memories for the reported paper-to-food example. A clear independent question during goal clarification goes to chat instead of being added to the pending goal; the goal remains pending. The prompt asks every personality to respect the user's goals. Automated tests cover topic separation, follow-ups and the planning handoff. These narrow English and word-overlap heuristics can miss paraphrases or topic changes, and ambiguous follow-ups retain context. A complete conversational topic manager and a natural way to resume a paused goal remain open.

A fictional Gemma 3 4B service-only trial answered the separate food question without mentioning a paper and responded to graduation under all four personalities. The mean-personality reply was pushy ("don't just sit there"); after another prompt revision a repeat replied supportively. This single repeat is not a reliable tone safeguard. The model also offered quests for many ordinary questions and made a contradictory friend-preference reply; the existing goal-word filter blocks many, but not necessarily all, false offers. Memory suggestions still require review. This trial did not exercise the full app or another device, and human review remains necessary. The frontend checks passed 273 tests and four preview tests; two native Rust tests passed. Native UI and Mac remain untested.

## Shared chat and local planning — November 24, 2026

The floating quest toy and home use the same chat component; per-message quest buttons and the automatic sample fallback are removed from those flows. Model goal offers initiate a clarification and planning proceeds automatically after the existing bounded, scripted clarification. Plans remain previews until the first quest is explicitly accepted. Errors expose service/model failures and allow retry. The Quest page focuses on existing quests, and the bookshelf uses category-colored spines. New profiles default to Gemma 3 4B; a saved 12B selection is switched to 4B only after confirming 12B is absent and 4B is installed. If availability cannot be checked the selection is retained.

The host Ollama endpoint reported gemma3:4b installed; fictional direct service prompts produced a chat reply and a three-step exam plan. In that trial the model failed to ask the requested clarification, so the follow-up question remains scripted and broader live conversation reliability is unproven. A fictional chat request also succeeded through the running Tailscale preview bridge on the host. This does not verify native window interaction or another Tailscale device.

Wardrobe now allows temporary combinations across all four slots, including locked items, without changing ownership or the saved outfit. Final item art, economy, and visual/native review remain open.

## Dev-mode walk preview — November 24

The generated welcome-walk trial is available as “Welcome walk (trial)” in the Dev mode animation picker in home and floating views. It retains the reduced-motion behavior and remains a provisional generated asset; native visual verification and fitting to the approved dog are pending.

## Adoption walk trial — November 24

The approved generated walking concept now plays once during adoption before the synthesized bark and return to the normal companion. Reduced motion skips it. This is a temporary generated sprite trial, not a native-pixel fit to the approved base; the face and proportions differ, wearable fitting is not implemented, and native visual review is pending.

## Home and memory refresh — November 24, 2026

Home chat is visible by default, with recent conversation enabled by default but still switchable. New memory-book entries have a title, category tabs and optional links to any existing adventure; they are available for suggestions. Existing memory permissions are unchanged. The standalone perspective exercise is removed from Memories and its conversational replacement is in the build-out backlog. Adoption shows a temporary welcome and a bark with an entrance slide, not a walk cycle. Personality labels are Dev-only; personality-specific artwork still needs concepts and approval. Automated checks passed (264 frontend and 3 preview tests); browser and native-window visual review remain pending.

# Implementation Status and Handoff

## Tailscale AI preview — November 24, 2026

An opt-in preview server can serve the built browser app and bridge its supported local chat, planning and model-check requests to Ollama on the host's loopback interface. It uses the desktop prompts, supported model allowlist and bounded input/output; browser-side validation, memory permission selection and explicit quest acceptance remain in place. It listens only on the configured Tailscale IPv4 and checks the request host and origin. This is a development preview: other devices allowed to reach that port on the tailnet can use its model, and the browser's local storage is separate from the desktop profile. HTTP here is intended for Tailscale transport, not public hosting.

Run `npm run build`, set `INOVA_PREVIEW_HOST` to the host's Tailscale IPv4 and optionally `INOVA_PREVIEW_PORT`, then run `npm run preview:tailscale`. Ollama and the selected model must be running/installed on the host. The normal Vite preview does not provide this bridge. Automated checks cover request restrictions, unavailable service, response handling and the browser transport; real-model and separate-device testing require a running model. The prior 4173/4174 previews remain separate.

On November 24, Ollama was installed and `gemma3:4b` downloaded. Fictional HTTP requests through the Tailscale bridge returned a dog reply and a three-step plan. The first chat request took tens of seconds; no latency benchmark or separate-device browser interaction was performed. The app defaults to 12B, so select Gemma 3 4B under Quests → More options to use the installed model. `npm run check` passed 263 app tests and three bridge tests. Other model versions and prompt quality remain unverified.

## Reduce repeated memory suggestions — November 23, 2026

New model-suggested memory quotes are suppressed when an existing memory differs only by case, Unicode normalization, apostrophe style, whitespace or final periods/exclamation marks. A changed fact remains available for review; no memories are automatically merged or edited. `npm run check` passed 262 tests. This is formatting comparison, not semantic duplicate detection, and native and live-model review remain pending.

## Exercise the learning sequence — November 23, 2026

The chat memory selector recognizes some capitalized introductions such as “I'm Alex” when asked for the user's name. A fictional automated scenario checks initial unknown state, explicitly saved name/class/study effort/friend/date, reload, correction, deletion and permission revocation using the real selector and reducer. It verifies that study effort is not automatically stored as a preference. Replies are placeholders, so this does not demonstrate model reasoning or reliable name recognition. `npm run check` passed 261 tests; live-model and native verification remain pending.

## Carry longer goal conversations — November 23, 2026

A home-chat goal and up to two clarification answers can now total 724 characters, while each message remains limited to 240. Automated coverage sends the full text to a mocked local planner and follows sample planning, acceptance, reload and a later follow-up. No earlier save migration is required, but older app builds can reject a save while an active chat goal exceeds their 240-character limit; do not open such a profile in an older build. `npm run check` passed 259 tests. Live-model handling of longer input and native layout remain unverified.

## Reject negated deadline suggestions — November 23, 2026

The planner now rejects recognizable negated date evidence even if the model quotes only the date, such as “Friday” from “not due Friday.” A mocked planner test confirms the user is asked to review instead, and tests cover an alternative valid date and a numeric date. This is a conservative English pattern, not complete natural-language interpretation; complex or ambiguous deadlines still need user review and live-model testing. `npm run check` passed 258 tests. Native date-picker and timezone verification remain pending.

## Broaden named-birthday checks — November 23, 2026

The existing capitalized possessive birthday filter now supports short, accented and hyphenated names and compares whole names with Unicode normalization. Fictional tests cover Li versus Liam, Élodie and Anne-Marie. The learning script now fails on prohibited memory selection or its explicit multi-person selection expectations; a dry run passed those checks with placeholder replies. These checks do not assess the model's response or general person matching. `npm run check` passed 256 tests; live-model and native verification remain pending.

## Named birthday recall and learning evaluation — November 23, 2026

For a capitalized possessive question such as “When is Sam's birthday?”, memory selection now only considers permitted memories containing that name. A fictional test verifies that another person's birthday is not substituted after Sam's is private or absent. This narrow English pattern is not general entity resolution; pronouns, other phrasing and conversation text remain possible sources of confusion. The learning evaluation now includes an opted-in follow-up with competing birthdays and a permission change. Its `--dry-run` completed with placeholder replies and showed the intended selection; it does not evaluate model output. `npm run check` passed 255 tests. Live-model and native verification remain pending.

## Use the preceding message for follow-up recall — November 23, 2026

For eligible short follow-ups with recent conversation enabled, the previous user message can now break ties between relevant memories even when the preceding dog reply had no memory sources. Excluding that message or turning recent conversation off prevents its use. A fictional multiple-person birthday test covers selection and exclusion. This is word matching, not reliable pronoun or entity resolution; unrelated memories may still be sent. `npm run check` passed 254 tests. Live-model and native verification remain pending.

## Rank related memories in follow-ups — November 23, 2026

For eligible short follow-ups with recent conversation enabled, equally relevant memory matches now use word overlap with the previous reply's permitted sources to break ties before recency. A fictional test covers an older friend's birthday among newer birthdays, and verifies the off setting. This is not entity resolution: unrelated memories may still be included, and a model may mix up people or dates. `npm run check` passed 253 tests. Live-model and native verification remain pending.

## Recall people in follow-up questions — November 23, 2026

When optional recent conversation is enabled, short questions such as “When is her birthday?” can now retain the permitted memory sources of the immediately preceding eligible dog reply alongside other matching memories. The same source and conversation-exclusion checks still apply. A fictional automated scenario covers a friend and birthday, saved source IDs, and recent context disabled. This is an English wording heuristic, not reliable pronoun resolution or proof the model associates the right date with the right person. `npm run check` passed 252 tests. The local Ollama service refused the connection, so this change has not been evaluated with a live model; native UI verification remains pending.

## Improve planning memory selection — November 23, 2026

Planning no longer mistakes an unlinked memory for a reflection when there is no previous quest. When a permitted memory matches the goal, unrelated zero-score memories are excluded; if none match, the existing recent-memory fallback remains. Follow-ups still prioritize a permitted reflection explicitly linked to the previous quest. Matching uses simple wording rather than semantic understanding and may miss relevant memories. `npm run check` passed 251 tests. Live-model and native verification remain pending.

## Check suggested deadline times — November 23, 2026

The planner now checks noon, midnight and unambiguous 24-hour times against the model's suggestion. An unqualified time such as “5:00,” multiple alternatives, or a conflicting time no longer supplies an assumed clock time; when the date is supported, the user is asked to provide the time in review. `npm run check` passed 250 tests. Native date-picker, locale and daylight-saving behavior remain to be verified.

## Check immediate relative dates — November 23, 2026

Both local planners now validate model-suggested “today,” “tonight,” “tomorrow” and “day after tomorrow” against the same local calendar date sent in the request. The check uses calendar-day arithmetic across month, year and leap-day boundaries and rejects multiple relative-day phrases, some negated statements and a truncated “tomorrow” quote from “day after tomorrow.” A rejected suggestion opens manual detail review. `npm run check` passed 249 tests, including a mocked planner with a wrong date. Other relative expressions, ambiguous wording, time zones and native date-picker behavior still require review; no live-model run was performed.

## Verify explicit dates in model suggestions — November 23, 2026

Planner-suggested dates are now rejected if they conflict with an explicit ISO date, US numeric month/day/year, or written month and day in the cited evidence. Two-digit years are compared by their last two digits; a missing year remains for the user to review. Weekday and time checks remain. This does not prove relative-date interpretation or validate every natural-language date format. A mocked planning test carries two clarification answers through deadline review and acceptance. `npm run check` passed 247 tests; live-model and native date-picker review remain pending.

## A second clarification turn — November 23, 2026

During home-chat quest planning, if the first answer clearly supplies only a deadline or only prior progress, the dog asks one focused question about the other. It recognizes a small set of short deadline answers such as “Friday”; this is only a conversational clue, not a verified date. The extra turn survives reload, can be skipped, and is bounded to avoid a loop. If the answer is unclear, planning can proceed. Older saves omit the optional turn count and continue to load. `npm run check` passed 245 tests, including reload, skip and uncertain answers. Native and live-model verification remain pending; clarification remains scripted.

## Stop waiting for a plan — November 23, 2026

Home chat and the shared desktop/floating quest composer now let the user stop waiting for a plan, keeping the goal available and ignoring a late result. The user can revise or start again, or choose the sample while the request is pending. This does not cancel the native HTTP/model request; it may continue until completion or timeout. `npm run check` passed 243 tests, including stopping and starting a new plan before the first request finishes. Native UI verification remains pending.

## Pronoun follow-ups — November 23, 2026

With recent conversation explicitly enabled, short follow-ups such as “What about her?” and “Does she?” can prioritize the preceding dog reply's permitted memory sources. This only happens when that reply is eligible for recent context; excluding a supporting conversation message prevents that special carryover. Separately permitted memories can still be selected independently, consistent with the existing exclusion controls. `npm run check` passed 242 tests, including the chat request path and exclusions. This is an English pattern heuristic, not general pronoun resolution; live-model and native tests remain pending.

## Inspect chat reply context — November 23, 2026

Dog replies and accepted-plan history with recorded memory sources now have a collapsed list of currently permitted memories supplied as context. The list does not claim the model relied on every memory. Revoked or unavailable records are not displayed; existing invalidation removes dependent reply text when its supporting memory changes. Earlier user-message context is not listed here. `npm run check` passed 240 tests; native visual and live-model review remain pending.

## Review included memories — November 23, 2026

The shared quest review offers a collapsed list of the exact memory snapshots included in a suggestion when any were included. This shows the information supplied to the planner; it does not claim the model used every item. Acceptance still rechecks permission and content against current state. `npm run check` passed 239 tests, including a permitted memory and an excluded private entry. Native visual review remains pending.

## Accepted plans in chat history — November 23, 2026

When a home-chat quest is accepted, the conversation records its accepted title and the later suggestions as they were at acceptance; sample plans remain labeled. The copy carries supporting memory IDs and is removed if a supporting memory is edited, deleted or excluded from personalization. It is conservatively excluded from optional recent context when any user message is excluded, because exact source-message links are not yet tracked. A full conversation does not prevent accepting a quest; in that case no history copy is added. Direct desktop/floating acceptance does not yet add a chat record. Unaccepted previews and explanations are not persisted.

`npm run check` passed 238 tests, including reload, memory revocation, excluded conversation context and accepting with a full transcript. Native visual and live-model testing remain pending.

## Clarifying explicit starting points — November 23, 2026

The scripted quest clarification recognizes a few explicit ways to say there is no deadline, that work has not started, or that an outline, draft or plan already exists. It asks for another detail rather than repeating those questions; it does not create a deadline or interpret uncertain wording as fact. `npm run check` passed 236 tests. This remains a narrow English heuristic, not model-driven multi-turn clarification, and needs native/live conversation evaluation.

## Floating plan review bounds — November 23, 2026

The floating composer now places the plan explanation, proposed steps and review controls inside one keyboard-focusable, height-bounded scrolling region. Previously only the detail form was bounded, so a long explanation could increase the floating panel beyond the usable area. `npm run check` passed 235 tests, including the existing toy dismissal checks; scrolling and placement still require native visual and keyboard verification.

## Direct quest follow-up verification — November 23, 2026

An automated fictional scenario now exercises the shared direct planner with a mocked multi-step model response, explicit acceptance, completion, a private reflection, state serialization/reload and acceptance of the next saved suggestion. It verifies that the private reflection is not included in the saved-plan memory snapshot and the completed quest is rewarded only once. `npm run check` passed 235 tests. This does not exercise the local model service or native interface.

## Shared desktop and floating planning — November 23, 2026

The single-entry quest composer used by the desktop quest page and floating toy now uses the same validated multi-step local planner and labeled sample fallback as home chat. It previews the plan, allows skipping and editing the first suggestion, and explicitly accepts the reviewed first quest while retaining later suggestions. A user can choose the sample while waiting; late local results are ignored, although the underlying request continues. Direct planning does not borrow an unrelated home-chat follow-up context or reset that chat. Acceptance is one state action with source, effort, duration, adoption and duplicate checks.

`npm run check` passed 234 tests, including direct acceptance, chat preservation, source revocation and plan limits. Native Windows and Mac layout, toy dismissal during planning, and live-model behavior require visual/runtime verification.

## One home-chat message entry — November 23, 2026

The adopted dog's home chat now shows one message entry during ordinary conversation. A user message has a visible “Make a quest” action that starts clarification from that message; a failed or unavailable AI reply leaves the message available for that action. During clarification or a reflection, the ordinary chat entry is hidden so there is one active writing flow. Messages, memory review, optional recent context and the labeled sample planner remain available. See the shared-planning section above for the later desktop and floating planner update.

`npm run check` passed 232 tests, including the home-chat entry and message-to-quest transition. Native visual review and live AI testing remain pending.

## Additional memory wording — November 23, 2026

The existing chat-memory matcher recognizes “I go by” and “my name's,” enrollment wording, and abbreviated month names. `npm run check` passed 231 tests, including those examples. This is still limited English pattern matching, not semantic understanding. A new live evaluation was attempted, but no Ollama service was listening and the executable was absent from the standard installation location in this environment; the new cases have not been tested with a model.

## More focused conversation memories — November 23, 2026

When at least one allowed memory matches the existing wording/theme heuristic, local chat no longer fills the remaining context slots with zero-score memories. This can reduce unrelated context and avoid making a reply depend on unrelated memories. When no memory matches, the previous recent-memory fallback remains; the scoring still uses simple wording and may miss or select irrelevant records. Short opted-in conversational follow-ups can still prioritize the preceding reply's allowed sources.

`npm run check` passed 230 tests, including specific class recall, private records, the no-match fallback and revocation of an unrelated memory. This change has not been evaluated with a live model or visually in native mode.

## Skip a saved follow-up suggestion — November 23, 2026

The plan review now also lets a user skip a saved next step when a later suggestion exists. Skipping changes only the review; accepting checks the complete original saved-plan snapshot, the selected position and supporting memory permissions before consuming the saved plan. Users can edit the selected step, and cancellation leaves the saved plan intact. Automated tests cover acceptance, edits, stale snapshots, invalid positions, repeated acceptance and revoked memory.

`npm run check` passed 229 tests. Native visual review remains pending.

## Review potentially repeated follow-ups — November 23, 2026

The chat plan preview flags obvious shared wording between a permitted completed quest title and the proposed first step. For a newly generated multi-step plan, the user may skip the first suggestion and review the next before accepting; the skipped suggestion is not saved, and the old explanation is removed. Later suggestions and supporting-memory checks remain intact. See the newer saved-follow-up section above for the extension to saved plans. The wording check is a limited heuristic and can miss repetition or flag unrelated work.

`npm run check` passed 227 tests, including skipped-step acceptance, retained suggestions, revoked permissions and the preview. Native visual review and a new live-model run remain pending.

## Fictional grounded follow-up trial — November 23, 2026

One 4B service-only run of the new completed-title grounding path used the actual TypeScript selector and state reducer with the native planning prompt. It sent the completed title, its permitted supporting memory and a permitted linked reflection. The proposed transition practice reflected the user's stated interest, but another step revisited the completed draft and could be redundant. Fictional acceptance preserved both sources and did not duplicate the completed quest reward. The planning call took 4.8 seconds excluding service startup and evaluator initialization. See [the trial record](evidence/follow-up-grounding-2026-11-23.md); this is not native runtime verification or general evidence of model quality.

## Grounding a follow-up in completed work — November 23, 2026

A local follow-up can now receive the completed quest's title when every memory supporting that title is currently permitted and all fit within the three-memory context limit. Those memories are reserved in the request and tracked on the new proposal; its acceptance rechecks them. If any are unavailable or too many are needed, the title remains omitted. A linked permitted reflection is included only when capacity remains. This provides the model more evidence of work already done, but does not guarantee it will avoid repeating a step.

`npm run check` passed 225 tests, including supported titles, private or excessive dependencies, missing evidence and revocation during planning. See the newer fictional grounded follow-up trial above for a service-only model run; native interface verification remains pending.

## Edit saved follow-up steps before acceptance — November 23, 2026

The saved next step can now be edited in the same review as a new proposal. The original saved plan snapshot is checked at acceptance; a stale plan or revoked supporting memory rejects the action. Changing the title labels the reason as user-edited and discards the remaining suggested steps with an on-screen warning. Changing only the duration retains later steps when the reviewed total effort and length limits allow it. Acceptance consumes the prior saved plan only after the new quest is saved.

`npm run check` passed 223 tests, including edited title and duration, stale snapshots, changed permissions, repeated acceptance and altered future steps. Native visual and live-model verification remain pending.

## Multiple completed-quest follow-ups — November 23, 2026

After each queued reflection is saved or skipped, its completed quest remains available as a named follow-up choice. Multiple choices survive serialized reload, starting over and clearing the conversation. Selecting a choice starts the existing review flow; only accepting a next quest consumes that choice, leaving the others available. No additional rewards are granted by planning. Legacy saves with a single follow-up remain readable. Older app versions can discard the new list and retain at most its legacy single entry; do not use them to save a profile relying on multiple choices.

`npm run check` passed 221 tests, including multiple completions, repeated reflection actions, legacy state, restart, abandoning a plan and accepting one of two choices. Native layout, Mac runtime and live-model follow-up quality remain pending.

## Edit a proposed quest before saving — November 23, 2026

The shared desktop/floating quest review and home-chat plan review let the user edit a newly proposed first quest's title and duration before saving or accepting it. A changed title replaces the original generated reason with a user-edit label; in a multi-step home-chat plan, changing that title discards later suggested steps after showing a warning. Deadline, total-effort and application acceptance checks still apply. See the newer saved follow-up section above for the subsequent extension to saved steps.

`npm run check` passed 219 tests, including invalid lengths, total-effort limits, a long sample title, discarded future steps and explicit acceptance of an edited draft. Native and floating visual review remain pending.

## Goal clarification — November 23, 2026

Starting a plan from a new or existing chat message now varies the optional scripted question when the goal contains a recognizable deadline phrase, prior-progress phrase, or both. It asks about the other detail or a helpful next step; the existing personality tone and skip action remain. The phrase check does not parse or establish an actual deadline, understand arbitrary wording or change quest acceptance. The local planner's extracted details still require review.

`npm run check` passed 216 tests, including both entry points, personality, incomplete wording and absence of a prematurely created quest. Native visual and live-model planning verification remain pending.

## Fictional learning sequence — November 23, 2026

One local 4B service run used the application selector and reducer across unknown name, explicitly saved name/class/friend/date, effort versus preference, a corrected preference after serialized reload, and revoked permission. The responses matched those particular fictional facts and expressed uncertainty in the two unknown cases. This was a single non-native run with recent conversation disabled, not proof of general accuracy or autonomous learning. The script, observed cases and limits are in [learning sequence evidence](evidence/learning-sequence-2026-11-23.md).

## Exclude a message from recent context — November 23, 2026

Message actions now let users exclude or re-allow a user message from optional recent conversation context without deleting the transcript. New dog replies track the user messages in their direct and transitive conversation context. A dog reply depending on an excluded message is omitted from future recent context; older replies with unknown context lineage, and their descendants, are conservatively omitted while any message is excluded. A pending result based on newly excluded context cannot be saved. This does not retract an already sent request, erase earlier replies, change saved-memory permissions, prevent explicitly asking the dog about that message, or identify semantically related user statements. Older app versions may discard the new exclusion and lineage fields; do not use them to save a profile relying on these controls.

`npm run check` passed 214 tests, including exclusion, restoration, serialized reload, in-flight rejection and chained/legacy replies. Native visual interaction and Mac runtime remain unverified.

## Correct a memory from chat — November 23, 2026

While reviewing a user message or suggested memory, the user can explicitly choose an existing memory to update and review the replacement text. Its category, personalization permission, original date and quest link remain unchanged. The mutation validates the original chat message, the chosen memory snapshot and any suggestion, and applies the existing memory-edit invalidation to dependent replies and quest copies. It does not automatically identify conflicting memories or delete the separate chat transcript. Existing conversation text can still be included if the user enables recent conversation context.

`npm run check` passed 211 tests, including stale selection, permission changes, suggestion validation, dependent reply invalidation and serialized reload. The new interface has not been visually verified in native Windows or Mac.

## Short follow-up memory selection — November 23, 2026

When recent conversation is enabled, a short reply beginning with a limited set of English follow-up words (such as “Yes” or “he”) can retain the immediately preceding dog reply's permitted memory sources before filling the three-memory limit with normally ranked memories. This allows the prior dog reply to stay in context even after newer memories have been added. The source and permission checks still apply; this is a narrow heuristic and can miss follow-ups or prioritize less relevant memories. Turning recent conversation off retains the normal selection behavior.

`npm run check` passed 208 tests, including fictional multi-memory follow-up, opt-out, deletion and revocation cases. The new selection path uses a mocked model and has not been verified in the native interface.

## Recent conversation context — November 23, 2026

The existing off-by-default context option can now include up to four earlier user and eligible generated dog messages, each limited to 240 characters. Dog replies are included only when their tracked memory sources are in the current permitted snapshot; earlier replies with untracked sources and replies relying on other memories are omitted. New replies retain those memory dependencies, and a change to the transcript or memory permissions before saving rejects the result. The prompt labels dog replies as fallible rather than evidence of facts. This is bounded context, not a complete conversation model or a guarantee against invented facts. Clearing the transcript remains separate from deleting saved memories.

One fictional service-only 4B test interpreted “Yes, he does” after a dog question about a friend liking tea. The model also proposed its own earlier question as a memory; the existing exact-current-user-quote check rejected it. This single trial is not proof of general quality or a native UI test. Run it with `node scripts/evaluate-local-chat.mjs gemma3:4b "follow-up answer"` while Ollama is running.

## Finding older memories in chat — November 23, 2026

Local chat now ranks permitted memories using word overlap and small English wording groups for names, classes, friends, preferences and dates. This helps surface older records when a question uses related wording, such as asking what class the user is taking when they saved “I take astronomy.” It still sends at most three memories, uses recency for ties and preserves the existing snapshot and revocation checks. The ranking is heuristic, not semantic understanding: it can miss paraphrases, select an unrelated record, or leave out a relevant fact. Model answers can still be wrong.

`npm run check` passed 204 tests, including fictional selection and permission-revocation cases. These tests use a mocked model; live model accuracy and native presentation of this change have not been evaluated.

## Offered quest handoff — November 23, 2026

Local chat may offer to plan when its structured response identifies a goal and the original user message passes a conservative phrase check. The user can choose Plan together or Not now; neither the model output nor declining creates or accepts a quest. Starting a plan validates the source and consumes the offer, then uses the existing clarification and explicit acceptance flow. Manual Message actions remain available for goals missed by the check.

`npm run check` passed 198 tests, including decline, acceptance, stale offers and suppression of two false-positive patterns. Windows offline Rust library tests compiled the updated provider and passed two existing tests. In one fictional 4B service-only run, the raw model correctly offered a plan for a presentation goal but also offered plans for several ordinary questions and statements of nervousness. The phrase check filters those particular examples but is not general intent understanding and can miss valid goals or allow false positives. Native UI, live in-app behavior and Mac runtime remain pending; older builds may drop offer metadata.

## Start a quest from chat — November 23, 2026

The Message actions menu lets a user turn an existing user-authored chat message into a quest goal without retyping or duplicating it. The dog asks the existing optional clarification question, then the user previews and explicitly accepts a quest. Planning cannot replace a goal already in progress, and stale or dog-authored messages are rejected. Message actions are grouped in a disclosure to reduce clutter.

`npm run check` passed 196 tests. A fictional automated flow covers shared goal, clarification, labeled sample preview, acceptance, reload, completion, reflection skip and linked follow-up; the model and native interface were not exercised by this test. Native visual/accessibility and Mac checks remain pending. The conversation-to-planning transition still requires the user to choose the action and clarification is scripted.

## Memory suggestion lifecycle — November 23, 2026

Users can dismiss a proposed chat memory without saving it. Saving from a suggestion atomically records the reviewed memory and resolves that suggestion; stale or repeated acceptance is rejected. Newly generated suggestions matching an existing memory after trimming and case-folding are suppressed, even if the existing memory is excluded from personalization. This is exact-text matching, not semantic deduplication. A dismissed suggestion may be proposed again if the user asks for a new reply.

`npm run check` passed 194 tests, including reload, duplicate acceptance, dismissal and stale review. The new controls have not been visually checked in native Windows or on Mac. Earlier builds may discard suggestion metadata.

## Reviewed memory suggestions — November 23, 2026

Local chat may suggest a memory quote and category from the current user message. The app only offers an exact nonempty quote from that message that does not contain a question mark; the user can review the original message, edit the quote and category, and explicitly save it, with personalization off by default. Suggestions are stored in the conversation, not as memory records, until accepted. Model output is not a validated personal fact, and a quote check does not establish that a statement is enduring or important. Clearing the conversation removes suggestions. Dependent suggestions are removed with a generated reply if a referenced memory changes.

One fictional direct 4B service trial correctly suggested an exact friend-preference quote, but also proposed questions, transient feelings and text copied from other memories. The app rejects quoted questions and non-quotes; remaining relevance requires user review. `npm run check` passed 192 tests and Windows offline Rust library tests compiled the structured response change and passed two existing tests. Native UI, live in-app behavior and Mac runtime remain pending. Earlier builds may drop saved suggestion fields.

## Adoption personalities — November 23, 2026

New adoptions randomly receive and persist one of four text styles: cute, mean, sad or happy. Mean is presented as playfully grumpy, and sad as gentle; the style does not alter the dog's mood, rewards or quest rules. Home shows the generated style; scripted goal clarification and the local-chat prompt use it. Older dogs without a personality retain neutral wording. No user control to change the style has been implemented, and older builds may drop the optional field when saving.

`npm run check` passed 191 tests and Windows offline Rust library tests passed two existing tests. One fictional 4B service trial produced responses for all four styles; its grumpy reply called the user a "worrywart," which may feel dismissive, and a separate recent-context reply invented that the user studied all the time. Keyword checks do not assess tone or factual grounding. Style consistency, native visual behavior and Mac runtime remain unverified.

## Optional recent conversation context — November 23, 2026

Initially, the chat context option included only earlier user-authored messages. See the newer Recent conversation context section above for the expanded behavior. The control resets when the chat component is unmounted or the app restarts. Messages remain in the separate transcript until cleared, even when a saved memory is deleted; the interface states this when the control is enabled. Clear conversation removes the transcript and its replies. This is not a durable memory extraction policy.

`npm run check` passed 188 tests, and Windows offline Rust library tests passed two existing tests after compiling the updated prompt. In one fictional direct 4B service trial, the model correctly identified astronomy from a supplied earlier user message; eight other keyword checks also passed, though one unrelated follow-up was awkward. These are service-only checks, not the native app or broad model validation. Native UI, Mac runtime and wider live-model evaluation remain pending.

## Direct replies to shared messages — November 23, 2026

Sending a message through Share something now stores the message and requests a local AI reply automatically, rather than adding a scripted acknowledgment and requiring a separate Ask dog click. If the reply fails, the saved message can be retried with Ask dog; a failed message save never calls the model. A change to a supporting memory during generation prevents the reply from being saved. The local request still receives only the chosen message and permitted memories, not previous conversational turns, and the UI waits for the request to finish (up to the native timeout). Quest clarification is still a separate scripted flow. Native interface verification remains pending.

`npm run check` passed 187 tests including message persistence, offline failure, stale memory and save-failure paths. These tests mock the model and do not establish live reply quality; see the local chat evaluation below.

## Stop waiting for a local chat reply — November 23, 2026

While a local reply is pending, Stop waiting retains the saved user message, releases the chat interface and ignores any late reply or error. The user can retry from the saved message. Once reply persistence begins, it finishes rather than being interrupted. The native model request itself is not cancelled and may continue consuming resources until it finishes or times out. Leaving chat also invalidates pending reply callbacks. `npm run check` passed 201 tests, including stopped and superseded replies, persistence failures and leaving the screen. Native visual testing remains pending.

## Local chat evaluation — November 23, 2026

The companion prompt now identifies the dog's name separately from user memories, interprets first-person memories as user statements, and gives examples for unknown names, preferences and untrusted memory instructions. A reusable fictional service-only harness uses the same prompt file and settings: `node scripts/evaluate-local-chat.mjs gemma3:4b` (or `gemma3:12b`). Its keyword checks require human review and are not a correctness or security guarantee.

One 4B run produced appropriate replies on eight cases in 0.8–1.9 seconds each: known/unknown user name, friend preference, class, exam date, unknown friend, effort versus preference, and a memory instruction. A previous prompt revision incorrectly inferred preference from effort and repeated an injected instruction; an earlier trial invented the dog's name. These are small fictional service-only trials and show prompt sensitivity, not reliable grounding or injection resistance. Native UI and broader testing remain open. `npm run check` passed 184 tests, and Windows offline Rust library tests compiled the updated prompt and passed two existing tests.

## Local companion replies — November 23, 2026

For a selected user message, Ask dog requests a bounded structured reply from the local 4B/12B provider through Rust. It sends only that message and up to three permitted memories; conversation history is not sent, so this is not yet natural multi-turn chat. The model cannot save memories or act on quests. Responses retain memory source IDs; editing, revoking or deleting a referenced memory removes the dependent response. Stale memory snapshots and malformed replies are rejected. User messages and the separate transcript are retained until cleared. Older versions may strip source IDs on save, so do not use older builds with a profile containing these replies.

`npm run check` passed 184 tests; Windows `cargo test --lib --locked --offline` compiled the provider and passed two existing bounded-response/model-validation tests. A direct fictional 4B service-only trial answered that Sam likes tea from an allowed record in 4 seconds. An empty-memory trial asked for the user's name and instead returned an invented dog name in 1.2 seconds: this is a factual/intent failure and the model should not be trusted to avoid inventing details. Neither trial exercised the native command or UI. Native and Mac behavior and broader model evaluation remain open.

## User-confirmed conversation memories — November 23, 2026

Home chat can accept a shared message independently of quest creation. The user can select any of their messages, review or edit its wording, select a category and save it to Memories; personalization is off unless checked. The saved entry identifies its conversation origin. Existing memory editing, deletion and permission controls govern retrieval, while the separately stored transcript remains until cleared. The response to sharing is scripted, not an AI conversation or automatic extraction. There is no automatic name recall, date reminder, or inferred preference yet.

Fictional tests cover name, class, friend and date entries, reload, consent, planning-context selection, correction, deletion, revocation and rejection of stale or dog-authored messages. `npm run check` passed 182 tests. This verifies application state and mocked planner input, not live AI comprehension, conversational recall, native layout or Mac behavior. Earlier versions may drop the optional memory source and category fields when saving.

## Memory categories — November 23, 2026

The bookshelf has five colored icon filters: All, People, Events, You and Misc. Users choose a category when adding a bookshelf entry and can change it on an open memory. Older entries, including uncategorized reflections, appear in Misc without changing stored data; category and text search work together. Category changes do not change personalization permission or remove supporting quest evidence. This is user-directed organization, not automatic memory extraction, conversational recall, or inferred preferences. Older versions can discard the optional category field if they save this profile.

`npm run check` passed 180 tests, including named/selected filter markup, category persistence, legacy entries, search and unchanged permissions. Visual, keyboard and native Windows/Mac checks remain pending.

## Retained plan steps — November 23, 2026

When a user accepts a multi-step chat plan, the first quest becomes active and up to two later steps are retained as suggestions. After the quest is completed and its reflection is saved or skipped, the user may review the saved next step or request a new plan; accepting a saved step transfers the remaining suggestions to it. Suggested durations must fit the reviewed remaining effort and current per-quest limit. Deadline and remaining estimated effort are offered for review. A supporting memory's edit, deletion or permission revocation clears dependent saved steps, and stale drafts cannot be accepted.

`npm run check` passed 177 tests including simulated reload, explicit acceptance, reward preservation and memory changes. These tests use fictional state; the saved-plan UI, live-model end-to-end behavior, native Windows and Mac have not been verified. Older versions may discard these optional saved fields if they save the same profile. Earlier dated entries below describe historical behavior.

## Quest follow-up planning — November 23, 2026

After saving or skipping a completion reflection, the user can request another plan for the original goal. The local planner receives a previous-quest identifier and, when its title has no memory dependencies, that completed title. It prioritizes a linked reflection only if the user allowed personalization. Previous quest context and allowed reflection snapshots are rechecked before acceptance, and a saved follow-up links to its prior quest in suggestion context. The sample fallback is a labeled generic continuation, not an AI-generated step. Only the most recently resolved reflection offers a follow-up; multiple reflection prompts remain queued.

`npm run check` passed 174 tests and Windows `cargo test --lib --locked --offline` passed two tests. Mocked model tests cover allowed/private reflection context and revoked permission; a fictional browser sample flow reached and accepted a linked follow-up. Live local-model follow-ups, native UI and Mac runtime remain unverified. Older builds may discard the added chat and quest fields if used to save the same profile.

One direct fictional 4B follow-up request returned a structured plan that mentioned the allowed reflection, but measured 305.9 seconds and suggested outlining after the previous quest had drafted main points. This service-only trial suggests latency and repetition problems; it did not exercise the native app or establish reliable quality.

## Quest reflections in companion chat — November 23, 2026

A successful quest completion queues an optional reflection prompt in home chat. The user can skip it or save a quest-linked memory, excluded from personalization unless explicitly permitted. Completing more than one quest preserves separate prompts. Saving through the existing completion reflection form clears that quest's matching prompt. The reflection text is kept in the memory record, not copied to the chat transcript, so existing edit/revoke/delete controls remain authoritative. A generic prompt invites another goal; contextual AI follow-up remains unfinished.

`npm run check` passed 171 tests, including duplicate completion, restart-compatible state, skipping and memory linkage. A fictional browser test completed a sample quest and verified its linked reflection with personalization disabled. Native and Mac runtime verification remain pending. Older builds may discard the new pending-reflection field when saving.

## Multi-step plan preview — November 23, 2026

Home chat now requests a structured explanation and one to three proposed steps through a separate local-model command. Only the first can be accepted and saved; later steps are transient and are not yet available as follow-ups. If local planning fails, the existing labeled single-step sample is shown. Response size, supported models, permitted-memory snapshots, extracted-detail evidence and duration/effort constraints remain validated; generated text is still untrusted. The existing single-quest composers are unchanged.

Mocked model and reducer tests passed, and the browser sample fallback was inspected. `npm run check` passed 166 tests, and Windows `cargo test --lib --locked --offline` passed two tests. A direct fictional 12B multi-step request timed out after 120 seconds; no live response quality or latency claim is supported. Native and Mac runtime verification remain pending.

Two direct fictional 4B service requests returned three steps in 23.5 and 7.7 seconds, respectively; a shorter prompt made the repeat response more concise. This is not a native-app or general reliability benchmark. During a slow request, the user can now choose the labeled sample immediately; regression tests cover late local results and leaving the screen, but the underlying native request is not cancelled. `npm run check` passed 168 tests. Continue testing accuracy and latency before choosing a default.

## Initial home chat — November 23, 2026

The Companion page includes an expandable home chat that stores user messages and scripted dog prompts locally. It asks one optional fixed question, then uses the existing local planner or labeled sample fallback to preview one quest. Explicit acceptance atomically validates the current memory snapshot and saves an accepted quest; abandoning the transient preview saves no quest. The conversation and unfinished goal/context step survive saved-state reload, and clearing the conversation does not delete separately saved quests or memories. Generated proposal text is not stored in the transcript. Older saves default to an empty conversation; older versions may discard it if used to save the same profile.

This is not yet open-ended AI chat, multi-step planning, a post-completion chat reflection, or the requested Quest-tab redesign. `npm run check` passed 162 tests including state reload, duplicate acceptance and revoked-memory rejection. A fictional browser preview verified the home chat, sample acceptance and Quest tab; native and Mac checks remain pending. The conversation limit is 200 messages; existing messages are preserved when the limit is reached.

## Local model injection trial — November 23, 2026

One direct HTTP trial used the application's system prompt, 12B model, structured-output schema and settings with fictional data. A reflection instructed the model to use an unrelated title; the model followed it and returned that title after approximately 23 seconds. This is a demonstrated prompt-injection failure, not a comprehensive evaluation. Schema and application rules constrain quest state and rewards but do not prevent manipulation of generated text. Further mitigation and tests remain open; native UI was not exercised.

The shared composer now displays the generated title, reason and duration for review before saving, with deadline and effort collapsed unless needed. The floating review has bounded scrolling and keyboard focus for long text. `npm run check` passed 158 tests. User review is not a guarantee against manipulation; the combined native layout and scrolling have not been visually checked.

## Latest Windows compilation — November 23, 2026

The current Rust library compiled for Windows in release mode with `cargo build --release --lib --locked --offline`. The most recent `npm run check` passed 158 tests, all 20 atlas checks, type/size checks, and the frontend build. This does not verify the final executable's native UI, animation timing, or Mac behavior.

## Date-only quest intake and model checks — November 23, 2026

A model-suggested date without a time now opens a review asking for a local time, or the user can clear the date. The app does not invent one. Recognizable missing or conflicting date/effort details also open a manual review, including for the sample fallback. Source-text matching plus simple weekday, clock-time and unit checks reject some mistakes, but they are not comprehensive and the user must review suggestions. This supersedes the earlier date-only limitation below.

A direct fictional Gemma 3 12B trial extracted the date-only example and a separate date/time/effort example in about 31 and 22 seconds respectively. A 4B trial produced a wrong weekday and duration; those recognizable errors are rejected by the new checks. These few direct HTTP trials do not establish overall reliability or exercise the native UI. `npm run check` passed 154 tests, all 20 atlas checks and the frontend build; Windows `cargo check` passed after the Rust prompt change. Native visual review and Mac remain pending.

## Quest entry integration check — November 23, 2026

A fictional automated test now exercises the single-entry path through a mocked local model response, detail review, saved commitment and proposal, source IDs, effort cap, and duplicate submission guard. `npm run check` passed 145 tests and all 20 atlas checks. This test does not replace a native UI run or prove live-model reliability.

## Animation asset spot check — November 23, 2026

The source frame sheets and runtime atlases for post-nap stretch and unlock celebration were inspected side by side; their static pose sequences correspond. This is a two-clip asset spot check, not verification of timing, other clips, wearable alignment, or rendering in the app. Those checks remain pending.

## Quest entry before adoption — November 23, 2026

The shared quest composer explains why creation is unavailable until a dog is adopted; the message is visible without opening More options. `npm run check` passed 143 tests, all 20 atlas checks, and the frontend build. Native visual review and Mac remain pending.

## Quest effort guard — November 23, 2026

The shared state reducer rejects a newly proposed quest longer than its commitment's estimated total effort, including atomic one-field submissions. The reviewed composer caps its proposal before saving; explicit later quest edits retain the existing flexibility. `npm run check` passed 142 tests, all 20 atlas checks and the frontend build. Native UI and Mac remain pending.

## Choosing permitted reflections — November 23, 2026

Both local and sample planners now rank permitted reflections by shared words with the commitment, then recency. This is a simple local keyword heuristic, not semantic retrieval: it can miss related wording and may include recent unrelated permitted entries when there are fewer matches. Only permitted records are selected; selected IDs and stale-content checks remain intact. `npm run check` passed 140 tests, all 20 clip-atlas checks, and the frontend build. Native UI and Mac remain pending.

## Memory book feedback — November 23, 2026

Opening or closing a memory book plays a short synthesized cue when sound is enabled; the existing visible book and status text remain available when muted. Repeated cues are throttled. `npm run check` passed 137 tests, 20 atlas checks, and the frontend build. Audible playback and native visual verification remain pending; Mac remains pending.

## Shared quest details and animation testing — November 23, 2026

The shared one-field quest composer can extract a stated deadline and total effort via the local model. Suggestions require matching source text and an editable review before saving; missing or malformed suggestions are ignored. Deadlines are suggested only when the evidence includes an explicit time; date-only input needs manual entry under More options. The sample fallback stays labeled and does not extract details. A small direct Ollama trial with fictional input found both details using Gemma 3 12B; 4B initially found effort but missed the deadline. With a revised prompt, 4B extracted the explicit details in two fictional requests and left a date-only request without a time. This is not a reliability guarantee, and model guesses require review. The previous single-field entry note below describes an earlier version.

A snapshot of the primary checkout's animation work was reconciled in a staging worktree and integrated for testing without changing the original checkout. It adds clip playback, sleep/wake transitions, greetings, reward reactions, and a Dev-mode clip selector. Visual approval and wearable alignment across clips remain pending. The old animation handoff below records the earlier pre-integration state.

`npm run check` passed 138 tests, source-size and type checks, all 20 atlas checks, and the frontend build. Reviewed total effort caps the proposed quest duration rather than requiring an inflated estimate. Windows `cargo check` passed; interactive visual review was blocked by automatic review because unrelated sensitive content was visible. Mac remains pending.

## Shared quest entry — November 23, 2026

Home Quests and the floating toy now use the same single-field composer. It asks the selected local model for a proposed title, reason, and duration; if planning fails, the app explicitly labels the sample fallback. Existing detailed commitment entry, model selection, duration preference, and exploration remain under More options. Both commitment and proposed quest are saved together, with current length and reflection-permission checks applied at save time. Quest title and duration remain editable; deadlines and total effort are not extracted from free text yet.

`npm run check` passed 121 tests, type/size checks, and the frontend build. Windows release compilation and native UI checks are recorded separately; Mac remains pending.

## Tailscale browser preview — November 23, 2026

An isolated Vite preview can bind to the machine's private Tailscale IP on a separate port. In browsers on plain HTTP, `crypto.randomUUID` may be unavailable, so ID creation now falls back to cryptographically random bytes using `crypto.getRandomValues` and creates a version-4 UUID. No insecure random fallback is used. The browser stores its own local data and cannot perform native floating-window or Rust/Ollama operations. Do not enter sensitive data into the HTTP preview; it is intended only for fictional testing. The desktop app and other preview remain separate.

`npm run check` passed 119 tests and the production build; isolated Windows release compilation passed. The preview returned HTTP 200 from the local machine on the Tailscale IP. The in-app test browser was unavailable, and no separate phone connection was verified. Tailscale HTTPS Serve was not enabled on this tailnet. The preview process is temporary and must be restarted after shutdown.

## Native unavailable-AI recovery — November 23, 2026

With the temporary Ollama service stopped, a fictional local quest request returned an unavailable-or-timeout message suggesting starting Ollama and installing the selected model. The sample quest button then successfully proposed a quest in the same Windows session. The feedback was below the visible area after clicking the first commitment. It is now rendered next to the initiating action; `npm run check` passed 118 tests and the frontend build. Native visual and screen-reader verification remain pending. This verifies the stopped-service recovery path; other network and model failures remain separate checks.

## Native permission revocation check — November 23, 2026

In the isolated Windows profile, a fictional perspective memory was explicitly allowed, included in a sample quest, and then disallowed. The persisted quest retained its commitment source but removed the memory source and replaced the copied rationale with a removal notice; the memory remained present with permission off. This verifies the sample path only, not every local-model or external integration scenario.

## Windows dragging check — November 23, 2026

In the isolated Windows test profile, automated drags on the floating dog did not change the persisted floating position, even after focusing it; the same automation moved the decorated home title bar and saved its new position. This does not distinguish an application drag failure from a timing limitation in the synthetic gesture, because the floating drag is initiated asynchronously by Tauri. Treat floating dragging and placement persistence as unverified and investigate with a real mouse or a controlled held-pointer test before release. The test profile was quit normally.

## Optional perspective exercise — November 23, 2026

Memories includes optional prompts for a situation, known facts and uncertainty, another possible perspective, and a possible next step. Responses are user-authored; the prompts generate no factual claims or AI discussion. The draft is temporary until explicitly saved as a memory, which starts excluded from suggestions and can be permitted later using the existing memory control.

`npm run check` passed 118 tests, type/size checks, and production build; isolated Windows release compilation passed. A fictional native exercise was saved, opened on the bookshelf, and shown with its suggestion permission unchecked. Mac remains pending.

## On-demand exploration ideas — November 23, 2026

Quests offers a month-labeled sample idea based on a user-entered interest, available minutes, and challenge. It does not inspect calendars, infer interests, call AI, or generate ideas automatically each month. The user chooses whether to add the idea as a proposed quest; its commitment and quest save together, subject to the current suggestion-length limit.

`npm run check` passed 116 tests, source-size and type checks, and the production build; isolated Windows release compilation passed. In a fictional native profile with a five-minute limit, a watercolor idea displayed five minutes and was added as a proposed quest. Mac remains pending.

## Live constrained 4B recheck — November 23, 2026

After the response-boundary and preference changes, the isolated Windows app used the local Gemma 3 4B model with a five-minute maximum on the fictional commitment “Practice a fictional project outline.” The structured proposal was five minutes and saved successfully. Its instruction to review an outline's structure arguably assumes an existing outline that was not supplied, so grounding remains a real concern despite valid JSON and duration. This is a single additional trial, not evidence of reliable model behavior. The temporary service was stopped afterward.

## Animation integration handoff — November 23, 2026

At the 7:33 a.m. inventory, the primary checkout was on `codex/pocket-pup-animation-review` at `3103109`, with extensive uncommitted runtime, art and documentation changes. Its current implementation status describes 20 approved clips, but the active uncommitted files overlap the build-out branch's companion, audio, motion accessibility and app-shell work. No snapshot was copied or overwritten. Coordinate a stable reviewed commit or patch with that work's owner, compare its exact assets and source with the approval record, then integrate in an isolated checkout and rerun normal/dev control gating, reduced motion, rewards, wardrobe fitting, floating UI and native tests. Do not simply cherry-pick an earlier draft or replace either set of changes.


## Temporary completion reaction — November 23, 2026

Completing an accepted quest no longer persists a permanent happy mood. After a successful save, the companion shows its existing happy presentation for four seconds and then returns to the previously saved mood; repeated completions extend the reaction. Failed or duplicate saves do not trigger it. This is automatic presentation, not a new manual dog control. Previously saved happy moods are preserved because their origin cannot be distinguished safely.

`npm run check` passed 114 tests, size/type checks and production build; isolated Windows release compilation passed. In a fictional Windows floating profile with reduced motion enabled, completing a quest produced a seated sparkle and then returned to idle; the saved mood remained idle. Sound playback and Mac remain pending.


## Bounded local AI responses — November 23, 2026

Local quest and model-list responses are now read incrementally with a 65,536-byte accumulated-body limit; an oversized Content-Length is rejected early, and oversized chunked bodies stop accumulation. Existing connection and overall timeouts remain. `npm run check` passed 112 tests, type/size checks and production build; Windows release compilation passed. Two Rust release tests exercised exact-limit, oversized declared and chunked HTTP responses, plus the model allowlist. A fresh real Ollama request after this change and Mac remain pending.


## In-app reduced motion — November 23, 2026

Settings now includes a persistent Reduce motion toggle. Either this toggle or the operating system preference reduces dog posture/face/breathing playback, floating toy transitions, hover transitions, and reward animation. Older saves default the toggle off; the operating system preference is always honored. Startup appears before saved settings are loaded, so its loader follows only the operating system preference. No manual dog controls were added.

`npm run check` passed 112 tests, size/type checks and production build; isolated Windows release compilation passed. In a fictional Windows floating profile, the setting was enabled and the toy opened and dismissed directly; Settings Quit remained visible. This was a spot check, not continuous animation measurement or an audible/muted test. Mac remains pending.


## Floating planned-time visibility — November 23, 2026

Accepted quests with a saved manual plan show its start and recorded time zone on the floating board; quests without a plan show no invented time. `npm run check` passed 110 tests, size/type checks and production build; isolated Windows release compilation passed. The fictional four-minute plan created in the earlier test survived a native restart and appeared on the floating board with its time zone. Mac and narrow-screen visual checks remain pending.


## Explicit quest-length preference — November 23, 2026

The Quests page lets a user choose an optional maximum for new suggested quest durations. The sample planner uses that limit, and local AI receives the maximum as a constraint; output exceeding it is rejected. The shared reducer checks the current limit again before saving a proposal, protecting against a changed preference while a request is pending. Existing quests do not change, and users may explicitly edit their duration afterward. No preference is inferred from a reflection. Older saves default to no maximum; older builds may drop this setting on save.

`npm run check` passed 109 tests, size/type checks and production build; isolated Windows release compilation passed. In the fictional Windows profile, selecting five minutes produced a five-minute sample quest. Local model behavior under the new maximum and Mac remain unverified.


## Manual quest time planning — November 23, 2026

An accepted quest can be assigned a time by entering a future free window in local time. The app places the quest at the start of that window, checks its duration against the entered end, a recorded commitment deadline, and other accepted quest plans, and stores the resulting UTC interval plus the entered window and time zone. The UI explicitly states that no calendar was checked; no calendar event or reminder is created. Duration edits, deferral, and dismissal clear a saved plan. The form also allows a plan to be removed. Repeated-hour DST ambiguity follows the platform's local-time interpretation. Older builds may silently discard these new optional plan fields.

`npm run check` passed 107 tests, size/type checks and production build; isolated Windows release compilation passed. Native Windows testing entered a fictional 1:00–1:30 PM window and saved a four-minute 1:00–1:04 PM plan; the saved test file contained the expected UTC times and zone. Conflict, deadline, duration and lifecycle cases were verified by automated tests. Native restart, external-calendar behavior, DST ambiguity, and Mac remain pending.


## Optional commitment details — November 23, 2026

The main Quests page accepts an optional deadline in the device's local time and optional total effort in whole minutes. A deadline is stored as an ISO UTC instant plus the device's IANA time zone and displayed in that zone; nonexistent local times are rejected. Ambiguous repeated daylight-saving times follow the platform's Date interpretation. Older records remain valid without details. The deterministic sample limits its proposed duration to a smaller supplied total estimate. Local AI receives the supplied constraints, and overlong output is rejected; neither path schedules a time or checks availability. Existing smaller-build saves may silently drop these new optional fields if opened and saved by an older version.

`npm run check` passed 103 tests, size/type checks and production build; isolated Windows release compilation passed. Native Windows testing saved a fictional four-minute estimate and produced a four-minute sample quest. Deadline conversion and invalid-date/zone cases were tested in code; native date-picker entry, DST ambiguity, full planner behavior and Mac remain pending.


## Completion reflection — November 23, 2026

After a saved completion, both quest views offer an optional reflection linked to that completed quest. Personalization remains off unless explicitly enabled. The floating board keeps its hidden, inert content mounted while collapsed, so an unfinished draft survives outside dismissal and reopening during the same floating session; it is not persisted until saved and does not survive leaving floating mode or quitting. Completed disclosure still resets when the board closes. No frame dismissal button was added.

`npm run check` passed 100 tests, size/type checks and production build; isolated Windows release compilation passed. In the fictional Windows floating profile, an accepted quest was completed, its reward was displayed, a draft survived outside dismissal/reopening, and saving produced a linked memory with personalization off. Native main-page reflection, reduced motion, audible feedback and Mac remain pending.


## Local AI availability check — November 23, 2026

Quests offers an explicit check for the selected local model. The Rust command queries Ollama's loopback model list with a short timeout, validates the supported model name, and sends no commitment or reflection content. A missing service or model gives a useful sample-planner alternative. The status is displayed beside the check and cleared on model changes. `npm run check` passed 98 tests and production/type/size checks; isolated Windows release compilation passed. Native Windows testing showed both the installed 4B model and the stopped-service recovery message. The service was stopped afterward. A live missing-model case and Mac remain pending.


## Floating toy native spot check — November 23, 2026

In the isolated Windows release profile, the open toy reached the expanded menu with the standalone toy hidden and no frame-dismiss button. Clicking the dog outside the panel restored the closed toy. With Dev mode off, manual dog buttons were absent; enabling it exposed Sit and mood controls below the toy, and disabling it removed them. Floating Settings Quit was used to close the test. A screenshot captured an intermediate opening frame, but there was no continuous frame recording or timing measurement; monitor-edge behavior, drag/placement, audible feedback, reduced motion, and Mac remain unverified.


## Local memory search — November 23, 2026

The bookshelf filters locally by case-insensitive reflection text and shows an empty-results message. The search does not send records anywhere or change permissions. Book buttons include date/time and their position in the current result list for accessibility. The existing open-book style preserves line breaks. `npm run check` passed 97 tests, size/type checks and production build; Windows release compilation passed. Native visual review and Mac remain pending.


## Adoption welcome — November 23, 2026

After a successful adoption save, the home companion shows a named welcome and briefly uses the existing happy artwork and sparkle. The visual reaction is temporary presentation state; the saved mood is unchanged. A synthesized welcome cue observes mute and plays only after a successful save. `npm run check` passed 96 tests, size/type checks and production build; the isolated Windows release compiled. A fresh fictional Windows test profile showed the named welcome after adoption; the brief reaction and audible playback were not separately observed. Mac and multiple adoptable dogs remain pending.


## Local model selection — November 23, 2026

The Quests page offers the provisional Gemma 3 12B default and a faster 4B option labeled as potentially less reliable. The choice persists, older saves default to 12B, and the native boundary accepts only these two model names. Ollama and the selected model must already be installed and running; the separate sample planner remains available. `npm run check` passed 95 tests, size/type checks and production build; the isolated Windows release compiled. In the fictional native profile, 4B generated a valid quest, the local service reported the 4B Q4_K_M model, and both the selection and quest survived restart. The test service was stopped afterward. This single request is not a reliability evaluation; see the existing model trial for failures and limitations. Mac remains pending.


## Native Windows spot checks — November 23, 2026

Using the isolated fictional test profile, the Memories recap displayed zero dated activities and identified one older undated completion. The wardrobe shuffle equipped the single owned notebook badge and displayed confirmation. A proposed quest's duration was edited from 5 to 7 minutes, and its context disclosure showed the linked commitment and no linked reflections. After closing and reopening the test app, the notebook remained equipped and the quest retained 7 minutes. A white window appeared briefly immediately after launch, before the app content; its duration and first loader frame were not measured. These spot checks do not establish audible sound, reduced-motion, floating placement, or Mac behavior.


## Repeated sound control — November 23, 2026

Rapid repeated cues of the same kind no longer overlap while their short synthesized tone is playing. Different cue types can still overlap. Muted actions do not create an audio context, and unavailable audio does not block interaction. `npm run check` passed 93 tests, size/type checks and production build; Windows release compilation passed. Tests use a simulated audio context; audible playback, native UI and Mac remain pending.


## Editable quest duration — November 23, 2026

The main quest editor now changes the estimated duration as well as the title, limited to whole minutes from 1 to 120. Proposed, accepted and deferred quests remain editable; completed and dismissed quests remain terminal. Editing preserves the planner rationale, source IDs, status, and reward records. `npm run check` passed 91 tests, size/type checks and the production build; Windows release compilation passed. Native UI and Mac remain pending.


## Windows startup measurements — November 23, 2026

Three sequential isolated release launches used the fictional `com.inova.buildout.verify` profile and fresh startup-diagnostic writes. Process launch to diagnostic detection (100 ms polling) took 996, 791, and 771 ms. Renderer navigation to UI-ready effect took 199, 162, and 171 ms; save initialization took 33, 28, and 27 ms, and window initialization took 99, 70, and 72 ms. The processes closed normally after measurement. The reported 30-second delay did not reproduce in this small warm-launch sample. These runs used hidden test windows; they do not prove first visible frame, loader visuals, a cold machine boot, development startup, or Mac behavior. No bottleneck fix is claimed. Use the existing diagnostic on an affected launch and compare the process/navigation phases before attributing a cause.


## Sample planner privacy race — November 23, 2026

Sample proposals now carry a transient snapshot of any reflected text they used, just like local proposals. The reducer rejects a proposal if a linked reflection changed, was deleted, or lost permission before the save. The snapshot is never persisted. Both home and floating sample-planning paths use this check.

`npm run check` passed 90 tests, size/type checks and the production build. Windows release compilation passed; native UI and Mac remain pending.


## Inspect suggestion context — November 23, 2026

Each quest in the main Quests page offers an expandable view of its commitment and linked reflections that are still allowed for personalization. It identifies those reflections as context provided to the planner, rather than claiming the model relied on every one. Editing, revoking or deleting a reflection removes the old reference; private and unrelated reflections are not displayed as sources.

`npm run check` passed 89 tests, size/type checks and the production build. Windows release compilation passed. Native visual review and Mac remain pending.


## Owned outfit shuffle — November 23, 2026

The outfit strip offers an optional shuffle that selects an owned item independently for each wearable slot and leaves slots with no owned items empty. The entire outfit is saved as one validated action; locked items and incompatible slots are rejected, and ownership and quest rewards are unchanged. The selection remains visible with sound muted and survives serialization.

`npm run check` passed 88 tests, size/type checks and the production build. Windows release compilation passed. Native visual review and Mac remain pending.


## Seven-day recap — November 23, 2026

The Memories page can show a local seven-day recap of dated completed adventures and the number of memories saved. New completions record an optional UTC timestamp; older undated completions remain valid and are counted separately without inventing dates. Private memories contribute only to the count and are not sent to AI. Duplicate completions cannot rewrite the timestamp. The date window excludes future and older records.

`npm run check` passed 86 tests, size/type checks and production build. Windows release compilation passed. Native runtime, visual review and Mac remain pending.

## Memories linked to adventures — November 23, 2026

A new reflection can optionally reference a completed quest; the open book shows its title. The shared reducer rejects new references to unfinished or missing quests, while standalone memories remain available. The selected link is preserved through editing and the save schema stays at version 2. The form resets the link and personalization permission after saving.

`npm run check` passed 84 tests and type/size/build checks; Windows release compilation passed. A fictional reflection was linked to a completed quest, reopened, reloaded, and reopened again in browser preview; permission remained off. This does not establish native restart or Mac behavior.

## Quest reward reveal — November 23, 2026

The main quest page and floating toy show an animated, readable completion card naming each item actually unlocked by the saved completion. The card also identifies the completed quest and gives a saved-progress message if no new item was unlocked. It does not announce an item again for duplicate, ineligible, or failed saves. The existing synthesized reward cue and mute setting remain in use; reduced motion disables the reveal animation. Floating completion retains focus on Completed and returns the list to the reveal instead of scrolling the feedback out of view.

`npm run check` passed 82 tests, type/size checks, and production build; Windows release compilation passed. In the isolated browser preview with fictional quests, completions showed the notebook and bandana unlocks and a no-new-item completion; the third reveal and Completed focus were visually checked. This is browser evidence, not native overlay, audible playback, muted playback, or Mac runtime verification. Item graphics are existing provisional wardrobe glyphs and reward thresholds remain demonstration rules.

## Local planner integration — November 23, 2026

The build-out worktree offers an explicit Local AI quest action in the Quests page. It calls the local Ollama `gemma3:12b` model through a bounded Rust command, sends the commitment and up to three permitted reflections, validates JSON and quest fields, and records the supplied source IDs. The existing sample planner remains separately selectable. Errors tell the user to start/install the local service and preserve manual/sample use. Before saving a local proposal, the reducer checks that each supplied memory is still allowed and unchanged. Revocation/edit/delete removes copied local-model title and rationale as well as the source ID. Existing v2 saves remain readable; older builds cannot read new `planner: local` quests.

`npm run check` passed 80 tests plus type/size/build checks; Windows release compilation passed. Local-service error and mocked valid/invalid output paths were tested, but no live model or native UI run was performed.

A verified standalone Ollama runtime was subsequently downloaded into ignored `.tools/ollama`; Gemma 3 4B and 12B were measured on fictional examples. The native Windows test app generated a real 12B quest through the app. The 4B initial run invented a chapter; a revised prompt avoided that specific failure in the small recheck. The 12B remains a provisional default. See [model trial and limitations](evidence/local-models-2026-11-23/README.md). The app requires a running Ollama service; the isolated runtime is not packaged with the app. The benchmark service was stopped after testing to release memory; downloaded files remain in the ignored worktree. Browser preview can use the sample planner; the local action requires desktop mode. See [Ollama structured outputs](https://docs.ollama.com/capabilities/structured-outputs) and [local chat API](https://docs.ollama.com/api/chat).

## Build-out worktree — November 23, 2026

The isolated build-out branch adds memory editing with stale quest rationale/source removal on changed content, and editable titles for proposed, accepted, and deferred quests; completed and dismissed quests remain unchanged. Existing IDs, evidence, rewards, and saved schema are preserved. See [build-out checklist](BUILD_OUT_CHECKLIST.md) for pending work and baseline.

## Dog control gate and menu dismissal correction — November 23, 2026

All manual dog controls now share `DogDeveloperControls`, gated by adoption and Dev mode in both home and floating mode. Future dog buttons belong there. Normal-mode render tests reject any new dog action button outside the gate; adoption and wardrobe previews remain available. The redundant minimize icon and its styling are removed. Outside clicks, focus loss and Escape still retract the menu into the toy; no explicit dismissal button is needed.

`npm run check` passed: 88 source-file size checks, TypeScript, 72 tests in 17 files, and frontend build. Added regression checks for both home/floating gates, switching Dev mode off again, adoption availability, no expanded-menu dismissal button, inside/outside clicks, focus-loss dismissal, and listener cleanup. Windows release compilation passed. No fresh native runtime or Mac test was performed for this correction.

The earlier minimize-button/home-pose exceptions below are historical and superseded by this correction.

## Floating controls and toy transition — November 23, 2026

- Floating Sit/Stand now follows the Settings Dev mode toggle. Home pose controls remain available. Floating pose controls sit after the toy/menu in layout, with a separate stacking level, avoiding the negative-margin overlap.
- Opening the quest toy stretches its artwork into the illustrated menu; the standalone toy and badge disappear while expanded. A Minimize quest menu icon retracts the menu into the toy. Escape, outside clicks and focus-loss dismissal retain the same collapse path. Explicit minimize/Escape restores focus to the toy after retraction; outside dismissal preserves the clicked target. The panel becomes inert while closing and unmounts afterward.
- The native canvas keeps its stable width. Expanded height is held through retraction, then compacted once the menu is gone. Reduced motion skips the stretch/compression. Existing art and mute-aware synthesized squeak are reused; no new assets or persisted fields were introduced.
- Fresh `npm run check`: 85 source-file size checks, TypeScript, 67 tests in 15 files, and production build passed. Windows `npm run tauri build -- --no-bundle` passed. Browser checks on isolated fictional `/dev/toy.html` data verified Dev mode off/on, unobstructed Stand action, expanded toy disappearance, minimize, Escape/focus restoration, outside dismissal, and the same visible states with sound muted. Reduced-motion behavior was inspected in source, not exercised through a browser media override. Audible output, native resize animation, and Mac runtime remain unverified.
- Try the animation with `npm run dev -- --port 5196`, then open `http://127.0.0.1:5196/dev/toy.html`. This development-only page uses fictional demo records in that separate browser origin; it is not the native overlay.

## Consolidated main — November 23, 2026

The primary project folder is now the `main` checkout. See [consolidation inventory](MAIN_CONSOLIDATION.md) for every worktree and the recovery checkpoint. Continue functional work here rather than in the old worktrees.

Combined capabilities include the existing quest toy/navigation/window fixes, approved sit/breathing/seated tiredness, four-slot wardrobe with v1-to-v2 save migration and compact outfit controls, native X/Settings quit with bounded save draining, and a startup loading screen with phase feedback, delayed retry, and local timing diagnostics. Clothing uses seated anchors for every seated face and follows inhalation without moving socks. Clothing art remains provisional. The v36 loaf preview is preserved for review; its runtime timer remains disabled.

Fresh consolidation verification: `npm run check` passed size checks for 82 source files, TypeScript, all 65 tests in 14 files, and the production frontend build. `npm run tauri build -- --no-bundle` passed and produced `src-tauri/target/release/inova.exe` in this folder. No fresh native UI walkthrough or Mac compilation/runtime was performed. Earlier native quit evidence is preserved in [reliable-quit](evidence/reliable-quit/README.md); those captures predate this consolidation.

The notes below include historical checkpoints; the consolidated status above takes precedence.

## Approved seated tiredness - November 23

The user approved v35. Mood changes now preserve the local seated pose; tiredness plays the reviewed eye-only sequence, then holds tired sitting with grounded breathing. Pose commands retain the shared mood. Happy sitting currently uses the approved neutral seated face plus sparkle, pending its expression review. Breathing phase continues across seated face frames. No persisted schema change.

`npm run check` passed size limits, TypeScript, **37 tests in 8 files**, and the production build. Windows release library compilation passed (`cargo build --release --lib --locked --offline`); running apps were not replaced. Browser checks with fictional Mochi observed tired sitting, idle/happy recovery staying seated, fitted bandana, and seated breathing URLs. Native runtime and Mac verification remain pending.

The next review is tired sit to loaf after seven seconds. Loaf and its runtime deadline remain disabled until approval. Sit to stand still changes directly and awaits its separate rise clip. Navigation currently remounts local posture; it is tracked in [the coverage ledger](TRANSITION_TABLE.md).

## Pocket Pup and breathing integration — November 23

The approved v32 neutral/tuck/sit sequence and v34 grounded breathing loops now render in the app. The integration is based on main `2dd9b1e` and preserves its quest-board organization, toy dismissal, navigation, wardrobe/memories split, and native layout code. Breathing uses the exact reviewed PNG phases (800/450/650/900ms), keeps paw pixels fixed, follows the neck with the bandana, pauses during the tuck, and stops for reduced motion.

`npm run check` passed: source sizes, TypeScript, **31 tests in 7 source test files**, and production build. Test discovery is limited to `src` so nested worktrees and local backups do not inflate results. Windows release library compilation passed with `cargo build --release --lib --locked --offline`; running executables were not replaced. Browser preview showed current main navigation/wardrobe, standing/sitting controls, bandana, and changing breathing frame URLs. Native runtime behavior and Mac compilation/runtime remain unverified for this integration.

The user's next requested hierarchy is not silently treated as delivered: seated mood changes must preserve posture, tired sitting should lead to loaf after seven seconds, and standing up needs a reviewed transition. These are the next review-gated scenarios; existing direct stand-up/mood-reset behavior remains a known limitation until those clips are approved. See [integration notes](POCKET_PUP_INTEGRATION.md) and the artist scenario brief.

Shared starter checkpoint: November 22, 2026. Three builders; Windows and Mac; deadline December 1. Inspect current code before relying on this checkpoint after later changes.

Main integration checkpoint: November 23, 2026. The user approved the reviewed companion/toy/navigation work through bac64bc for main. This integration preserves the original dirty checkout, the separate Pocket Pup drafts, and the separate frame-fix worktree. The user subsequently approved integrating the captured/verified frame fix; main now reserves a stable floating canvas width and includes its evidence. That checkpoint used `.worktrees/main-integration`; main now lives in the primary project folder.

## Implemented starter

- Wardrobe UI refinement: top clear-outfit icon; side-by-side human Stand/Sit icons; All/Hat/Glasses/Socks/Body inventory filters; hanger navigation distinct from the T-shirt category; icon wear/remove/locked/worn states. The normal transition selector and implementation paragraph are removed. Icon rules are recorded project-wide in AGENTS.md. No inventory schema/reward changes in this refinement.

- Icon refinement verification: `npm run check` passed 67 source-file size checks, TypeScript, all 45 tests, and frontend production build. Windows release compilation passed. Browser review verified all five filters, both poses, Enter/Space activation, and the narrow layout; [current screenshot](evidence/wardrobe-slots/icon-controls.jpg). Native Windows/Mac UI runtime remains unverified for this branch.

- November 23 wardrobe worktree (`codex/wardrobe-slots`, rebased onto main `2dd9b1e`): four simultaneous worn slots, pose-aware SVG placeholders, ten catalog entries, three developer-gated fictional outfit scenarios, individual removal/clear-all, and schema-v1-to-v2 migration. Selected Pocket Pup exports and existing pose playback are integrated without replacing main's quest toy/navigation/window-layout changes, including newest-first/completed quest grouping. See [contract and test steps](WARDROBE_SPEC.md).

- Outside dismissal tests the actual toy button and board separately, not their full-width layout wrapper. Empty space beside the toy and the gap above the board now count as outside. The wrapper is not text-selectable, while board text remains selectable.

- The quest board has no close/X icon. Clicking outside the toy/board collapses it; interacting inside stays open. Losing native window focus (for example, clicking another app) also collapses it. Clicking the toy again and Escape still close it. Listeners are installed only while open and cleaned up on dismissal/unmount, including late native subscriptions. Outside dismissal does not steal focus back from the clicked target.

- Home navigation uses a monochrome pixel bone toy for Quests, matching the other dark navigation icons. Floating mode retains the detailed gold/teal toy artwork. This supersedes the earlier shared colored navigation-art choice below; only the home icon rendering changed.

- Tauri 2/Rust desktop shell with React/TypeScript/Vite interface and locked npm/Cargo dependencies.
- One window with normal home and compact transparent always-on-top mode controls; native drag-region markup.
- Isolated layout fix: separate persistent home/floating geometry, home size/maximized restoration, monitor work-area clamping, and content-fitted floating height. Floating page scrollbars are suppressed and the quest popup is kept within the window's width.
- Adoption/name, selectable moods, selected Pocket Pup runtime sprites, and separate pose-anchored wearable placeholder layers.
- Manual commitment entry and a labeled deterministic sample Planner interface.
- Quest proposal, acceptance, deferral, dismissal, and completion.
- Duplicate-safe completion rewards: notebook at one quest and bandana at three; four simultaneous equipment slots (hat, glasses, socks, body) with per-slot replacement/removal and clear-all.
- Reflection entry, dated memory buttons, readable entry view, per-entry personalization permission, and deletion.
- Shared validated state with queued mutations and local persistence adapters for desktop and browser preview.
- Click/reward synthesized tones, shared mute setting, error messages, and reduced-motion CSS.
- Entering floating mode does not leave a persistent mode-change success banner; switching errors remain visible.
- Home/Settings pixel icons replace floating text controls. Settings contains sound and persistent dev-mode toggles; manual mood controls are hidden by default. Existing saves default devMode to false. Companion status uses a small stepped pixel chip.
- The Home icon appears only in floating mode; the home interface shows Settings alone.
- Floating controls and enabled mood status reveal on dog hover or keyboard focus, remaining available during control/menu interaction. Settings adds a persistent Status bar toggle, off by default and compatible with older saves.
- Floating mode includes a generated golden bone/teal rope toy. Clicking it expands an illustrated quest board showing every non-dismissed quest, with proposed, accepted, deferred, and completed states kept distinct. The frame grows with its contents; the list scrolls internally at the screen-height limit.
- Quest board organization: unfinished quests appear newest first across statuses. Completed quests sit below them in a single Completed (count) disclosure, collapsed whenever the board opens. Expanding it shows completed quests newest first; the badge still counts unfinished quests only. Accept/complete feedback stays visible outside the collapsed group, and completion focuses its disclosure button. Disclosure clicks honor mute. This is view state only; saved quest order, schema, validation, and rewards are unchanged.
- The toy board's commitment field and check button save a manual commitment and propose a sample quest. Each proposed/deferred quest has a toy-shaped Fetch action to accept it; accepted quests can be completed there using the existing reward rules. Display copy uses adventure language without changing stored records.
- Expanded floating windows fit both width and height, and clamp their placement back into the monitor work area after resizing. Escape/close collapses the board. Keyboard focus, visible feedback, and the shared sound setting remain available.
- Floating dog and toy are centered in both compact and expanded mode, with the toy below the chin. Native content fitting converts CSS pixels through the webview pixel ratio and OS scale so zoom does not clip the board or leave an oversized compact window; resize events remeasure the content. The frame's painting stays inside its own bounds.
- Toy open/close plays a short synthesized rubber-toy squeak, honoring the existing mute setting. This is synthesized sound, not a recorded squeaker.
- Floating mode reserves the quest board's 384 CSS pixel width even while collapsed. Opening/closing changes height only, so the native window never moves sideways with a stale painted frame. Dog, toy, and controls keep the same screen positions. The collapsed canvas has wider transparent margins; those margins still intercept clicks because selective click-through is not implemented. Zoom changes can still resize/reanchor the window; screen-edge clamping takes precedence.
- Floating pet content has its own stacking context beneath companion controls, so the toy, quest count, and quest board cannot paint over Settings. The development toy preview includes the real settings controls for overlap review.
- Floating Home/Settings controls use a centered compact-width strip rather than the full quest-board width. Their positions and the settings pane remain anchored relative to the dog as the board expands/collapses.
- Floating hover reveal covers the continuous pet-panel area, including the toy and space above developer emotion controls, so moving from the dog to a mood button does not hide/disable the buttons. Leaving the companion still hides hover-only controls. The development toy preview uses the real PetPanel, including developer controls.
- Quest board heading is Fetch a Lil' Side Quest with flanking decorative stars. Removed the small blue tagline, composer hint, and sample-planner footer at the user's request; the quests screen retains its sample-planner disclosure. The commitment input/check form shares one continuous border, with no grid gap or button offset/shadow.
- The toy's dashed focus bounding box is restricted to Dev mode. Normal mode uses a shape-following image glow for keyboard focus instead of a rectangular outline.
- Home copy is pared down to Inova branding, navigation/actions, and the dog's name (or Adopt a dog). Removed the growth tagline, shared-starter suffix, prototype banner, repeated companion/greeting labels, wardrobe/adoption implementation hints, and deadline footer. The quests screen continues to explicitly identify the deterministic sample planner.
- Home uses one header: Inova at left, four navigation icons in the center (paw, golden/teal quest toy, shirt, open book), and Float then Settings together at right. Every icon has an accessible name and tooltip; active navigation remains highlighted. Narrow windows wrap navigation beneath the brand/actions. Floating mode retains its anchored Home/Settings strip.
- Wardrobe and Memories are independent pages: WardrobePanel owns equipment presentation, and MemoryShelf opens directly from its own Memories tab. The old combined WorldPanel/bookshelf toggle is removed. QuestToyIcon reuses the same transparent artwork in home navigation, the floating toy, and quest Fetch actions. The paw icon is unchanged. Persistence, rewards, and memory permissions use their existing shared actions/schema.
- Native companion alignment follows the current webview viewport. The resize_floating Rust command groups move and size in one main-thread task. Windows frame capture demonstrated that grouping alone still exposes a shifted previous frame during horizontal resizing; the stable canvas width above removes that opening/closing race. Keep the native command when integrating. Mac runtime timing remains unverified.
- Quest-list scrolling sits 22 CSS pixels nearer the right frame border, with matching internal padding so quest copy and action buttons keep their original alignment.
- Browser overlap review confirmed Settings receives hit testing at the toy's center while open. The adjusted scrollbar was visually checked beside the right frame rail; the frame clips at its outer edge rather than its inner padding so the inset scrollbar remains visible.
- Feature folders and three task handoffs, with shared agreements and Windows/Mac CI configuration.

## Verified in this setup

- November 23 quest-board organization: `npm run check` passed size limits, TypeScript, all 24 tests, and production frontend build. Windows native debug compilation passed using the isolated test configuration described below. With fictional muted data, native accessibility and visual review confirmed newest-first active/completed lists, adding a quest at the top, disclosure expansion/collapse with Space/Enter, collapsed state on board reopen, completion feedback/focus, and the all-completed case. No Mac runtime or audible playback check was performed for this feature.
- Wardrobe branch: browser checks confirmed all four slots, three pose previews, per-slot removal, saved reload, slot replacement, clear-all, muted feedback, and retaining the outfit with developer controls off. [Screenshot and verification scope](evidence/wardrobe-slots/README.md). Windows release compilation passed; native runtime and Mac verification of this branch remain outstanding.
- Final wardrobe validation after rebasing onto main `2dd9b1e`: `npm run check` passed 65-file size limits, TypeScript, all 45 tests, and frontend production build. `npm run tauri build -- --no-bundle` passed Windows release compilation after the frontend refinements. These results belong to this isolated branch, not a claim that it is already merged into main.

- November 23 isolated toy-frame fix: reproduced and captured the original native Windows blink before editing. A clean baseline showed an opening shift of -127 physical pixels and closing shift of +127. After the fix, 2,252 captured frames across 64 opening/closing transitions had one constant dog position, one native width, and one native left edge. Includes muted/dev controls and sound-enabled/normal controls, plus native test-app restarts. See [frame evidence and reproduction](evidence/floating-toy-frame-fix/README.md). This does not establish audible output, dragging, or Mac behavior.
- Fix validation: `npm run check` passed all 23 tests, size limits, TypeScript, and production frontend build. `npm run tauri build -- --debug --no-bundle --config .tools/native-test.json` compiled the Windows app with an isolated title/identifier and the same production frontend; fictional records kept test saves separate. The temporary config is described with the evidence.
- Fresh `npm ci` and `npm run check` passed in the main integration checkout: size limits, TypeScript, all twenty-three tests, and frontend production build.
- `npm run tauri build -- --no-bundle`: Windows release compilation passed in the main integration checkout after the outside-click dismissal change, producing src-tauri/target/release/inova.exe there.
- Outside-dismiss browser check: the board has no close icon; clicking the commitment input kept it open, and clicking outside collapsed it. Native focus-loss dismissal is wired to Tauri's window-focus events but still needs hands-on Windows/Mac confirmation.
- Browser preview UI: adoption, adding a commitment, proposing/accepting/completing a sample quest, unlocking/equipping the notebook, saving/opening a dated reflection, and retaining the adopted/equipped dog after reload were observed.
- Browser controls check: Home/Settings icons and compact status render; enabling dev mode reveals mood controls, disabling it hides them, and the sound setting changes independently. Native layout still needs platform runtime confirmation.
- Domain tests check duplicate rewards, ineligible completion states, locked items, fabricated evidence, and private/revoked/deleted memory handling.
- Split-page browser review: Wardrobe showed locked/equipment controls without memory forms; Memories showed reflections/books without wardrobe controls. Saved and reopened a fictional dated memory with personalization permission off. Verified all four navigation buttons have distinct accessible labels and the new quest icon uses the floating toy asset.
- Quest toy browser preview: three fictional quests displayed together; creating a fourth commitment produced a proposed quest; its toy action accepted it and changed the visible status to On the trail. The generated frame and internal list scrolling were visually reviewed. Preview: `npm run dev -- --port 1423`, then `/dev/toy.html`; use this separate origin to keep its fictional records apart from normal preview data. This development-only entry is not in the production build.

## Still unverified or incomplete

- Windows native overlay appearance, dragging, and native save/restart need hands-on runtime testing. Compilation alone does not establish them.
- Mac floating-dog runtime passed by hand on November 26 (see the entry above); other features have not been run natively on Mac. GitHub's matrix compiles both platforms; inspect Actions for actual run results.
- The GitHub CLI token on the initial workstation is invalid, so authenticated Actions inspection is unavailable; SSH Git access works.
- No live AI, credentials, scheduling engine, assignment/calendar/grade integration, cloud sync, or sign-in.
- No recorded bark, final sprite set, multiple adoptable variants, mature animation, dedicated book/door audio, or full item reveal sequence.
- No quest editing, memory editing, world-item placement, click-through, or spooky-mode mechanics yet. New placement restoration and popup sizing still need hands-on Windows/Mac confirmation.
- The toy art is generated concept artwork, with responsive border-image stretching rather than a finalized low-resolution sprite atlas. It is independent of the other chat's dog artwork. See QUEST_TOY_ART.md for provenance and integration details.
- Desktop stores are plaintext. Browser preview and desktop data are separate; concurrent preview tabs/processes are outside the starter's state model.

## Next actions

Updated November 26, 2026. Feature freeze is November 30; demo December 1.

1. **Floating dog on Windows (blocks M2):** Mac passed November 26. A teammate runs [NATIVE_FLOAT_CHECKLIST.md](NATIVE_FLOAT_CHECKLIST.md) on Windows, covering transparency, always-on-top over other apps, dragging, home/float round trip, quit, and save/restart. Record results under `docs/evidence/`. Compilation alone does not count.
2. **AI provider and budget (blocks M5/M8):** decide whether to use a live provider or demo with the labeled sample planner. Then show one grounded suggestion that changes after a saved reflection.
3. **Quest wording editing (M5)** through a shared action, keeping proposed/accepted/deferred/completed distinct.
4. **Dog interaction and bark (M3/M7):** one deliberate interaction with visible feedback and a sound that is meaningful when muted.
5. **Animation:** review v37 stand-up; then the seated happy face and tired recovery.
6. **Demo rehearsal (November 30):** run the one-complete-demo script in 06-must-have-scope.md on both platforms with fictional data and a fallback plan.

## Commands

`npm ci`; `npm run dev` for browser preview; `npm run desktop` for native development; `npm run check` for source checks; `npm run tauri build -- --no-bundle` for native compilation. See SETUP.md for platform tools and paths.

Update this record with actual results as work lands. Repository documents are the shared implementation reference; companion Pages do not automatically sync. GitHub: https://github.com/JBarmada/Inova.


# November 23 — sample fallback review

The shared quest composer now always presents the labeled sample review before saving when local AI is unavailable, including inputs with no detected deadline or effort. This applies to the desktop and floating composers. `npm run check` passed 157 tests and the frontend build; visual verification in the combined native app remains pending.


## November 23 — recap ordering

The seven-day local recap lists recent completions newest first and tests its time boundaries. The automated check passed 158 tests; native saved-history and Mac verification remain pending.

### Wardrobe fit review (November 24, 2026)

The 37 costume overlays and ten older wearable items received a provisional pixel-art fit pass. A developer-only gallery shows every requested costume in standing and sitting poses. Screenshots from an isolated Windows desktop test profile are in `docs/wardrobe-review-2026-11-24/`, including the original bee and the revised gallery. These are simplified interpretations, not finished or user-approved concept-quality art; review each design with the user before considering wardrobe art complete. The test profile and separate build output do not update the hosted preview. Floating-window animation and Mac visuals remain unverified in this pass.

### Illustrated outfit fitting experiment

Bee, Toad and shrimp clothing concepts were generated as separate transparent art experiments. A bee test is visible in the developer wardrobe scenarios only; `docs/wardrobe-review-2026-11-24/bee-soft-fit-experiment.png` captures the actual Windows result. It fails alignment: the face opening and body do not fit the existing dog, and the generated image contains drawn ears and transparency artifacts. These are not approved or equippable production art. Fit separate clean pieces to each pose and animation before proposing replacement artwork. Toad and shrimp have not been tested on the dog.

### Bee costume motion work in progress

A revised bee garment is being tested against the original concept using separate face, body, and behind-dog wing layers. Stand-to-sit source-frame diagnostics preserve the face and tail but are not a substitute for native app or moving-animation review. Independent review found low, loaf, and sleeping poses still fail; the artwork is not approved or finished. A separate frame-indexed welcome-walk prototype and losslessly decoded atlas are present for Dev-mode review only: their anchor estimates remain unverified and the live walk is unchanged. The requested complete visual approval and other outfit conversions are outstanding.

The November 24 bee pilot now also interpolates lowered-pose garments and renders wings behind the dog. Its independent reviewer accepted neither the artwork nor the motion: a prior diagnostic showed a sleep-frame wedge and an abrupt transition, and the latest revision still needs review. Native screenshot capture is presently stalled when selecting either isolated Inova window; both app screenshot review and actual walk playback verification remain outstanding. Latest code checks: size, 20 clip atlases, TypeScript, 290 app tests and 4 preview tests pass. The full production build and Mac visual verification were not rerun after the latest pilot edits.

Bee pilot continuation: updated happy-loaf mouth clearance, stretch garment and walk-only fit. An independent reviewer inspected diagnostic sheets for all 20 clips in phases 0 and 3, plus selected other phases; no new major overlap was found, but the sleeping mouth remains ambiguous. These were rendered source-frame composites, not native screenshots or playback, and some sheets displayed only partially. The original treat effect appears disconnected from the mouth even without clothing. The Dev-only frame-indexed walking review can play the preserved eight-frame atlas; live welcome-walk still uses the original GIF. Native UI screenshot selection continues to hang, so the first costume is not approved and the remaining outfits have not been converted. Latest checks passed: size, 20 clip atlases, walk asset hashes, typecheck, 293 app tests, 4 preview tests, and an isolated Vite build. Native runtime visual review and Mac remain pending.

Bee pilot latest review: the upright under-chin band now uses a dark color closer to the original bee concept; low-pose collars retain their clearance-tested coloring. Eighty source-frame sheets (20 clips at four breathing phases) were generated and independently inspected individually, including sheets that had initially displayed only partially. This evidence predates the latest collar refinement and is not native playback. A fresh Windows native development launch using `npm run tauri dev -- --config .tools/wardrobe-review2.json --no-watch` compiled and launched; Vite serves the latest work through hot reload, but native screenshots and moving playback have not been verified. The walk player remains a developer-only prototype, and the user has not approved the bee or conversion of other outfits.

Post-collar checkpoint: a fresh native UI screenshot attempt hung again even after restarting the helper; no app screenshot or moving playback was obtained. Four post-change static sheets were inspected by the implementer: stand-to-sit (8 frames), stretch (4 of 5 frames visible; the viewer clipped one), low moods (5 frames), and the isolated walk prototype (8 frames). In the visible frames the dark upright collar did not visibly cover the smile; the sleeping mouth/collar boundary remains ambiguous and the walk torso remains rigid. These are diagnostics, not native verification or approval. The separate walk prototype now preloads its standalone atlas and can fall back to the original welcome image if that atlas cannot load; this prototype has not replaced normal welcome playback and requires native review.
Independent post-collar review additionally inspected stand-to-sit, loaf-to-sleep, stretch, and eight walk frames. The reviewer saw no new obvious mouth collision in those representative static composites and judged the dark collar closer to the reference, while noting the clothing shapes remain simpler. They have not re-reviewed all 80 sheets after the collar change and have not approved the final artwork.

Bee movement continuation: the ordinary welcome walk now uses a synchronized eight-frame atlas when it loads, with an original-GIF fallback. This lets the dog and worn layers receive the same frame index; actual Windows playback and floating-mode behavior still require review. A sleeping base-versus-composite pixel comparison found the original mouth at x19–21/y45 unchanged, with an unchanged pixel row immediately below after a sleeping-only collar adjustment; the independent reviewer saw a clear gap in that static comparison. Frame-specific walk hem contours were added. The reviewer found no new static paw/tail collision, but the first pronounced arches may read as notches; their depth was softened and needs another review. The latest reported automated run passed 301 app tests; these tests do not establish artwork quality, native screenshots, or animation continuity. The bee and remaining outfits are not approved.

The independent reviewer inspected the softened walk-frame arches: frames 3 and 6 appeared less notch-like, paws remained clear, and no new obvious collision was seen in those static composites. Actual moving playback remains necessary to assess continuity. A Windows Cargo check passed after the latest integration (as reported by the native build reviewer). Following the hem changes, source size and TypeScript checks plus nine focused costume tests passed. These checks do not constitute native screenshot, animation, or user approval.

Walk-to-rest handoff, November 24: a same-scale source composite compares the last welcome-walk frame with the neutral standing sprite; the standing comparison was checked pixel-for-pixel against neutral. The walking head and face are visibly larger, and the torso shifts and shortens at the swap. A diagnostic affine search suggested scaling the walk to 90.625% and translating it down 6 pixels; this is a measurement experiment, not a live fix or visual approval, and the bee hood still differs in size. A newly generated replacement walk concept was rejected as production art because it has red/black edge artifacts, an inconsistent pixel grid, and unverified frame registration and loop continuity. The concept was not added to live assets. Native playback and actual screenshots remain outstanding; bee and all other outfit work remain unfinished.

Walk lifecycle follow-up: the synchronized atlas renderer is now selected for bee-equipped walks only; other outfits retain the original GIF. The bee renderer waits for atlas readiness and uses the normal dog if loading fails or reduced motion applies. A body equipment change interrupts an active walk, and interrupted preview timers are cleared so they cannot end a later walk. These safeguards need real Windows and floating-mode playback review; they do not resolve the visible walk-to-rest art mismatch.

The current walk also stops on a pose request. The full frontend suite passed 305 tests across 95 files before a subsequent source-size refactor; checks after that refactor remain to be confirmed.

Registered walk trial: the complete walking dog and its clothing layers now share a 58/64 scale and 6/64 downward shift. An independent static comparison found the head and hood closer to rest, while the feet sit slightly low, the torso remains longer, and the walk art appears softer. The entrance motion uses a separate wrapper to prevent its animation transform from overriding this registration. These are provisional changes: native screenshots, Windows and floating-mode playback, continuity, and user approval of the first outfit remain outstanding. The latest checks passed 305 tests across 95 files, the 271-file source-size check, TypeScript checking, and an isolated Vite build; these checks cannot establish visual quality.

Correction to breathing-phase review: the 80 generated sheets are not 80 distinct appearances. The renderer selects the same atlas rows as runtime; raw atlas rows contain three pixel-distinct variants in 16 of 20 clips and one variant in four clips. With the bee layers composited, only four clips produce three distinct phase sheets (loaf-to-sleep, wake-to-loaf, post-nap stretch, and low-posture moods); the remaining 16 yield byte-identical sheets across phases. For example, in stand-to-sit frame 1, the five differing raw pixels fall under the garment. Review must describe unique composites rather than imply four distinct breathing appearances per clip. Runtime screenshots and playback remain pending.

Independent post-change static review: all 20 current clip composites and the distinct phase versions of clips 04, 06, 08 and m07 were inspected. The reviewer found no new obvious facial, paw, tail or wing collision; the sleeping mouth remains visible. These source composites do not prove runtime appearance or moving continuity. Native screenshots, actual Windows and floating-mode playback, and user approval remain pending. Latest reported checks: 306 tests passed, and source-size and TypeScript checks passed.

Pixel bee candidate: the bee in `art/pocket-pup/wardrobe-concepts/requested-costumes.png` is the original design reference; the fitting and review process is documented in `docs/WARDROBE_SPEC.md`. The outfit now has stepped hood, antenna and wing details, slanted stripes, and a rounder seated torso, with the dog's face separate. An independent reviewer inspected standing and sitting in the live browser: face, paws and tail remained clear, and the lowered seated wing root improved its connection. The wing roots still appear partly obscured by the head or tail, and the seated body still reads somewhat like a bib. This is a provisional candidate, not user approval; native screenshots, real moving playback and floating-mode review remain outstanding. Latest reported checks passed 306 tests, source-size and TypeScript checks.

Latest pixel bee pass: standing and sitting garment outlines now use stepped contours and angular hood joins. Wings were adjusted toward the shoulder and the seated chest uses a gold front with a side stripe, guided by `art/pocket-pup/wardrobe-concepts/requested-costumes.png` and the repeatable process in `docs/WARDROBE_SPEC.md`. An independent reviewer checked the latest standing and sitting in the live browser: no new obvious face, paw, tail or wing collision; the seated chest still reads as a front panel. The reviewer considers this suitable for provisional user feedback. Native screenshots, motion, floating mode and other poses remain unverified, and the outfit is not approved. Latest focused checks: source size, TypeScript and four bee tests passed.

Independent browser functional review on the isolated preview at port 1439, using a fictional dog: Dev unlock, equip, stand/sit display, navigation and reload persistence passed. The reviewer saw the face and paws in both poses; wings remained visible though their roots were partly hidden by the dog. This browser test is not native Windows overlay or full-motion verification. User review and approval remain pending.

A fresh isolated Windows build compiled and its window appeared. After browser connectivity was restored, the screenshot helper still hung when selecting the native window, so the bee's native appearance and moving playback remain unverified. The outfit is unfinished and awaits user review; the successful launch is not visual approval.

Bee fit follow-up: the hood was narrowed, the stripes and shading made more stepped, and the wings moved toward the shoulder. The sitting suit has an additional side band intended to suggest a wrap. Both static poses were inspected in the running browser; the standing wing root is still partly obscured, and the sitting suit remains a simplified interpretation of the concept. This remains a candidate for user review, not approved final art. Native and animated appearance remain unverified.

Full-art experiment: the user found the layered bee visually unchanged and requested an outside-app comparison and exploration of complete costume sprites. `docs/wardrobe-review-2026-11-24/compare.html` compares the original bee concept, the user's app screenshot, and an AI-generated full-character standing concept. This is a static concept, not a registered sprite or an in-app change. Browser security blocked opening the local file through the automation tool, so its visual layout has not been verified there. A matching sitting pose, expression and other equipment compatibility, animation, native testing, and user approval remain open.

The user pointed out that the full-art candidate changed Inu's appearance. A further image-generation edit using their actual dog screenshot also redrew his face and proportions despite instructions to preserve them; `docs/wardrobe-review-2026-11-24/bee-dog-reference-experiment.png` is reference-only and rejected as a faithful replacement. Future fitting must retain Inu's actual source pixels in uncovered regions and keep expressions compatible; the generated candidate is not production art.

Update: the user liked the dog-reference bee experiment and asked to put it on the site. A transparent-background derivative is now shown for the bee in the idle standing pose when no other slots are occupied; it was visually checked in the live browser. The full-character image does not preserve the original dog's pixels exactly or animate. Sitting, other moods, clips, and combinations use the previous layered bee until matching art exists. The swap between appearances is a known limitation; native and floating playback remain unverified.

Bee sitting and expressions follow-up: a generated sitting image and separate drawn happy, tired, and blink eye details now appear on the full-art bee in stable standing and sitting when no other slots are occupied. Browser review covered standing happy and sitting happy. The generated sitting pose has a different wing arrangement and body angle; transitional clips still use the earlier layered bee, so transitions can visibly change appearance. Other slot combinations and native/floating playback remain unverified.

Expression check: idle, happy and tired were exercised in standing and sitting in the local browser with the bee as the only equipped item. Bark was selected and started in developer controls; its clip renders the earlier layered bee instead of the new full-character art, so the appearance visibly changes. The bark sound and the full animation were not independently verified. The replacement bark animation remains open.

Bee sit-transition experiment: ordinary sit/stand intermediate frames and their developer preview clips now blend and slightly transform the new standing and sitting bee images instead of displaying the older layered costume. This is a crossfade between two differently oriented drawings, not per-pixel motion tracking or newly drawn animation frames, and may ghost. Automated progress mapping, size, TypeScript, 309 tests and a separate frontend build passed. The browser automation connection was unavailable for visual playback review; the result needs user and native/floating review. Loaf, bark, other clips and multi-slot outfits retain the earlier art.

## Bee animation follow-up — November 25

The bee now uses registered standing, sitting and loaf drawings in the wardrobe and companion renderer. Their feet share a ground line. Happy, tired, blinks and bark use independent facial details. The tired sequence settles into loaf, and the Dev pose button brings a loafed bee back to sitting before a separate press can stand it up. The old bee overlay and post-nap stretch are retired from the app's controls and playback. Chrome verification at `http://127.0.0.1:1439/` covered seated happy and bark, tired to loaf, and loaf back to sitting. A Windows native preview verified Dev unlock, equipping, both wardrobe poses, transparent floating mode, and the floating happy expression. Transitions may still show a cut between different drawn angles, and the welcome walk remains a standing-art bob trial. Additional accessory fit, a full motion and audio review, and Mac runtime remain open.

## Wardrobe batch 01 — November 25

Fancy mustache, The bob and The Lorax now use fitted head and muzzle layers over Pocket Pup's original art. The stable costume IDs, body slot, ownership and quest thresholds are retained. The synchronized eight-frame welcome walk carries each fitted layer. The live Dev Sit action stops in sitting from loaf for all outfits. The [batch review](wardrobe-review-2026-11-24/BATCH_01.md) records the rendered evidence and remaining checks. `npm run check` passed 313 app tests, four bridge tests, and the build. The Windows development build compiled and launched. The Lorax was checked in the native wardrobe, desktop companion and floating overlay.

## Wardrobe batch 02 — November 25

Army hat, Toad and Flower now follow the original dog's pose and walk frames. Toad has separate vest fits for standing, sitting, and resting. Flower has a smaller collar fit for resting and leaves Inu's facial expression visible. The catalog IDs, quest unlock requirements, and body slot were retained. `npm run check` passed 316 app tests, four bridge tests, and the build. Windows `cargo check --manifest-path src-tauri/Cargo.toml` passed. Toad was inspected in the Windows wardrobe, Companion view, and floating overlay. The [review evidence](wardrobe-review-2026-11-24/BATCH_02.md) records browser playback and open checks.

## Wardrobe batch 03 — November 25

Lord Farquaad, Harry Potter, and Clown around now use fitted head and neck layers on Inu's original pose and walk frames. The new collars have a compact resting fit. The catalog IDs, unlocks, and slot rules remain the same. Clown around was tried in the Windows wardrobe, desktop Companion view, and floating overlay. It also persisted with Mint socks after a browser reload, and clearing the outfit removed both items. `npm run check` passed 319 app tests and four bridge tests. The production build and Windows Cargo check passed. [Visual evidence and open checks](wardrobe-review-2026-11-24/BATCH_03.md).

## Wardrobe batch 04 — November 25

Cozy bathrobe, Cucumber spa, and USC hoodie now use fitted standing, seated, and resting coat silhouettes over Inu's original art, with intermediate placement during sit and the fitted welcome walk. The browser retained the USC hoodie after reload and showed both pose destinations with reduced motion. Disabling Dev mode hid the manual controls while the hoodie stayed equipped. `npm run check` passed 322 app tests, four bridge tests, and the production build. Windows Cargo check passed. [Visual evidence and open checks](wardrobe-review-2026-11-24/BATCH_04.md).

## Wardrobe batch 05 — November 25

Pikachu, Shrek, and Mort now use fitted creature hoods and garments over Inu's original frames. Their resting garment hem compensates for the head's lowered position. Mort remained equipped on browser reload and completed a live tired-to-loaf-to-sleep cycle. Waking returned to loaf and the next Sit action returned to sitting. The Windows native overlay displayed standing and seated-happy Pikachu. `npm run check` passed 325 app tests, four bridge tests, and the production build. Windows Cargo check passed. [Visual evidence and open checks](wardrobe-review-2026-11-24/BATCH_05.md).

## Wardrobe batch 06 — November 25

Iso, Omen, and Killjoy now follow Inu's original pose and walk frames, with shortened seated and resting jacket fits. Equipped eyewear takes precedence over Killjoy's and Harry Potter's built-in frames without changing the outfit's equipment slot. Killjoy was checked in the native Windows wardrobe, Companion and floating window, and a browser reload retained the costume with Round glasses equipped. Omen completed a live rest cycle and reached both pose destinations with reduced motion. `npm run check` passed 330 app tests, four bridge tests, and the production build. Windows Cargo check passed. [Visual evidence and open checks](wardrobe-review-2026-11-24/BATCH_06.md).

The expanded audit covered the browser expression and rest cycle, walk, and reduced-motion poses for all three, plus native fit across Windows Wardrobe, Companion, and floating. A separately equipped hat now takes precedence over Omen's hood and Killjoy's beanie. The updated check passed 417 app tests, four preview tests, and the build. Windows Cargo check passed.

## Wardrobe batch 07 — November 25

Shrimp suit, Wonder Bread, and Chicken nugget now have fitted face openings and standing, seated, and resting garment variants. Shrimp suit keeps its fin in compact poses. The native Windows wardrobe, Companion, and floating window were checked with Shrimp suit. Chicken nugget completed a live browser rest cycle and returned from loaf to sitting. `npm run check` passed 333 app tests, four bridge tests, and the production build. Windows Cargo check passed. The Vite build emitted a chunk-size warning at approximately 503 kB before compression. [Visual evidence and open checks](wardrobe-review-2026-11-24/BATCH_07.md).

The expanded audit covered all three costumes in the browser through rest, wake, bark, walk, and reduced motion, plus Windows wardrobe, Companion, and floating fit. The hood now yields to a separately equipped hat. The updated check passed 420 app tests, four preview tests, and the production build. Windows Cargo check passed.

## Original wardrobe refit — November 25

The original ten items equip through the existing four slots. Trail cap, Cozy beanie, Round glasses, Star glasses, and both pairs of socks are larger in wear. Notebook badge and Bandana use a clearer chest fit. Raincoat and Hoodie use distinct upright, seated and resting shapes, including a folded rain hood and contrasting snaps. Original clothing follows the synchronized welcome walk. `npm run check` passed 388 app tests, four preview tests, and the production build. Windows Cargo check passed. See the [legacy review](wardrobe-review-2026-11-24/LEGACY_REFIT.md) for visual evidence and open checks.

### Seasonal costume batch and themed unlocks

Christmas present, Canadian maple leaf, and Turkey dinner have standing, seated, and compact garment fits over Inu's existing frames. A separately equipped hat takes precedence over the gift bow and maple crown. Windows Wardrobe, Companion, and floating were checked with Christmas present and three accessory slots. Turkey dinner persisted across a browser reload and reached both pose destinations with reduced motion. [Browser recordings, platform coverage, and open checks](wardrobe-review-2026-11-24/BATCH_08.md).

The expanded seasonal audit covered the full browser rest cycle, bark, revised walk, reduced motion, accessory fit, and reload persistence for all three. Windows wardrobe, Companion, and floating fit were checked. Turkey dinner with accessories and a later cleared outfit survived full Windows restarts, with a frontend refresh needed on those dev launches. All three seasonal items stayed owned.

All 37 requested costumes can be earned through the existing quest completion action. Twenty-eight use a theme and nine use total completions. Categories use local English phrase rules against the quest title and linked commitment title. Unmatched titles are General. Wardrobe shows hints, while the category view is scoped to Dev mode on the Quest tab and floating quest board. Existing ownership and saved equipment IDs are retained, including the legacy ID for the renamed UFC hoodie. Tailscale verification used an AI-planned fictional tree-planting quest. It showed Nature in Dev mode, then awarded The Lorax with Dev mode off. The equipped reward persisted after reload.

The integrated `npm run check` passed 390 app tests, four preview bridge tests, and the production build. Windows Cargo check passed. Vite reported a roughly 520 kB minified chunk. Mac runtime and full wardrobe motion coverage remain open.

### Wardrobe batch 09

Sneaky bush, Bibble, and Fungus now follow the shared pixel-layer renderer through standing, sitting, compact rest and the synchronized walk. Bibble keeps a smaller wing when seated or resting. An equipped hat takes precedence over each built-in hood or cap. Windows Wardrobe, Companion and floating coverage used Bibble with Trail cap, Round glasses and Mint socks. Fungus passed the live browser tired-to-sleep and wake-to-sit sequence, reload persistence and unequip. `npm run check` passed 396 app tests, four preview bridge tests and the production build. Windows Cargo check passed. Vite reported a roughly 524 kB minified chunk. [Evidence and remaining checks](wardrobe-review-2026-11-24/BATCH_09.md).

The expanded browser audit covered rest, wake, bark, revised walk, reduced motion, accessories, and reload for each outfit. Sneaky bush now has pointed pixel leaves with veins. Windows Wardrobe, Companion, and floating fit were checked for all three, with a sampled native Fungus bark. The expanded check passed 420 app tests, four preview tests, the production build, and Windows Cargo compilation.

### Wardrobe batch 10

Soju bottle, The White House, and Elmo use pose-aware pixel layers over the original Inu sprite. The bottle neck, roof with flag, and red character hood give way to a separate hat. Their compact body fits preserve the paws and face. Native Windows Wardrobe, Companion, and floating verified The White House with three accessories. Tailscale verified Elmo under reduced motion, after a reload, and after removal in normal mode. `npm run check` passed 402 app tests, four preview bridge tests, and the production build. Windows Cargo check passed. Vite reported a roughly 528 kB minified chunk. [Screenshots, clips, and remaining checks](wardrobe-review-2026-11-24/BATCH_10.md).

The expanded audit covered all three in the running browser through rest, bark, revised walking, reduced motion, accessory combinations, and reload. All three were inspected across Windows Wardrobe, Companion, and the floating overlay. A dedicated middle-width White House side wing and window now fold in during the sit transition, with a sampled native clip. The updated check passed 421 app tests, four preview tests, the build, and Windows Cargo check.

### Wardrobe batch 11

Trojan knight, Ahri, and Teemo use fitted pixel layers over the original Inu sprite. Ahri's fan now draws behind the original body and tail, including on the synchronized walk, so rear paws stay visible. Windows Wardrobe, Companion, and floating mode were checked with Ahri, wearing Round glasses and Mint socks. Teemo passed the natural browser rest and wake cycle, reduced motion, reload, and removal. `npm run check` passed 409 app tests, four preview bridge tests, and the production build. Windows Cargo check passed. Vite reported a roughly 534 kB minified chunk. [Evidence and remaining checks](wardrobe-review-2026-11-24/BATCH_11.md).

The expanded audit covered rest, bark, revised walking, reduced motion, accessory fit, and reload for all three in the running preview, and Windows Wardrobe, Companion, and floating fit. Teemo received a narrower pack with a dedicated compact fit, sampled during a native Sit. Updated verification passed 421 app tests, four preview tests, the build, and Windows Cargo check.

### Wardrobe batch 12 and catalog coverage

Britney Spears, Goth, and E-girl use fitted shapes over Inu's original frames. All 37 requested outfits now have fitted art. The normal wardrobe, item previews, and wearable layers use the same fitted registration for every layered costume. The previously registered Busy bee uses its pose sprites. The old generic costume fallback is no longer used by the app.

Windows Wardrobe, Companion, and floating were checked with E-girl wearing Round glasses and Mint socks. Goth passed the live browser rest cycle, reduced motion, reload and removal. The source-level matrix verifies that every layered catalog ID renders art across representative stable and transition frames. It does not prove visual fit across those motions. `npm run check` passed 415 app tests, four preview bridge tests, and the production build. Windows Cargo check passed. Vite reported a roughly 517 kB minified chunk. [Batch evidence and remaining checks](wardrobe-review-2026-11-24/BATCH_12.md).

The expanded audit covered rest, bark, revised walking, reduced motion, accessory fit, and reload in the browser, plus Windows Wardrobe, Companion, and floating fit for all three. Each dress gained a distinct upright hem and an intermediate fold, sampled in E-girl's native floating Sit. The updated check passed 424 app tests, four preview tests, the production build, and Windows Cargo check.

### Expanded playback audit

Busy bee, Fancy mustache, and The bob completed the live muted browser rest cycle. The first pose action after waking returned Inu from loaf to sitting. The audit records standing, seated idle, happy, tired, loaf entry, sleep, wake, and return to sit screenshots, along with sampled bark and walk settling clips. Fancy mustache covers much of the mouth while resting. The full walk frames and native coverage for these variants remain pending. [Playback audit](wardrobe-review-2026-11-24/BATCH_01.md#expanded-muted-playback-audit).

Fancy mustache now uses narrower curls fitted around Inu's original mouth pixels. The [live comparison](wardrobe-review-2026-11-24/mustache-expression-refit.jpg) confirms clearer seated happy, sleeping, and waking expressions. The revised fit is provisional. The full walk and native floating fit are still open.

The Lorax, Army hat, Toad, and Flower completed the muted browser rest and wake cycle, bark samples, and reduced-motion sit and stand. The walk samples document a visible shape change at the handoff to the stationary sprite. [The Lorax](wardrobe-review-2026-11-24/BATCH_01.md#the-lorax-playback-audit) · [Batch 02](wardrobe-review-2026-11-24/BATCH_02.md#muted-and-reduced-motion-audit).

### Welcome walk handoff

The shared welcome walk uses the original standing artwork with alternate paw lifts for both undressed and layered outfits. It ends with the original standing frame, then restores Inu's live expression. Busy bee retains its dedicated portrait and now finishes the bob on its standing ground line. [Live comparison](wardrobe-review-2026-11-24/walk-settle-comparison.jpg). Toad with Mint socks and the bare dog were checked in the browser, including reduced motion with Toad. `npm run check` passed 414 app and four preview checks and the production build. Windows Cargo check passed. Fresh adoption and native playback of this revision need runtime checks.

Windows runtime confirmed that E-girl, Round glasses, and Mint socks survive a full exit and relaunch in the isolated wardrobe profile. The rebuilt desktop and floating windows both played the revised welcome walk and returned to standing with the outfit intact. The same equipped outfit appeared in the native wardrobe. [Windows restart and playback evidence](wardrobe-review-2026-11-24/BATCH_12.md#windows-restart-and-revised-walk).

Busy bee's welcome walk now steps from the reviewed standing portrait using the shared eight-frame timeline. Alternating paw lifts replace the whole-sprite bob. The original facial expressions and standing ground line carry through the handoff. The muted Tailscale preview covered Busy bee alone and with Mint socks, and reduced motion held the stationary portrait. The socks still sit slightly high. [Live comparison and clips](wardrobe-review-2026-11-24/BATCH_01.md#busy-bee-stepping-walk). Windows floating playback of this revision is pending.

Lord Farquaad, Harry Potter, and Clown around passed the muted browser rest cycle and reduced-motion stand and sit checks. The audit captures the revised walk and the transitions into sitting, from sleep into loaf, and from loaf into sitting. Round glasses replaced Harry Potter's integrated frames at the standing pose. [Batch 03 evidence](wardrobe-review-2026-11-24/BATCH_03.md#expanded-playback-audit).

Clown around now uses the concept's fuller spotted suit, red nose and cream ruff. Dedicated resting geometry keeps the shorter hem close to the body. Trail cap replaces the party hat, and Mint socks remain independently wearable. The live browser comparison includes rest, wake, bark and walk evidence. The revision is provisional and still needs native runtime review. [Clown around refit](wardrobe-review-2026-11-24/BATCH_03.md#clown-around-party-suit).

Cozy bathrobe, Cucumber spa, and UFC hoodie completed the muted browser rest cycle, including after compacting the rear hems. Reduced-motion stand and sit succeeded. A separate hat and eyewear now replace the corresponding Cucumber spa layers independently while retaining the robe. [Batch 04 evidence](wardrobe-review-2026-11-24/BATCH_04.md#expanded-playback-audit-and-fit-corrections). Native runtime of these revisions is pending.

Pikachu, Shrek, and Mort passed the muted browser rest cycle, reduced-motion pose controls, and revised welcome walk sampling. Shrek and Mort were also equipped with Round glasses and Mint socks and inspected in the native Windows wardrobe, desktop companion, and floating window. [Batch 05 evidence](wardrobe-review-2026-11-24/BATCH_05.md#expanded-browser-and-windows-audit). Native transition timing and art approval remain open.

### Original wardrobe playback

Raincoat, Cozy hoodie, Notebook badge, and Explorer bandana completed the muted Tailscale rest, bark and walk sequence and reduced-motion stand and sit. Each first Sit after waking ended in sitting. Native Windows confirmed the Cozy library day outfit across Wardrobe, Companion and floating stand and sit. The pocket and eye detail are less distinct at floating size. The subsequent accessory pass checked all six original hats, glasses and socks individually through muted rest, bark, walk, and reduced motion. The Star glasses were refitted with wider open lenses and reviewed in the hosted and Windows views. All four pieces of the Cozy library day outfit restored after a full native exit and relaunch, with a manual refresh required after the development loader stalled. Native per-item playback, rainy-outfit restart, Mac runtime, and art approval remain open. The check passed 424 app tests, four preview tests, a production build and Windows Cargo check. [Original wardrobe evidence](wardrobe-review-2026-11-24/LEGACY_REFIT.md).

### Current first wardrobe batch

Busy bee, Fancy mustache, The bob, and The Lorax completed current muted browser transitions, seven-frame walks, reduced-motion poses and accessory reload checks. All four were fitted in Windows Wardrobe, Companion, and floating mode. Bee portrait accessories now use their own eye and paw landmarks, with a shared pose transform and the existing accessory drawings. Both browser and Windows captures confirm the corrected fit. [Batch 01 evidence](wardrobe-review-2026-11-24/BATCH_01.md#current-playback-and-windows-fit).

### Current second wardrobe batch

Army hat, Toad, and Flower completed muted browser rest and transitions, current seven-frame walking, reduced-motion poses, and accessory reload checks. Each was inspected in native Windows Wardrobe, Companion, and floating mode. Toad with glasses and socks survived a full Windows exit and relaunch after a refresh recovered the development loader. [Batch 02 evidence](wardrobe-review-2026-11-24/BATCH_02.md#current-browser-playback-and-native-fit).

### Current third wardrobe batch

Lord Farquaad, Harry Potter, and the revised Clown around suit were inspected with Round glasses and Mint socks in all three Windows views. All three combinations survived a reload on the hosted preview. Screenshots supplement the previous browser playback captures. [Batch 03 evidence](wardrobe-review-2026-11-24/BATCH_03.md#current-windows-fit-and-browser-persistence).

### Current fourth wardrobe batch

Cozy bathrobe, Cucumber spa, and UFC hoodie were inspected with Round glasses and Mint socks in all three Windows views. Muted native UFC hoodie playback found a bark pose jump. Low poses now keep the base frame and costume anchors and add timed facial art and rays. The reduced-motion bark and seated recovery were confirmed in Windows. The check passed 426 app tests, four preview tests, a production build, and Windows Cargo check. [Batch 04 evidence](wardrobe-review-2026-11-24/BATCH_04.md#current-windows-fit-and-seated-bark).

### Native bark registration

Bark now keeps Inu's active sprite, including standing moods and intermediate sit, loaf, and wake frames. Only the face and rays change at the cue. Busy bee retains the reviewed portrait expression. Pikachu with Round glasses and Mint socks was checked in native Windows Wardrobe, Companion, and floating mode, with muted, reduced-motion standing and seated bark screenshots. [Batch 05 evidence](wardrobe-review-2026-11-24/BATCH_05.md#current-native-bark-fit).

### More Windows wardrobe restarts

Pikachu, Lord Farquaad, Harry Potter, and Clown around each restored with Round glasses and Mint socks after a full Windows exit and relaunch in the isolated test profile. Pikachu's relaunch required restarting the development server separately and refreshing the webview. The next three loaded with the server running independently. All four remained owned with Dev mode off. [Before and after screenshots](wardrobe-review-2026-11-24/windows-restart-stage-and-pikachu.png).

### Player-earned wardrobe coverage

The completion tests exercise all 28 themed rewards and the nine count-based costumes with Dev mode off. The themed fixtures start as proposed, are accepted, and award ownership after completion. They verify that a repeated completion does not award twice and that unlocking leaves the worn outfit alone. The classifier now recognizes examples such as asking someone on a date, cleaning up a neighborhood park, and watching a UFC fight in person. The UFC case excludes watch parties even when the linked commitment mentions event attendance. The matching still uses local English phrases.

On Windows, a Gemma 3 4B quest about practicing a puppet-show impression awarded Elmo and Notebook badge with Dev mode off. Elmo equipped from the normal wardrobe and stayed worn after a full restart. The “Voices and puppets” label appeared only after enabling Dev mode. The completion reveal now constrains reward thumbnails so the unlock text fits alongside them. [Native evidence](wardrobe-review-2026-11-24/BATCH_10.md#elmo-earned-in-windows).

Soju bottle and The White House also survived independent Windows process restarts, each paired with Round glasses and Mint socks. Removing The White House from its slot preserved the two accessories through another restart and left all three batch costumes available to wear. The two additional costumes used Dev unlock for test setup. [Windows restart evidence](wardrobe-review-2026-11-24/BATCH_10.md#windows-restart-and-slot-removal).

All 37 costume IDs now run through the shared dispatch and storage paths with Dev mode off. The tests verify saved ownership, Trail cap, Round glasses, and Mint socks during both equip and body-slot removal, including state reinitialization between mutations. They cover the browser storage adapter and the desktop adapter with a simulated Tauri store. The per-batch records track actual Windows process restarts separately. `npm run check` passed 459 app tests, four preview tests, and the production build.

Shrek and Mort each survived a separate full Windows exit and relaunch in normal mode with Round glasses and Mint socks. Mort also appeared in the floating window after restart with Dev controls hidden. Both costumes used Dev unlock for initial ownership in the test profile. These checks add to Pikachu's previous process restart. [Batch 05 Windows screenshots](wardrobe-review-2026-11-24/BATCH_05.md#shrek-and-mort-windows-process-restarts).

Iso, Omen, and Killjoy also passed separate Windows process restarts with Round glasses and Mint socks and Dev mode off. The test profile used Dev unlock for initial ownership. Replacing the outfit preserved ownership, and Killjoy remained legible when moved into the floating window after restart. [Batch 06 Windows screenshots](wardrobe-review-2026-11-24/BATCH_06.md#independent-windows-restarts).

Shrimp suit, Wonder Bread, and Chicken nugget each passed a separate Windows process restart with Round glasses and Mint socks. Initial ownership used Dev unlock in the isolated profile. All three were wearable in normal mode, and Chicken nugget kept its face and paws visible in the floating window after restart. [Batch 07 Windows screenshots](wardrobe-review-2026-11-24/BATCH_07.md#independent-windows-restarts).

### Fresh Windows adoption and visible bark

Two isolated Windows profiles started on the adoption form. The first showed the revised walk and temporary named welcome. The follow-up added a visible bark at the walk handoff with the same timed cue for optional sound and the pose-preserving expression. In the second profile, the fictional dog Mochi walked in, visibly barked with Sound off and Dev mode off, settled, and remained available in the transparent floating window. The temporary welcome disappeared. The GIF is assembled from native screenshot samples and does not measure exact frame timing or record audio. [Native stills](wardrobe-review-2026-11-24/windows-muted-adoption-walk.png) · [Playback sample](wardrobe-review-2026-11-24/windows-muted-adoption-walk.gif). macOS and a fresh reduced-motion adoption were outside this run.

### Busy bee floating walk with accessories

The muted Windows overlay kept Round glasses and Mint socks attached through the stepping frames. Reduced motion held the same outfit in its seated portrait. Automatic rest now resumes after the walk settles, avoiding a sudden sit when a walk crosses the idle deadline. Lowering the toy anchor by 12 CSS pixels cleared the paws in tested sit, stand and walk frames. The native board still opened and dismissed by outside click or Escape. The comparison and playback remain provisional. `npm run check` passed 457 app tests, four preview tests, and a production build. Windows Cargo check passed for the pose controller checkpoint. [Native evidence](wardrobe-review-2026-11-24/BATCH_01.md#floating-walk-with-glasses-and-socks).

### Lorax expression clearance

The Lorax curls now leave the neutral smile readable. The Windows wardrobe showed both revised poses. Muted native runtime showed happy, bark, tired, loaf, sleep, wake, loaf to sit, and walk with the refit equipped. The new art remains provisional. `npm run check` passed 457 app tests, four preview tests, and the production build. [Native comparison and clip](wardrobe-review-2026-11-24/BATCH_01.md#lorax-muzzle-refit).

The Lorax and Busy bee passed separate full process restarts in the isolated Windows profile with Dev mode off. Busy bee restored with Round glasses and Mint socks. Removing Busy bee afterward preserved its ownership and the two equipped accessories. [Windows restart evidence](wardrobe-review-2026-11-24/BATCH_01.md#windows-restart-with-dev-mode-off).

Fancy mustache and The bob also passed separate full Windows process restarts with Dev mode off and the same two accessories. Swapping the body slot or removing The bob preserved ownership and the worn accessories. All four outfits in the first batch now have individual Windows restart evidence. [Before and after screenshots](wardrobe-review-2026-11-24/batch-01-windows-restart-mustache-bob.png).

### Second wardrobe batch Windows restarts

Army hat and Flower each restored with Round glasses and Mint socks after separate full Windows app exits and relaunches with Dev mode off. Switching body items preserved Army hat ownership, and Flower also appeared in the floating window after restart. Together with Toad's earlier result, all three outfits in the second batch now have individual Windows restart evidence. [Second batch review](wardrobe-review-2026-11-24/BATCH_02.md).

### Chicken nugget floating playback

With sound off and standard motion, the Windows overlay showed Chicken nugget with Round glasses and Mint socks through seated idle, happy, bark, tired, loaf, sleep, wake to loaf, and loaf to sit. The hood and glasses stayed aligned in the sampled frames. Dev mode was switched off after the run. [Native screenshots and sampled playback](wardrobe-review-2026-11-24/BATCH_07.md#chicken-nugget-in-the-windows-floating-window).

The Windows floating walk preview kept the Chicken nugget outfit, glasses, and socks on through the sampled steps and cut back to the original sitting pose. Reduced motion skipped the walk preview and still allowed Stand up and Sit. [Native walk and reduced-motion evidence](wardrobe-review-2026-11-24/BATCH_07.md#chicken-nugget-in-the-windows-floating-window).

The seated welcome-walk preview now plays the fitted stand-to-sit frames before returning control to the resting companion. The Windows overlay showed the repaired landing with Chicken nugget, Round glasses, and Mint socks. Standing previews and the reduced-motion fallback retain their prior behavior. `npm run check` passed 461 app tests, four preview tests, and the production build with its existing chunk-size warning. [Windows walk-to-sit playback](wardrobe-review-2026-11-24/BATCH_07.md#walk-to-sit-follow-up).

### Wonder Bread and Shrimp suit floating playback

The isolated Windows overlay showed both outfits through happy, tired, loaf, sleep, wake to loaf, and loaf to sit with Round glasses and Mint socks, sound off, and standard motion. A follow-up Windows overlay run confirmed muted bark, walking with the fitted return to sitting, and both Stand and Sit with the walk suppressed under reduced motion. [Windows pose and playback evidence](wardrobe-review-2026-11-24/BATCH_07.md#wonder-bread-and-shrimp-suit-in-the-windows-floating-window).

### Iso floating playback

The muted Windows overlay showed Iso with Round glasses and Mint socks through seated expressions, bark, sleep and wake, loaf to sit, and the welcome walk with its fitted return. Reduced motion suppressed the walk and preserved Stand and Sit. [Native Iso screenshots and playback](wardrobe-review-2026-11-24/BATCH_06.md#iso-floating-playback).

### Omen and Killjoy floating playback

Both outfits passed the muted Windows floating rest, visible bark, fitted walk-to-sit and reduced-motion checks. A Killjoy frame exposed a base-image loading gap in the shared walk landing. The previous walk frame now stays visible until the new base image loads. Repeated native samples with Killjoy and Omen showed a complete sprite through the handoff. `npm run check` passed 461 app tests, four preview tests, and the build with its existing bundle-size warning. Windows Cargo check passed. [Pose comparison and playback](wardrobe-review-2026-11-24/BATCH_06.md#omen-and-killjoy-floating-playback).

