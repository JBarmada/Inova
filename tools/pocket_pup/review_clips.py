"""Ordered poses and timings for the artist's transition table."""
from .chest_motion import chest_phases
from .review_poses import bark_face, expression, face_detail, lower_loaf, raise_back_ear, relaxed_mouth, stretch_pose, tilt_head, wag


def rest_clips(read):
    stand, sit = read("neutral"), read("sitting")
    head = read("v23/head-source-pixels")
    tired, blink, drowsy, smile = (read(f"sitting-{mood}") for mood in ("tired", "blink", "drowsy", "happy"))
    fitted = [read(f"fitted/sit-{i:02}") for i in range(2, 8)]
    loaf = read("loaf-idle")
    brownout = expression(loaf, "drowsy", 7)
    closed_head = relaxed_mouth(expression(head, "blink"))
    doze, sleep = (lower_loaf(loaf, closed_head, shift) for shift in (8, 9))
    asleep = chest_phases(sleep, (24, 49, 33, 50))
    awake_ear = raise_back_ear(head)
    cue = lower_loaf(loaf, relaxed_mouth(expression(awake_ear, "blink")), 9)
    open_eyes = lower_loaf(loaf, expression(awake_ear, "drowsy"), 8)
    bend, tuck = read("loaf-bend"), read("loaf-tuck")
    fit_timing = [130, 120, 120, 140, 150, 180]
    yield "01-stand-to-sit", [stand, *fitted, sit], [750, *fit_timing, 950], {}
    yield "02-seated-tired", [sit, blink, sit, drowsy, blink, tired], [400, 100, 350, 450, 250, 1000], {}
    tired_hold = [read(f"breathing/sitting-tired-{phase}") for phase in (0, 1, 2, 3, 0, 1, 2, 3, 0, 1)]
    yield "03-tired-to-loaf", [*tired_hold, bend, tuck, read("loaf-tired")], [
        800, 450, 650, 900, 800, 450, 650, 900, 800, 600, 220, 220, 1100], {"lower": 7000}
    yield "04-loaf-to-sleep", [loaf, brownout, doze, sleep], [800, 450, 240, 1200], {}
    yield "05-sleep-breathing", asleep, [1100, 500, 800, 1000], {}
    yield "06-wake-to-loaf", [sleep, cue, open_eyes, brownout, loaf], [650, 150, 240, 250, 1050], {}
    yield "07a-loaf-to-sit", [read("loaf-tired"), tuck, bend, tired, blink, sit], [700, 170, 220, 220, 100, 900], {}
    yield "07b-sit-to-stand", [sit, *reversed(fitted), stand], [900, *reversed(fit_timing), 750], {}
    shallow, deep = (stretch_pose(stand, head, depth) for depth in (0, 2))
    yield "08-post-nap-stretch", [stand, shallow, deep, shallow, stand], [500, 180, 900, 220, 800], {}
    yield "m06-seated-happy-and-recovery", [tired, drowsy, blink, sit, smile, sit], [650, 140, 100, 330, 850, 700], {}
    # Sleep keeps closed eyes in every mood. This GIF shows one shared sleep endpoint.
    yield "m07-m12-low-posture-moods", [loaf, read("loaf-happy"), read("loaf-tired"), sleep, asleep[2]], [
        900, 900, 900, 900, 900], {}


def idle_clips(read):
    for name, offset in (("neutral", 0), ("sitting", -3)):
        breath = [read(f"breathing/{name}-{i}") for i in range(4)]
        blink = expression(breath[0], "blink", offset)
        prefix = "standing" if name == "neutral" else "sitting"
        yield f"09-{prefix}-idle", [*breath, breath[0], blink, breath[0]], [800, 450, 650, 900, 800, 100, 800], {}


def interaction_clips(read):
    stand, happy = read("neutral"), read("happy")
    head = read("v23/head-source-pixels")
    ear, tilt = raise_back_ear(stand), tilt_head(stand, head)
    yield "10-notice-user", [stand, ear, tilt, ear, stand], [500, 120, 650, 140, 600], {}
    up, down = wag(happy, -1), wag(happy, 1)
    yield "11a-happy-greeting", [stand, happy, up, happy, down, happy, stand], [500, 170, 150, 150, 150, 270, 650], {}
    yield "11b-tail-wag-loop", [happy, up, happy, down], [180, 170, 180, 170], {}
    ready, bark = (bark_face(stand, opening) for opening in (False, True))
    yield "12-single-bark", [stand, ready, bark, ready, stand], [450, 190, 130, 180, 700], {"bark": 640}
    sniff = face_detail(ear, read("v14/tiny-peek"), (13, 33, 27, 40))
    bite = face_detail(stand, happy, (13, 33, 27, 40))
    chew = face_detail(stand, read("v14/soft-dog-smile"), (13, 33, 27, 40))
    blep = read("v14/tiny-peek")
    yield "13-receive-treat", [stand, ear, sniff, bite, chew, bite, blep, stand], [
        400, 180, 220, 140, 180, 130, 520, 750], {"offer_treat": 400, "hide_treat": 800}
    yield "14-unlock-celebration", [stand, ear, tilt, up, down, happy, stand], [450, 100, 210, 150, 170, 500, 700], {
        "reveal": 450, "fanfare": 760, "sparkle": 760}
    sit = read("sitting")
    yield "15-accessory-fitting", [sit, read("sitting-blink"), read("sitting-happy"),
        read("breathing/sitting-happy-2"), sit], [600, 140, 400, 500, 700], {"attach_wearable": 740}
