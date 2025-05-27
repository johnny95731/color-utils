import { expect, test } from '@jest/globals';
import convert from 'color-convert';

import { SampleGenerator } from '../../../test-utils/sample.js';
import { rgb2hsl, hsl2rgb } from '../../../dist/index.js';

const { rgbs, length } = SampleGenerator.a();

test('HSL - comparison', () => {
  const getConvert = (idx) => convert.rgb.hsl.raw(rgbs[idx]);
  const getCustom = (idx) => rgb2hsl(rgbs[idx]);

  for (let i = 0; i < length; i++) {
    const convert_ = getConvert(i);
    const custom_ = getCustom(i);
    for (let j = 0; j < convert_.length; j++) {
      expect(custom_[j]).toBeCloseTo(convert_[j]);
    }
  }
});

test('HSL - stability', () => {
  for (const rgb of rgbs) {
    const ret = hsl2rgb(rgb2hsl(rgb));
    for (let i = 0; i < rgb.length; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});

test('HSL - negative hue', () => {
  for (const rgb of rgbs) {
    const hsl = rgb2hsl(rgb);
    const hslNegDeg = [
      hsl[0] - 360,
      hsl[1],
      hsl[2],
    ];
    const ret = hsl2rgb(hslNegDeg);
    for (let i = 0; i < rgb.length; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});
