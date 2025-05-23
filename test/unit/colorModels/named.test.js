import { expect, test } from '@jest/globals';
import { rgb2named, namedColor, named2rgb } from '../../../dist/index.js';


test('Named', () => {
  for (const [name, rgb] of namedColor) {
    const retName = rgb2named(rgb);
    expect(retName).toBe(name);

    const retRgb = named2rgb(name);
    for (let i = 0; i < rgb.length; i++) {
      expect(retRgb[i]).toBeCloseTo(rgb[i]);
    }
  }
  expect(named2rgb('not a name')).toEqual([0, 0, 0]);
});
