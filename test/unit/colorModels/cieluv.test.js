import { expect, test } from '@jest/globals';
import { SampleGenerator } from '../../../test-utils/sample.js';
import { rgb2luv, luv2rgb, rgb2lchuv, lchuv2rgb } from '../../../dist/index.js';

const { rgbs } = SampleGenerator.a();

test('CIELUV stability', () => {
  for (const rgb of rgbs) {
    const ret = luv2rgb(rgb2luv(rgb));
    for (let i = 0; i < rgb.length; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});

test('CIELCHuv stability', () => {
  for (const rgb of rgbs) {
    const ret = lchuv2rgb(rgb2lchuv(rgb));
    for (let i = 0; i < rgb.length; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});
