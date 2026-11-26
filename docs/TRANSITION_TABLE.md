# Dog transition coverage and review queue

Updated November 23, 2026. This is a behavior/review ledger, not a claim that every row runs in the app. Current main contains approved v32/v34/v35 runtime work and the unapproved v36 review files (merged as `56f80c2`). Main was checked at `c4693ac` for the [continuation handoff](ANIMATION_CONTINUATION.md). **November 26, 2026: v36 tired sit to loaf approved and integrated** (seven-second deadline, cancellation, reduced motion, fitted wearables). Earlier branch references below are historical checkpoints.

**Approved/integrated: M05, sitting to tired face (v35), main `93696f3`.** Mood changes preserve posture and the approved eye-only sequence runs with grounded breathing. **Approved/integrated November 26: tired sit to loaf, v36** ([GIF](../art/pocket-pup/v36/loaf-preview.gif), [slower](../art/pocket-pup/v36/loaf-slow.gif), [frames](../art/pocket-pup/v36/loaf-frames.png)) on `feature/loaf-integration`. Next review: animated sit/loaf to stand.

## Hierarchy

1. Body posture and mood are separate axes. A mood update alone preserves posture. Sitting + tired is still sitting.
2. Explicit pose commands outrank automatic rest deadlines. Route through reviewed stable endpoints; never teleport through an unsupported pose.
3. Use posture-compatible face frames. The latest request makes seated tiredness **face-only**, without a head dip, body change, or paw movement.
4. Entering stable **sitting + tired** starts one seven-second deadline. On expiry, both guards must still hold before a reviewed loaf-entry clip can run. Implemented November 26 (deadline starts after the 2,050ms tired-face entry).
5. Cancel the deadline when mood becomes idle/happy, Stand is requested, posture leaves sitting, adoption is lost, or the controller is disposed. Duplicate tired events, rerenders, equipment, settings, and breathing must not restart it.
6. Breathing is lower priority than a posture clip. Reduced motion disables breathing and skips movement to approved stable endpoints; it does not change logical mood/posture guards.
7. One presentation owner manages posture, clip, queued command, and deadline. Shared mood/equipment remain in the existing state; no separate persisted pet record.
8. A missing/unapproved route holds the last supported stable pose and records intent. It must not silently substitute standing. The current app still has the limitations below; this is the upcoming controller contract.

## All 12 stable posture × mood combinations

| ID | Body | Requested mood | Required outcome | Status |
| --- | --- | --- | --- | --- |
| M01 | Standing | Idle | Standing neutral/breathing; idle sit timer | Live |
| M02 | Standing | Happy | Standing happy/breathing | Live static face; greeting queued |
| M03 | Standing | Tired | Standing tired; no invented automatic posture route | Live static face |
| M04 | Sitting | Idle | Stay seated, neutral face/breathing; clear loaf deadline | Live; idle recovery remains seated; cancels loaf deadline |
| M05 | Sitting | Tired | Stay seated; face-only transition; 7s deadline at stable tired state | **v35 approved/live; seven-second loaf deadline live** |
| M06 | Sitting | Happy | Stay seated; happy face; cancel loaf deadline | Posture live; neutral seated face + sparkle fallback; happy face queued |
| M07 | Loaf | Idle | Stay loaf; relaxed awake face | Endpoint live; holds approved drowsy loaf face until a relaxed face is reviewed |
| M08 | Loaf | Happy | Stay loaf; happy face; rising requires pose command | Endpoint live with drowsy face + sparkle; happy loaf face queued |
| M09 | Loaf | Tired | Stay loaf; drowsy face; no unapproved sleep timer | Live |
| M10 | Sleeping | Idle | Stay sleeping/closed face; reviewed route for waking | Queued |
| M11 | Sleeping | Happy | Stay sleeping; retain happy intent for waking, never standing-happy substitution | Queued; wake trigger to review |
| M12 | Sleeping | Tired | Stay sleeping; no duplicate sleep-entry clip | Queued |

**Resolved posture bug:** mood updates no longer reset the local pose or substitute standing artwork for seated tiredness. Mood changes during the tuck complete the approved seated endpoint first. Navigation still remounts presentation; full shared ownership and future loaf/wake routes remain pending.

## All 16 stable body routes

Only entries marked live exist in the app. Historical draft art does not count as an approved route.

| From / target | Standing | Sitting | Loaf | Sleeping |
| --- | --- | --- | --- | --- |
| Standing | Hold/breathe (live) | Approved tuck → sit (live) | Sit → loaf | Sit → loaf → sleep |
| Sitting | **Dedicated rise/back-leg extension; queued** | Hold/breathe (live) | **7s tired guard → loaf entry; live (v36)** | Loaf → sleep |
| Loaf | Push up → sit → stand (direct switch for now) | Push up → sit | Hold (breathing queued) | Chin lowers → sleep |
| Sleeping | Wake → loaf → sit → stand | Wake → loaf → sit | Wake → loaf | Hold/sleep breathing |

## Triggers, interruptions, and recovery

