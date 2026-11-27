import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { CostumeArt } from './CostumeArt';
import { costumeIds } from '../../shared/costumes';
import { fittedFrames } from './poseFrames';
import { WearableLayers } from './WearableLayers';

it('registers every layered catalog costume for poses, expressions and transitions', () => {
  const frames = ['standing', 'happy', 'tired', 'sitting', 'sitting-happy', 'sitting-tired', ...fittedFrames,
    'loaf-bend', 'loaf-tuck', 'loaf-idle', 'sleeping', 'wake-ear', 'wake-eyes'] as const;
  for (const id of costumeIds.filter((id) => id !== 'bee')) {
    for (const frame of frames) {
      const html = renderToStaticMarkup(<svg><CostumeArt id={id} frame={frame} /></svg>);
      expect(html).toContain(`data-costume="${id}"`);
      expect(html).not.toContain('<image');
      expect(html).toMatch(/<(?:path|rect)/);
    }
  }
});
it('does not draw an unknown costume', () => {
  expect(renderToStaticMarkup(<svg><CostumeArt id="unknown" frame="standing" /></svg>)).toBe('<svg></svg>');
});

it.each(['killjoy', 'harry-potter'] as const)('uses equipped glasses instead of stacking them over %s eyewear', (body) => {
  const equipment = { body, hat: null, socks: null, glasses: null };
  const alone = renderToStaticMarkup(<WearableLayers equipment={equipment} frame="sitting" />);
  const paired = renderToStaticMarkup(<WearableLayers equipment={{ ...equipment, glasses: 'round-glasses' }} frame="sitting" />);
  expect(alone).toContain('data-costume-glasses=');
  expect(paired).not.toContain('data-costume-glasses=');
  expect(paired).toContain('data-item="round-glasses"');
  expect(paired).toContain(`data-costume="${body}"`);
});
