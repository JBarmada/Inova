# Inova — detailed dog animation scenarios

Saved November 23, 2026 for the artist. Read [ARTIST_GUIDE.md](ARTIST_GUIDE.md) and inspect the latest [art review index](../art/pocket-pup/README.md) before drawing. Version numbers indicate experiments, not approval.

Current checkpoint: the user approved v32 neutral → sit and v34 grounded breathing, and requested their integration into main. Next reviews proceed one clip at a time. Latest explicit rules override the older motion beats below: sitting → tired changes only the face, preserves the seated body, and should lead to loaf after seven uninterrupted seconds once that transition is approved. Sit → stand also needs its own reviewed animation. Loaf, later rest/wake clips, and personality clips remain unfinished.

## Character rules

- Preserve the exact selected [standing neutral](../art/pocket-pup/v9/fur-details.png) and [approved sitting](../art/pocket-pup/v26/sitting-idle.png) endpoints.
- Work on a transparent **64 × 64 grid**, using binary transparency and nearest-neighbor previews.
- Keep the head at its original pixel size, including the full right cheek outline.
- Neutral has the brown C14 **:3** mouth and upper-right eye highlights. Happy tongue/blush pink is **#df8b87**.
- Keep the broad neck, centered torso, continuous shoulder contours, and small tucked hind paws. No toe lines.
- Draw bending limbs; do not resize or squash the body to imply movement.
- Keep clothing, props, and reaction effects separate.

## First milestone: standing → sitting

**Scenario:** The dog has been standing quietly and decides to settle beside the user.

**Start:** Exact selected standing-neutral sprite.

**End:** Exact approved v26 sitting sprite.

**Motion beats:**

1. The dog steadies itself over its front paws.
2. Its rear legs fold beneath the body as the pelvis lowers and moves inward.
3. The torso becomes more upright while the neck continues supporting the head.
4. The dog reaches the approved sitting pose and settles. The tail follows the body with a slight delay.

**Draw one readable breakdown first:** the moment when the rear leg is tucked but the dog has not fully settled.

**Watch closely:**

- The thigh, lower leg, and torso must form a connected silhouette.
- Avoid an outlined zigzag leg, dangling stick, or large sideways hip bulge.
- Keep the chest and front-paw regions consistent with the endpoints.
- Build sufficient overlap behind the head so movement cannot reveal a neck gap.
- Preserve endpoint paws rather than moving them to simplify the transition.

**Review:** Show the three poses side by side, then slow playback and intended-speed playback. Add further frames only after the breakdown is approved.

## Rest chain: plan now, animate after that milestone

### 2. Sitting → tired sitting

**Scenario:** The seated dog gradually becomes drowsy.

**Motion beats:** Normal blink → longer blink → heavy eyelids → small head dip → relaxed tired sit.

The head may translate slightly, but its shape stays intact. Keep the seated body and planted paws stable. Suggest tiredness through the eyelids and posture rather than stretching the face.

**Ending:** A distinct tired-sitting key pose that can hold comfortably.

### 3. Tired sitting → lying awake

**Scenario:** The dog decides to lie down, but remains awake.

**Motion beats:**

1. It leans forward and places its front paws farther ahead.
2. Its elbows bend while the chest lowers between the forelegs.
3. Its rear legs fold into a comfortable resting position.
4. The belly settles; the head remains raised.

Make the forelegs visibly support the lowering body. Do not compress the sitting sprite vertically. Keep the hindquarters tucked and the tail attached naturally.

**Ending:** A readable lying-awake pose, distinct from sleeping.

### 4. Lying awake → sleeping

**Scenario:** The resting dog finally nods off.

**Motion beats:** Slow blink → eyes close → chin lowers toward the paws → gentle settling exhale.

Approve the chin-on-paws pose before adding intermediate frames. The cheek must not clip through the paws, and the neck should remain connected as the head lowers.

**Ending:** A stable sleeping pose suitable for a separate breathing loop.

### 5. Sleeping loop

**Scenario:** The dog sleeps peacefully beside the user.

Use a small chest rise and fall. An occasional ear twitch can be a separate variation.

Keep the muzzle, paws, and ground contact stable. Avoid bobbing the entire dog to represent breathing. The final frame must join the first without a jump.

Optional “Z” effects belong on a separate layer.

## Return chain

### 6. Sleeping → lying awake

An ear reacts first, followed by a small eye opening. The dog blinks and lifts its head while keeping its body down.

Use the approved sleeping and lying-awake endpoints once those have been established. Plan the lift explicitly; reversing the falling-asleep frames may not give convincing weight.

### 7. Lying → sitting → standing

Deliver two clips.

- **Lying → sitting:** front paws gather beneath the chest, forelegs push upward, and the rear legs collect under the body.
- **Sitting → standing:** the dog shifts forward, extends its back legs, and settles onto all four paws.

Keep foot placement deliberate. Avoid sliding the dog across the ground.

### 8. Post-nap stretch

From standing, the dog reaches its front paws forward, bends its elbows, and lowers its chest while keeping its rear raised. It holds briefly, then returns to standing.

The bend should come from the joints. Preserve head scale and keep the tail movement secondary.

## Personality and interaction clips

### 9. Quiet standing and sitting idles

Create separate subtle loops for both approved poses: breathing, an occasional blink, and an optional ear flick. Leave enough stillness that the companion feels calm rather than constantly demanding attention.

### 10. Noticing the user

Ears perk → eyes focus → small head tilt → interested pause → neutral.

Maintain neck overlap during the tilt. Any head rotation needs deliberate pixel cleanup rather than a blurred rotation.

### 11. Happy greeting

The expression brightens → tail starts wagging → shoulders give a small pleased wiggle → dog settles.

Keep the paws grounded unless a hop is specifically being animated. Separate sustained tail-wag looping from the one-time greeting.

### 12. Single bark

Brief preparation → chest lifts → slightly furrowed eyebrows and open mouth → small recoil → neutral.

Mark the exact bark frame for sound synchronization. Keep bark rays separate from the dog.

### 13. Receiving a treat

Notice treat → lean forward to sniff → take bite → small chewing motion → satisfied expression or tiny blep.

Keep the treat separate. Indicate when it enters the mouth or disappears so the application can synchronize the interaction.

### 14. Unlock celebration

Notice reveal → surprised pause → happy reaction → settle.

Start with a grounded wiggle; treat a hop as an optional additional animation. Export item reveal, sparkles, and dog movement separately, with timing markers for fanfare.

### 15. Trying on an accessory

Hold a clear fitting pose → accessory appears → pleased head lift or small glance → neutral.

The dog animation must work independently of the wearable. Fit accessories to each supported pose rather than assuming standing anchors also fit sitting.

## Artist deliverables and review

For each clip, provide:

- Named starting, breakdown, and ending poses.
- A side-by-side frame sheet.
- Slow inspection playback and intended-speed playback.
- Transparent PNG frames with frame order and durations.
- A GIF preview.
- Whether it plays once, loops, or connects to another clip.
- Sound/effect timing markers where relevant.

Approve poses first, then movement, then timing and secondary effects. Technical checks establish file correctness; they do not establish artistic approval.

These scenarios describe animation behavior. Automatic app triggers, wearable fitting, and native integration remain separate implementation work.
