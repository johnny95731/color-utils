import { expect, test } from '@jest/globals';
import convert from 'color-convert';

import { rgb2hsb, hsb2rgb } from '../../../dist/index.js';
import { SampleGenerator } from '../../../test-utils/sample.js';


const { rgbs, length } = SampleGenerator.a();

test('HSB - comparison', () => {
  const getConvert = idx => convert.rgb.hsv.raw(rgbs[idx]);
  const getCustom = idx => rgb2hsb(rgbs[idx]);

  for (let i = 0; i < length; i++) {
    const convert_ = getConvert(i);
    const custom_ = getCustom(i);
    for (let j = 0; j < 3; j++) {
      expect(custom_[j]).toBeCloseTo(convert_[j]);
    }
  }
});

test('HSB - stability', () => {
  for (const rgb of rgbs) {
    const ret = hsb2rgb(rgb2hsb(rgb));
    expect(ret).toHaveLength(4);
    expect(ret[3]).toBe(rgb[3]);
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});

test('HSB - negative hue', () => {
  for (const rgb of rgbs) {
    const hsb = rgb2hsb(rgb);
    const hsbNegDeg = [
      hsb[0] - 360,
      hsb[1],
      hsb[2],
    ];
    const ret = hsb2rgb(hsbNegDeg);
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});
