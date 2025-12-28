import { expect, test } from '@jest/globals';

import { rgb2luv, luv2rgb, rgb2lchuv, lchuv2rgb } from '../../../dist/index.js';
import { SampleGenerator } from '../../../test-utils/sample.js';


const { rgbs } = SampleGenerator.a();

test('CIELUV stability', () => {
  for (const rgb of rgbs) {
    const ret = luv2rgb(rgb2luv(rgb));
    expect(ret).toHaveLength(4);
    expect(ret[3]).toBe(rgb[3]);
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});

test('CIELCHuv stability', () => {
  for (const rgb of rgbs) {
    const ret = lchuv2rgb(rgb2lchuv(rgb));
    expect(ret).toHaveLength(4);
    expect(ret[3]).toBe(rgb[3]);
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});
