import { expect, test } from '@jest/globals';

import { extend } from 'colord';
import cmykPlugin from 'colord/plugins/cmyk';
import convert from 'color-convert';

import { SampleGenerator } from '../../../test-utils/sample.js';
import { rgb2cmyk, cmyk2rgb } from '../../../dist/index.js';

extend([cmykPlugin]);

const { rgbs, length } = SampleGenerator.a();

test('CMYK - comparison', () => {
  const getConvert = (idx) => convert.rgb.cmyk.raw(rgbs[idx]);
  const getCustom = (idx) => rgb2cmyk(rgbs[idx]);

  for (let i = 0; i < length; i++) {
    const convert_ = getConvert(i);
    const custom_ = getCustom(i);
    for (let j = 0; j < convert_.length; j++) {
      expect(custom_[j]).toBeCloseTo(convert_[j]);
    }
  }
});

test('CMYK - stability', () => {
  for (const rgb of rgbs) {
    const ret = cmyk2rgb(rgb2cmyk(rgb));
    for (let i = 0; i < rgb.length; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});
