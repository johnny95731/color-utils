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
  const getFromLib = (idx) => convert.rgb.lab.raw(rgbs[idx]);
  const getCustom = (idx) => rgb2lab(rgbs[idx]);

  setReferenceWhite('D65');
  for (let i = 0; i < length; i++) {
    const std = getFromLib(i);
    const custom = getCustom(i);
    expect(custom[0]).toBeCloseTo(std[0]);
    expect(custom[1]).toBeCloseTo(std[1]);
    expect(custom[2]).toBeCloseTo(std[2]);
  }
});

test('CIELAB (D50) - comparison', () => {
  const getFromLib = (idx) => {
    const { l, a, b } = colords[idx].toLab();
    return [l, a, b];
  };
  const getCustom = (idx) => rgb2lab(rgbs[idx]);

  setReferenceWhite('D50');
  for (let i = 0; i < length; i++) {
    const std = getFromLib(i);
    const custom = getCustom(i);
    expect(custom[0]).toBeCloseTo(std[0], 1);
    expect(custom[1]).toBeCloseTo(std[1], 1);
    expect(custom[2]).toBeCloseTo(std[2], 1);
  }
});

test('CIELAB (D65) - stability', () => {
  setReferenceWhite('D65');
  for (const rgb of rgbs) {
    const ret = lab2rgb(rgb2lab(rgb));
    expect(ret).toHaveLength(4);
    expect(ret[3]).toBe(rgb[3]);
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});

test('CIELAB (D50) - stability', () => {
  setReferenceWhite('D50');
  for (const rgb of rgbs) {
    const ret = lab2rgb(rgb2lab(rgb));
    expect(ret).toHaveLength(4);
    expect(ret[3]).toBe(rgb[3]);
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});


test('CIELCHab (D65) - comparison', () => {
  const getFromLib = (idx) => convert.rgb.lch.raw(rgbs[idx]);
  const getCustom = (idx) => rgb2lchab(rgbs[idx]);

  setReferenceWhite('D65');
  for (let i = 0; i < length; i++) {
    const rgb = rgbs[i];
    const std = getFromLib(i);
    const custom = getCustom(i);
    expect(custom[0]).toBeCloseTo(std[0]);
    expect(custom[1]).toBeCloseTo(std[1]);
    // Hue has floating issue on grayscale colors.
    if (Math.min(...rgb) === Math.max(...rgb)) {
      continue;
    } else {
      expect(custom[2]).toBeCloseTo(std[2]);
    }
  }
});

test('CIELCHab (D50) - comparison', () => {
  const getFromLib = (idx) => {
    const { l, c, h } = colords[idx].toLch();
    return [l, c, h];
  };
  const getCustom = (idx) => rgb2lchab(rgbs[idx]);

  setReferenceWhite('D50');
  for (let i = 0; i < length; i++) {
    const rgb = rgbs[i];
    const std = getFromLib(i);
    const custom = getCustom(i);

    expect(custom[0]).toBeCloseTo(std[0], 1);
    expect(custom[1]).toBeCloseTo(std[1], 1);
    // Hue has floating issue on grayscale colors.
    if (Math.min(...rgb) === Math.max(...rgb)) {
      continue;
    } else {
      expect(custom[2]).toBeCloseTo(std[2], 1);
    }
  }
});

test('CIELCHab (D65) - stability', () => {
  setReferenceWhite('D65');
  for (const rgb of rgbs) {
    const ret = lchab2rgb(rgb2lchab(rgb));
    expect(ret).toHaveLength(4);
    expect(ret[3]).toBe(rgb[3]);
    for (let j = 0; j < 3; j++) {
      expect(ret[j]).toBeCloseTo(rgb[j]);
    }
  }
});

test('CIELCHab (D50) - stability', () => {
  setReferenceWhite('D50');
  for (const rgb of rgbs) {
    const ret = lchab2rgb(rgb2lchab(rgb));
    expect(ret).toHaveLength(4);
    expect(ret[3]).toBe(rgb[3]);
    for (let j = 0; j < 3; j++) {
      expect(ret[j]).toBeCloseTo(rgb[j]);
    }
  }
});
