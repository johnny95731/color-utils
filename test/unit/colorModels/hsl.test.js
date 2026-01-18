import { expect, test } from '@jest/globals';
import convert from 'color-convert';

import { rgb2hsl, hsl2rgb } from '../../../dist/index.js';
import { SampleGenerator } from '../../../test-utils/sample.js';


const { rgbs, length } = SampleGenerator.a();

test('HSL - comparison', () => {
  const getConvert = idx => convert.rgb.hsl.raw(rgbs[idx]);
  const getCustom = idx => rgb2hsl(rgbs[idx]);

  for (let i = 0; i < length; i++) {
    const convert_ = getConvert(i);
    const custom_ = getCustom(i);
    for (let j = 0; j < 3; j++) {
      expect(custom_[j]).toBeCloseTo(convert_[j]);
    }
  }
});

test('HSL - stability', () => {
  for (const rgb of rgbs) {
    const ret = hsl2rgb(rgb2hsl(rgb));
    expect(ret).toHaveLength(4);
    expect(ret[3]).toBe(rgb[3]);
    for (let i = 0; i < 3; i++) {
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
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});
