# Pocket Pup transition coverage

Updated November 23, 2026. **Future animation workers should start with the [To Be Reviewed Animations index](../art/pocket-pup/to-be-reviewed-animations/README.md).** The index links each GIF, slow preview, native frame sheet, and timing record. Every production-queue row has an artifact. Review status and app support are recorded separately below.

## Playback rules

1. Mood and posture are independent. Happy and Tired have distinct sitting and loaf faces. A mood change alone preserves posture.
2. Standing idle sits after eight seconds. Tired sitting blinks immediately, completes the eye-only sequence, then holds the tired face for seven seconds before v36 lowering begins. A mood change or Stand command before the deadline cancels it. Duplicate mood updates, equipment, and settings do not restart it.
3. Stand from loaf reverses the two lowering frames, passes through sitting, then plays the fitted raise. This is the current runtime recovery. The dedicated wake and push-up study remains in review.
4. Breathing stays on one clock across supported live faces and clips. Grounded standing and seated idles use the v34 lift. Standing tired, loaf, and moving frames use smaller chest shading with fixed face and paw pixels. Reduced motion displays canonical frames and skips movement while retaining the rest delay.
5. Posture is transient presentation state. Preserved mood and worn equipment stay in the shared save. Sleep and personality draft files are available for review outside the app.

## All 12 stable posture × mood combinations

| ID | Body | Mood | Outcome | Status |
| --- | --- | --- | --- | --- |
| M01 | Standing | Idle | Neutral breathing, idle sit deadline | Live |
| M02 | Standing | Happy | Happy breathing | Live; greeting draft |
| M03 | Standing | Tired | Tired breathing, stays standing | Live |
| M04 | Sitting | Idle | Neutral breathing, clears loaf deadline | Live |
| M05 | Sitting | Tired | Eye-only entry, tired breathing, seven-second stable hold, then loaf | Live |
| M06 | Sitting | Happy | Blush and Happy :D, grounded breathing, clears loaf deadline | Live; eased recovery draft |
| M07 | Loaf | Idle | Open neutral face and breathing | Live |
| M08 | Loaf | Happy | Happy face and breathing, remains down | Live |
| M09 | Loaf | Tired | Heavy eyelids and breathing | Live |
| M10 | Sleeping | Idle | Eyes closed, sleeping breathing | Draft |
| M11 | Sleeping | Happy | Same sleeping art, retain happy intent for wake | Draft; wake trigger open |
| M12 | Sleeping | Tired | Same sleeping art, no repeated sleep-entry clip | Draft |

## All 16 stable body routes

Cells marked live are implemented. Draft routes compose the named clips in the review index.

| From / target | Standing | Sitting | Loaf | Sleeping |
| --- | --- | --- | --- | --- |
| Standing | Hold/breathe live | Fitted sit live | Sit → loaf live when tired after a sit | Sit → loaf → sleep draft |
| Sitting | Fitted rise live | Hold/breathe live | Seven-second tired hold → lower live | Loaf → sleep draft |
| Loaf | Untuck → sit → rise live | Push-up draft as a standalone destination | Hold/breathe live | Chin lowers draft |
| Sleeping | Wake → loaf → sit → stand draft | Wake → loaf → sit draft | Wake draft | Sleep breathing draft |

## Triggers, interruptions, and recovery

| Case | Behavior / next check |
| --- | --- |
| Unadopted | Presentation deadlines start only after adoption |
| Duplicate Sit, Stand, or tired request | Stable/transition guards prevent restarts and duplicate timers |
| Idle or Happy arrives before the deadline | Cancels pending lowering and selects the seated face |
| Stand arrives before the deadline | Cancels pending lowering and executes fitted rise |
| Mood changes mid-clip | Preserve body clip and use the latest posture-compatible mood at the destination |
| Reduced motion becomes active | Jump to destination, display canonical frame, honor current rest delay |
| Equip/remove, mute, status, or Dev mode changes | Keep presentation state. Verify visual fit on both platforms. Tucked paws hide socks while their slot stays equipped |
| Navigate away or reload | Companion can remount and start standing with saved mood/equipment. Old callbacks cancel |
| Float/home, resize, drag, focus changes | Verify native behavior separately. Moving between layouts can remount presentation |
| Asset failure | Existing placeholder/error path; verify recovery if replacing assets |
| Hidden or resumed app, direct interaction while drowsy | Timing/wake policy remains open |

## Production queue

The [review index](../art/pocket-pup/to-be-reviewed-animations/README.md) contains all of these clips with native frames and timing. A draft is ready for review; it still needs visual approval before integration.

| Brief | Deliverable | Coverage |
| --- | --- | --- |
| 1 | Standing → sit | Fitted runtime clip and review reference |
| 2 | Seated blink → drowsy → tired | Runtime eye-only sequence and review reference |
| 3 | Tired sit → loaf | v36 runtime clip and review GIF with seven seconds of tired breathing |
| 4 | Loaf → sleep | Draft |
| 5 | Sleeping breathing | Draft |
| 6 | Wake → loaf | Draft |
| 7a | Loaf → sit | Draft standalone clip; untuck also used in live Stand recovery |
| 7b | Sit → stand | Fitted reverse runtime clip and review reference |
| 8 | Post-nap stretch | Draft |
| 9 | Quiet standing/sitting idle | Runtime breathing; optional blink drafts for both poses |
| 10 | Notice user | Draft |
| 11 | Happy greeting and sustained tail wag | Two drafts |
| 12 | Single bark | Draft, bark marker |
| 13 | Treat | Draft, offer and hide markers |
| 14 | Unlock reaction | Draft, reveal/fanfare/sparkle markers |
| 15 | Accessory fitting | Draft, wearable attachment marker |
| M06 | Seated happy and tired recovery | Runtime face switch; eased recovery draft |
| M07–M12 | Low posture moods | Loaf moods live; sleeping shares one eyes-closed art set in review |

## Verification when advancing a draft

Check native pixels and normal-speed motion first. Fit all wardrobe slots to its frames, prove reduced-motion behavior, and add timing/cancellation and recovery coverage before enabling a new route. Ask for separate Windows and Mac runtime results.
