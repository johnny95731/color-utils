import { expect, test } from '@jest/globals';
import { extend } from 'colord';
import labPlugin from 'colord/plugins/lab';
import lchPlugin from 'colord/plugins/lch';
import convert from 'color-convert';

import { SampleGenerator } from '../../../test-utils/sample.js';
import { rgb2lab, lab2rgb, rgb2lchab, lchab2rgb, setReferenceWhite } from '../../../dist/index.js';

extend([labPlugin, lchPlugin]);

const { colords, rgbs, length } = SampleGenerator.a();

test('CIELAB (D65) - comparison', () => {
  const getConvert = (idx) => convert.rgb.lab.raw(rgbs[idx]);
  const getCustom = (idx) => rgb2lab(rgbs[idx]);

  setReferenceWhite('D65');
  for (let i = 0; i < length; i++) {
    const convert_ = getConvert(i);
    const custom_ = getCustom(i);
    for (let j = 0; j < getCustom.length; j++) {
      expect(custom_[j]).toBeCloseTo(convert_[j]);
    }
  }
});

test('CIELAB (D50) - comparison', () => {
  const getColord = (idx) => {
    const { l, a, b } = colords[idx].toLab();
    return [l, a, b];
  };
  const getCustom = (idx) => rgb2lab(rgbs[idx]);

  setReferenceWhite('D50');
  for (let i = 0; i < length; i++) {
    const colord_ = getColord(i);
    const custom_ = getCustom(i);
    for (let j = 0; j < getCustom.length; j++) {
      expect(custom_[j]).toBeCloseTo(colord_[j]);
    }
  }
});

test('CIELAB (D65) - stability', () => {
  setReferenceWhite('D65');
  for (const rgb of rgbs) {
    const ret = lab2rgb(rgb2lab(rgb));
    for (let i = 0; i < rgb.length; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});

test('CIELAB (D50) - stability', () => {
  setReferenceWhite('D50');
  for (const rgb of rgbs) {
    const ret = lab2rgb(rgb2lab(rgb));
    for (let i = 0; i < rgb.length; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});


test('CIELCHab (D65) - comparison', () => {
  const getConvert = (idx) => convert.rgb.lab.raw(rgbs[idx]);
  const getCustom = (idx) => rgb2lchab(rgbs[idx]);

  setReferenceWhite('D65');
  for (let i = 0; i < length; i++) {
    const convert_ = getConvert(i);
    const custom_ = getCustom(i);
    for (let j = 0; j < getCustom.length; j++) {
      expect(custom_[j]).toBeCloseTo(convert_[j]);
    }
  }
});

test('CIELCHab (D50) - comparison', () => {
  const getColord = (idx) => {
    const { l, a, b } = colords[idx].toLab();
    return [l, a, b];
  };
  const getCustom = (idx) => rgb2lchab(rgbs[idx]);

  setReferenceWhite('D50');
  for (let i = 0; i < length; i++) {
    const colord_ = getColord(i);
    const custom_ = getCustom(i);
    for (let j = 0; j < getCustom.length; j++) {
      expect(custom_[j]).toBeCloseTo(colord_[j]);
    }
  }
});

test('CIELCHab (D65) - stability', () => {
  setReferenceWhite('D65');
  for (const rgb of rgbs) {
    const ret = lchab2rgb(rgb2lchab(rgb));
    for (let i = 0; i < rgb.length; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});

test('CIELCHab (D50) - stability', () => {
  setReferenceWhite('D50');
  for (const rgb of rgbs) {
    const ret = lchab2rgb(rgb2lchab(rgb));
    for (let i = 0; i < rgb.length; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});
