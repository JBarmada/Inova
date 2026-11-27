import { expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { initialState } from '../../state/defaults';
import { CompanionWalkStage } from './CompanionWalkStage';

vi.mock('./DogSprite', () => ({ DogSprite: () => <span data-normal-dog="true" /> }));
vi.mock('./AnimatedWelcomeWalk', () => ({ AnimatedWelcomeWalk: () => <span data-bee-walk="true" /> }));

it.each([
  ['bee', false], ['bee', true], ['bob', false], ['mustache', true], ['lorax', true],
  ['army-hat', false], ['flower', true], ['toad', true],
  ['farquaad', true], ['harry-potter', false], ['clown', true],
  ['bathrobe', true], ['spa', false], ['usc-hoodie', true],
  ['pikachu', true], ['mort', false], ['shrek', true],
  ['iso', true], ['omen', false], ['killjoy', true],
  ['shrimp', true], ['wonder-bread', false], ['chicken-nugget', true],
  ['christmas-present', true], ['maple-leaf', false], ['turkey', true],
  ['bush', true], ['bibble', false], ['fungus', true],
  ['soju', true], ['white-house', false], ['elmo', true],
  ['trojan', true], ['ahri', false], ['teemo', true],
  ['britney', true], ['goth', false], ['egirl', true],
] as const)('uses the synchronized renderer for %s (floating=%s)', (costume, floating) => {
  const state = initialState();
  state.equipment.body = costume; state.equipment.socks = 'mint-socks';
  const html = renderToStaticMarkup(<CompanionWalkStage state={state} pose="standing" clip={null} walking walkKey={1}
    walkReady floating={floating} onWalkStart={vi.fn()} onWalkComplete={vi.fn()} />);
  expect(html).toContain('data-bee-walk="true"');
  expect(html).toContain('<div class="walk-entrance-layer"><span data-bee-walk="true"></span></div>');
  expect(html).not.toContain('welcome-walking');
  expect(html).not.toContain('welcome-walk.gif');
  expect(html).toContain('welcome-entrance');
  if (floating) {
    expect(html).toContain('data-tauri-drag-region="true"');
    expect(html).toContain('aria-label="Your dog. Focus to reveal companion controls."');
  } else expect(html).not.toContain('data-tauri-drag-region');
});

it('uses the same walk for the bare dog and waits for artwork before sliding in', () => {
  const state = initialState();
  const props = { state, pose: 'standing' as const, clip: null, walking: true, walkKey: 1,
    walkReady: false, floating: false, onWalkStart: vi.fn(), onWalkComplete: vi.fn() };
  const other = renderToStaticMarkup(<CompanionWalkStage {...props} />);
  expect(other).toContain('data-bee-walk="true"');
  expect(other).not.toContain('welcome-entrance');
  state.equipment.body = 'bee';
  const loading = renderToStaticMarkup(<CompanionWalkStage {...props} />);
  expect(loading).toContain('data-bee-walk="true"');
  expect(loading).not.toContain('welcome-entrance');
  state.settings.reduceMotion = true;
  expect(renderToStaticMarkup(<CompanionWalkStage {...props} walkReady />)).not.toContain('welcome-entrance');
});

it.each([
  ['raincoat', 'cap'], ['notebook', null], [null, 'beanie'], ['goth', 'cap'],
] as const)('uses the shared walk for %s with %s', (body, hat) => {
  const state = initialState();
  state.equipment.body = body;
  state.equipment.hat = hat;
  const html = renderToStaticMarkup(<CompanionWalkStage state={state} pose="standing" clip={null} walking walkKey={1}
    walkReady floating={false} onWalkStart={vi.fn()} onWalkComplete={vi.fn()} />);
  expect(html).toContain('data-bee-walk="true"');
  expect(html).not.toContain('welcome-walk.gif');
});
