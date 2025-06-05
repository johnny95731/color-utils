import { expect, test } from '@jest/globals';
import { extend } from 'colord';
import xyzPlugin from 'colord/plugins/xyz';
import convert from 'color-convert';

import { SampleGenerator } from '../../../test-utils/sample.js';
import { rgb2xyz, xyz2rgb, setReferenceWhite } from '../../../dist/index.js';

extend([xyzPlugin]);

const { colords, rgbs, length } = SampleGenerator.a();

test('CIEXYZ (D65) - comparison', () => {
  const getConvert = (idx) => convert.rgb.xyz.raw(rgbs[idx]);
  const getCustom = (idx) => rgb2xyz(rgbs[idx]);

  setReferenceWhite('D65');
  for (let i = 0; i < length; i++) {
    const convert_ = getConvert(i);
    const custom_ = getCustom(i);
    for (let j = 0; j < 3; j++) {
      expect(custom_[j]).toBeCloseTo(convert_[j]);
    }
  }
});

test('CIEXYZ (D50) - comparison', () => {
  const getColord = (idx) => {
    const { x, y, z } = colords[idx].toXyz();
    return [x, y, z];
  };
  const getCustom = (idx) => rgb2xyz(rgbs[idx]);

  setReferenceWhite('D50');
  for (let i = 0; i < length; i++) {
    const convert_ = getColord(i);
    const custom_ = getCustom(i);
    for (let j = 0; j < 3; j++) {
      expect(custom_[j]).toBeCloseTo(convert_[j], 1);
    }
  }
});


test('CIEXYZ (D65) - stability', () => {
  setReferenceWhite('D65');
  for (const rgb of rgbs) {
    const ret = xyz2rgb(rgb2xyz(rgb));
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});

test('CIEXYZ (D50) - stability', () => {
  setReferenceWhite('D50');
  for (const rgb of rgbs) {
    const ret = xyz2rgb(rgb2xyz(rgb));
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});

