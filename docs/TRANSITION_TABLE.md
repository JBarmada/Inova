# Pocket Pup transition coverage

Updated November 23, 2026. **Future animation workers should start with the [To Be Reviewed Animations index](../art/pocket-pup/to-be-reviewed-animations/README.md).** The index links each GIF, slow preview, native frame sheet, and timing record. Every production-queue row has an artifact. Review status and app support are recorded separately below.

## Playback rules

1. Mood and posture are independent. Happy and Tired have distinct sitting and loaf faces. A mood change alone preserves posture.
2. Standing idle sits after eight seconds. Tired sitting blinks immediately, completes the eye-only sequence, then holds the tired face for seven seconds before v36 lowering begins. A mood change or Stand command before the deadline cancels it. Duplicate mood updates, equipment, and settings do not restart it.
3. Stand from loaf untucks and passes through sitting, then plays the fitted raise.
4. Grounded standing and seated idles use the v34 lift. Standing tired, loaf, and moving frames use smaller chest shading with fixed face and paw pixels. Sleep uses its approved slower breath rhythm. Reduced motion displays canonical poses and retains the rest delay.
5. After twelve seconds of uninterrupted tired loaf, the dog closes its eyes and settles to sleep. Happy or the Dev mode Wake up command returns it to loaf. Sleep starts its own breathing cadence. Standing after a nap plays the stretch.
6. Posture stays transient. Mood and worn equipment stay in the shared save. The developer animation player contains every approved clip, including interaction art without a gameplay trigger.

## All 12 stable posture × mood combinations

| ID | Body | Mood | Outcome | Status |
| --- | --- | --- | --- | --- |
| M01 | Standing | Idle | Neutral breathing, idle sit deadline | Live |
| M02 | Standing | Happy | Happy breathing and greeting | Live |
| M03 | Standing | Tired | Tired breathing, stays standing | Live |
| M04 | Sitting | Idle | Neutral breathing, clears loaf deadline | Live |
| M05 | Sitting | Tired | Eye-only entry, tired breathing, seven-second stable hold, then loaf | Live |
| M06 | Sitting | Happy | Recovery blink into blush and Happy :D, grounded breathing, clears loaf deadline | Live |
| M07 | Loaf | Idle | Open neutral face and breathing | Live |
| M08 | Loaf | Happy | Happy face and breathing, remains down | Live |
| M09 | Loaf | Tired | Heavy eyelids and breathing | Live |
| M10 | Sleeping | Idle | Eyes closed, sleeping breathing | Live |
| M11 | Sleeping | Happy | Wake through loaf, retain happy intent | Live |
| M12 | Sleeping | Tired | Keep sleeping, no repeated sleep entry | Live |

## All 16 stable body routes

The developer player can show each individual clip. Normal posture transitions follow the routes below.

| From / target | Standing | Sitting | Loaf | Sleeping |
| --- | --- | --- | --- | --- |
| Standing | Hold and breathe | Fitted sit | Sit → loaf when tired after sitting | Sit → loaf → sleep when tired after sitting |
| Sitting | Fitted rise | Hold and breathe | Seven-second tired hold → lower | Loaf → sleep |
| Loaf | Untuck → sit → rise | Loaf-to-sit playback in Dev mode | Hold and breathe | Twelve-second tired hold → chin lowers |
| Sleeping | Wake, then Stand up from loaf | Wake, then loaf-to-sit preview is available | Wake on Happy or Dev mode Wake up | Sleeping breath loop |

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
| Hidden or resumed app | Presentation catches up while mounted. Native focus/resume behavior remains a platform check |

## Production queue

The [review index](../art/pocket-pup/to-be-reviewed-animations/README.md) has the approved source frames. Every row is playable in the Dev mode animation player.

| Brief | Deliverable | Coverage |
| --- | --- | --- |
| 1 | Standing → sit | Fitted runtime clip and review reference |
| 2 | Seated blink → drowsy → tired | Runtime eye-only sequence and review reference |
| 3 | Tired sit → loaf | v36 runtime clip and review GIF with seven seconds of tired breathing |
| 4 | Loaf → sleep | Live when tired |
| 5 | Sleeping breathing | Live |
| 6 | Wake → loaf | Live |
| 7a | Loaf → sit | Stand recovery and Dev mode |
| 7b | Sit → stand | Fitted reverse runtime clip and review reference |
| 8 | Post-nap stretch | Plays after rising following sleep |
| 9 | Quiet standing/sitting idle | Live breathing and blink |
| 10 | Notice user | Dev mode player |
| 11 | Happy greeting and sustained tail wag | Standing greeting live; standalone wag in Dev mode |
| 12 | Single bark | Dev mode player, synthesized bark and separate rays |
| 13 | Treat | Dev mode player, separate treat layer |
| 14 | Unlock reaction | Standing quest reward and Dev mode |
| 15 | Accessory fitting | Seated wardrobe preview on successful equip and Dev mode |
| M06 | Seated happy and tired recovery | Live face recovery |
| M07–M12 | Low posture moods | Live loaf moods and shared sleeping pose |

## Verification when advancing a draft

Check native pixels and normal-speed motion first. Fit all wardrobe slots to its frames, prove reduced-motion behavior, and add timing/cancellation and recovery coverage before enabling a new route. Ask for separate Windows and Mac runtime results.
