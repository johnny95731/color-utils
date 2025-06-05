import { expect, test } from '@jest/globals';
import convert from 'color-convert';

import { SampleGenerator } from '../../../test-utils/sample.js';
import { rgb2hwb, hwb2rgb, randInt } from '../../../dist/index.js';

const { rgbs, length } = SampleGenerator.a();

test('HWB - comparison', () => {
  const getConvert = (idx) => convert.rgb.hwb.raw(rgbs[idx]);
  const getCustom = (idx) => rgb2hwb(rgbs[idx]);

  for (let i = 0; i < length; i++) {
    const convert_ = getConvert(i);
    const custom_ = getCustom(i);
    for (let j = 0; j < 3; j++) {
      expect(custom_[j]).toBeCloseTo(convert_[j]);
    }
  }
});

test('hwb2rgb - normalize', () => {
  const generator = () => {
    const hwb = [randInt(360), 50+randInt(50), 50+randInt(50)];
    const sum = hwb[1] + hwb[2];
    return {
      hwb,
      normolized: [
        hwb[0],
        100 * hwb[1] / sum,
        100 * hwb[2] / sum
      ]
    };
  };

  for (let i = 0; i < length; i++) {
    const { hwb, normolized } = generator();
    const rgb = hwb2rgb(hwb);
    const expected = hwb2rgb(normolized);
    for (let i = 0; i < 3; i++) {
      expect(rgb[i]).toBeCloseTo(expected[i]);
    }
  }
});

test('HWB - stability', () => {
  for (const rgb of rgbs) {
    const ret = hwb2rgb(rgb2hwb(rgb));
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});