| Case | Required outcome | Status |
| --- | --- | --- |
| Adopted standing idle for 8s | Approved neutral → tuck → sit | Live |
| Not adopted | No rest deadlines/automatic pose clips | Current sit path live |
| Sit while already seated | No duplicate clip; keep mood/posture | Live |
| Stand while already standing | No duplicate stand-up | Live no-op; stand-up clip queued |
| Tired sitting reaches 7s | Loaf entry once, only if still seated+tired | Live; tested at 6999/7000ms |
| Happy/idle arrives before 7s | Cancel deadline; change face in place | Live |
| Stand arrives before 7s | Cancel deadline; reviewed stand-up; retain mood | Cancel live; stand-up clip pending review |
| Repeated tired event/rerender | Preserve original deadline; no stacked timers | Live |
| Mood during tuck/rise/lower | Retain latest mood; apply compatible face at stable boundary | Live for tuck and loaf entry; future clips pending |
| Pose command during clip | Coalesce to latest intent; finish safe boundary, then route | Proposed; validate with clip |
| Posture clip during inhale | Stop loop; use canonical clip frames without scaling | Current tuck live; future clips pending |
| Face clip during breathing | Preserve posture/ground contact and compatible breath phase | Live for seated face variants |
| Equip/remove | Preserve pose/mood/deadline; use fitted layers | Sitting and loaf layers live; socks hidden while paws are tucked |
| Unfitted item on planned pose | Review fit/fallback before enabling clip; keep inventory/equipment record | Review gate |
| Mute/status/dev changes | Preserve pose/deadlines; visible action feedback | Settings live; loaf deadline unaffected by mute/status/dev toggles |
| Reduced motion changes | Stop loops; approved stable endpoint; same mood/guards | Breathing/tuck/loaf clip live (mid-clip jumps to endpoint); a pending loaf deadline keeps its original length when toggled |
| Navigate companion ↔ wardrobe/memories | Shared presentation owner retains posture | Current remount resets presentation; pending |
| Float/home, resize, drag, focus change | No invented posture or restarted deadline | Hierarchy/native verification pending |
| Hidden tab/app resumes | Re-evaluate deadline and current guards; no stale clip replay | Timing policy to validate |
| Reload/restart | Load saved mood/equipment; supported initial pose; no old timeout | Current initial pose standing |
| Unmount/dispose | Cancel clip/loop/deadline callbacks | Tested including loaf deadline and clip |
| Asset fails | Supported/fallback visual and visible error; no missing-frame playback | Current error path; extend per clip |
| Direct interaction while drowsy | Intentional feedback; exact reset-vs-wake policy needs review | Open decision |
| Any unlisted/invalid state-event pair | Last supported stable pose; no automatic standing substitution | Required upcoming safe default |

## One-at-a-time production queue

Review pose → motion → timing → integrate → validate, then advance. One clip is in active visual review. A design reference is not approval.

| Priority | Brief scenario | Deliverable | Art/app status |
| --- | --- | --- | --- |
| Done | 1 | Neutral → sit, v32 | Approved, main |
| Done / partial | 9 | Standing/happy/sitting grounded breathing, v34 | Approved, main; optional blink/ear variations not delivered |
| Done | 2 / M05 | Seated blink → drowsy → tired, face only | v35 approved and integrated |
| Done | 3 | Tired sit → loaf endpoint/entry; trigger after 7s | v36 approved and integrated November 26 |
| **1** | 7b, explicit request | Sit → stand, weight shift/back-leg extension | v37 GIF awaiting review (`art/pocket-pup/v37`); not integrated |
| 4 | M06 | Seated happy and tired → neutral/happy recovery | Queued |
| Later | 4 | Loaf/lying awake → sleeping, chin toward paws | Queued |
| Later | 5 | Grounded sleeping breathing | Queued |
| Later | 6 | Sleeping → awake loaf | Queued |
| Later | 7a | Loaf → sitting push-up | Queued |
| Later | 8 | Post-nap stretch and return | Queued |
| Later | 9 remainder | Quiet blink/optional ear variation per posture | Queued |
| Later | 10 | Notice user / interested tilt | Queued |
| Later | 11 | Greeting / separate sustained tail wag | Queued |
| Later | 12 | Single bark / sound marker | Queued |
| Later | 13 | Treat sniff/bite/chew/blep / separate prop | Queued |
| Later | 14 | Unlock reaction / separate reveal, sparkle, fanfare | Queued |
| Later | 15 | Accessory fitting reaction / pose anchors | Queued |

Loaf is the latest requested low resting mode. Show its exact endpoint first; older lying-awake experiments are not automatically accepted as loaf.

## Coverage tests to add as routes are implemented

Parameterize M01–M12, the 16 body routes, and interruption cases. Assert body and face independently, plus active clip, deadline owner, planted paws, and reduced-motion endpoint. Include 6999ms/7000ms, cancellation at 6999ms, duplicate tired updates, stale clip completion, navigation, equipment, and settings. Queued rows are missing implementation, not fabricated passing tests.
