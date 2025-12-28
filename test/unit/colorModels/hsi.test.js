import { expect, test } from '@jest/globals';

import { rgb2hsi, hsi2rgb } from '../../../dist/index.js';
import { SampleGenerator } from '../../../test-utils/sample.js';


const { rgbs } = SampleGenerator.a();

test('HSI - stability', () => {
  for (const rgb of rgbs) {
    const ret = hsi2rgb(rgb2hsi(rgb));
    expect(ret).toHaveLength(4);
    expect(ret[3]).toBe(rgb[3]);
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});

test('HSI - negative hue', () => {
  for (const rgb of rgbs) {
    const hsi = rgb2hsi(rgb);
    const hsiNegDeg = [
      hsi[0] - 360,
      hsi[1],
      hsi[2],
    ];
    const ret = hsi2rgb(hsiNegDeg);
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});
