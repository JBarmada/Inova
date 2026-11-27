import { afterEach, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { initialState } from '../../state/defaults';
import { startWelcomeWalk, WELCOME_WALK_FRAME_MS, welcomeWalkFits } from './welcomeWalk';
import { WelcomeWalkFrame } from './WelcomeWalkFrame';
import { WelcomeWalkReview } from './WelcomeWalkReview';
import { AnimatedWelcomeWalk } from './AnimatedWelcomeWalk';
import { loadWelcomeWalkAtlas, walkAtlasIsVisible } from './welcomeWalkAtlas';
import { fittedFrames, fittedFrameMs } from './poseFrames';
import { motionIsReduced } from '../../shared/useReducedMotion';

vi.mock('../../shared/useReducedMotion', async (importOriginal) => ({
  ...await importOriginal<typeof import('../../shared/useReducedMotion')>(),
  useReducedMotion: (user: boolean) => user,
}));

afterEach(() => vi.useRealTimers());

it('advances through every original frame once at the original 150ms timing', () => {
  vi.useFakeTimers();
  const show = vi.fn();
  const stop = startWelcomeWalk(show);
  expect(show.mock.calls).toEqual([[0]]);
  vi.advanceTimersByTime(WELCOME_WALK_FRAME_MS * 7);
  expect(show.mock.calls).toEqual(welcomeWalkFits.map((_, frame) => [frame]));
  vi.advanceTimersByTime(1000);
  expect(show).toHaveBeenCalledTimes(8);
  stop();
});

it('cancels scheduled frames when the walk is interrupted', () => {
  vi.useFakeTimers();
  const show = vi.fn(), complete = vi.fn();
  const stop = startWelcomeWalk(show, complete);
  stop();
  vi.advanceTimersByTime(1200);
  expect(show).toHaveBeenCalledTimes(1);
  expect(complete).not.toHaveBeenCalled();
});

it('signals completion only after the final frame has displayed for its full duration', () => {
  vi.useFakeTimers();
  const show = vi.fn(), complete = vi.fn();
  startWelcomeWalk(show, complete);
  vi.advanceTimersByTime(1199);
  expect(show).toHaveBeenCalledTimes(8);
  expect(complete).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(complete).toHaveBeenCalledTimes(1);
});

it('settles through the fitted poses after the walk before restoring sitting', () => {
  vi.useFakeTimers();
  const show = vi.fn(), complete = vi.fn(), settle = vi.fn();
  startWelcomeWalk(show, complete, settle);
  const walkDuration = WELCOME_WALK_FRAME_MS * welcomeWalkFits.length;
  const settleDuration = fittedFrameMs.reduce<number>((total, ms) => total + ms, 0);

  vi.advanceTimersByTime(walkDuration - 1);
  expect(settle).not.toHaveBeenCalled();
  vi.advanceTimersByTime(settleDuration);
  expect(settle.mock.calls).toEqual(fittedFrames.map((pose) => [pose]));
  expect(complete).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(complete).toHaveBeenCalledOnce();
});

it('cancels the seated return when the preview is interrupted', () => {
  vi.useFakeTimers();
  const show = vi.fn(), complete = vi.fn(), settle = vi.fn();
  const stop = startWelcomeWalk(show, complete, settle);
  vi.advanceTimersByTime(WELCOME_WALK_FRAME_MS * welcomeWalkFits.length);
  expect(settle).toHaveBeenCalledExactlyOnceWith(fittedFrames[0]);

  stop();
  vi.runAllTimers();
  expect(settle).toHaveBeenCalledTimes(1);
  expect(complete).not.toHaveBeenCalled();
});

it('renders the selected frame and per-frame socks placement in the same view', () => {
  const state = initialState();
  state.equipment.socks = 'mint-socks';
  const first = renderToStaticMarkup(<WelcomeWalkFrame state={state} index={0} />);
  const fourth = renderToStaticMarkup(<WelcomeWalkFrame state={state} index={3} />);
  expect(first).toContain('dog-walk-registered');
  expect(fourth).toContain('dog-walk-registered');
  expect(first).toContain('background-position:0% 0%');
  expect(fourth).toContain('background-position:42.857142857142854% 0%');
  expect(first).toContain('data-item="mint-socks"');
  expect(fourth).toContain('data-item="mint-socks"');
  expect(first).not.toEqual(fourth);
});

it('steps with the standing bee portrait and returns its paws to their original positions', () => {
  const state = initialState();
  state.equipment.body = 'bee';
  state.equipment.socks = 'mint-socks';
  const html = renderToStaticMarkup(<WelcomeWalkFrame state={state} index={2} />);
  expect(html).toContain('data-costume-pose="standing"');
  expect(html).toContain('bee-approved-standing.png');
  expect(html).toContain('data-walk-frame="2"');
  expect(html).toContain('walking, wearing Mint socks, Busy bee');
  expect(html).toContain('data-paw-lift="42"');
  expect(html).toContain('data-paw-lift="0"');
  expect(renderToStaticMarkup(<WelcomeWalkFrame state={state} index={7} />)).not.toContain('data-paw-lift');
  expect(html).not.toContain('dog-clip-layer');
});

it('provides an accessible replay control and disables it for reduced motion', () => {
  const state = initialState();
  const enabled = renderToStaticMarkup(<WelcomeWalkReview state={state} />);
  expect(enabled).toContain('>Play or replay walk</button>');
  expect(enabled).not.toContain('disabled=""');
  state.settings.reduceMotion = true;
  const reduced = renderToStaticMarkup(<WelcomeWalkReview state={state} />);
  expect(reduced).toContain('<button type="button" disabled="">Play or replay walk</button>');
  expect(reduced).toContain('Walk playback is disabled while reduced motion is enabled.');
});

it('keeps the dressed dog visible while the atlas is loading or motion is reduced', () => {
  const state = initialState();
  state.equipment.body = 'bee';
  const loading = renderToStaticMarkup(<AnimatedWelcomeWalk state={state} pose="standing" />);
  expect(loading).not.toContain('data-walk-frame');
  expect(loading).toContain('bee-approved-standing.png');
  state.settings.reduceMotion = true;
  const reduced = renderToStaticMarkup(<AnimatedWelcomeWalk state={state} pose="sitting" />);
  expect(reduced).not.toContain('data-walk-frame');
  expect(reduced).toContain('data-pose="sitting"');
  expect(reduced).toContain('bee-sitting.png');
});

it('uses the atlas only after a successful load and when motion is enabled', () => {
  expect(walkAtlasIsVisible('loading', false)).toBe(false);
  expect(walkAtlasIsVisible('error', false)).toBe(false);
  expect(walkAtlasIsVisible('ready', true)).toBe(false);
  expect(walkAtlasIsVisible('ready', false)).toBe(true);
  expect(walkAtlasIsVisible('ready', motionIsReduced(true, false))).toBe(false);
});

it.each(['load', 'error'] as const)('reports atlas %s and cancels callbacks on cleanup', (event) => {
  const image = { onload: null, onerror: null, src: '' } as unknown as HTMLImageElement;
  const complete = vi.fn();
  const stop = loadWelcomeWalkAtlas(complete, () => image);
  expect(image.src).toBe('/dog/walk-standing-atlas.png');
  const callback = event === 'load' ? image.onload : image.onerror;
  expect(callback).not.toBeNull();
  callback?.call(image, new Event(event));
  expect(complete).toHaveBeenCalledWith(event === 'load' ? 'ready' : 'error');
  stop();
  expect(image.onload).toBeNull();
  expect(image.onerror).toBeNull();
});

it('falls back when atlas loading stalls and ignores a late success', () => {
  vi.useFakeTimers();
  const image = { onload: null, onerror: null, src: '' } as unknown as HTMLImageElement;
  const complete = vi.fn();
  const stop = loadWelcomeWalkAtlas(complete, () => image);
  vi.advanceTimersByTime(3000);
  expect(complete).toHaveBeenCalledOnce();
  expect(complete).toHaveBeenCalledWith('error');
  image.onload?.call(image, new Event('load'));
  expect(complete).toHaveBeenCalledOnce();
  stop();
});

it('ignores a pending atlas load and timeout after the walk is unmounted', () => {
  vi.useFakeTimers();
  const image = { onload: null, onerror: null, src: '' } as unknown as HTMLImageElement;
  const complete = vi.fn();
  const stop = loadWelcomeWalkAtlas(complete, () => image);
  const lateLoad = image.onload;
  stop();
  lateLoad?.call(image, new Event('load'));
  vi.advanceTimersByTime(3000);
  expect(complete).not.toHaveBeenCalled();
});

it('draws Ahri tails behind the walking dog and the robe in front', () => {
  const state = initialState();
  state.equipment.body = 'ahri';
  const html = renderToStaticMarkup(<WelcomeWalkFrame state={state} index={2} />);
  const rear = html.indexOf('data-rear-costume="ahri"');
  const dog = html.indexOf('dog-clip-layer');
  const robe = html.indexOf('data-fitted-face="ahri"');
  expect(rear).toBeGreaterThanOrEqual(0);
  expect(dog).toBeGreaterThan(rear);
  expect(robe).toBeGreaterThan(dog);
});
