import { expect, test } from '@jest/globals';
import convert from 'color-convert';

import { SampleGenerator } from '../../../test-utils/sample.js';
import { rgb2hwb, hwb2rgb } from '../../../dist/index.js';

const { rgbs, length } = SampleGenerator.a();

test('HWB - comparison', () => {
  const getConvert = (idx) => convert.rgb.hwb.raw(rgbs[idx]);
  const getCustom = (idx) => rgb2hwb(rgbs[idx]);

  for (let i = 0; i < length; i++) {
    const convert_ = getConvert(i);
    const custom_ = getCustom(i);
    for (let j = 0; j < getCustom.length; j++) {
      expect(custom_[j]).toBeCloseTo(convert_[j]);
    }
  }
});

test('HWB - stability', () => {
  for (const rgb of rgbs) {
    const ret = hwb2rgb(rgb2hwb(rgb));
    for (let i = 0; i < rgb.length; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});
