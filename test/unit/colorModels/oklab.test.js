import { expect, test } from '@jest/globals';

import {
  rgb2oklab, oklab2rgb, oklch2rgb, rgb2oklch, setReferenceWhite,
} from '../../../dist/index.js';
import { SampleGenerator } from '../../../test-utils/sample.js';


const { rgbs } = SampleGenerator.a();

test('Oklab (D65) - stability', () => {
  setReferenceWhite('D65');
  for (const rgb of rgbs) {
    const ret = oklab2rgb(rgb2oklab(rgb));
    expect(ret).toHaveLength(4);
    expect(ret[3]).toBe(rgb[3]);
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});

test('Oklab (D50) - stability', () => {
  setReferenceWhite('D50');
  for (const rgb of rgbs) {
    const ret = oklab2rgb(rgb2oklab(rgb));
    expect(ret).toHaveLength(4);
    expect(ret[3]).toBe(rgb[3]);
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});


test('Oklch (D65) - stability', () => {
  setReferenceWhite('D65');
  for (const rgb of rgbs) {
    const ret = oklch2rgb(rgb2oklch(rgb));
    expect(ret).toHaveLength(4);
    expect(ret[3]).toBe(rgb[3]);
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});

test('Oklch (D50) - stability', () => {
  setReferenceWhite('D50');
  for (const rgb of rgbs) {
    const ret = oklch2rgb(rgb2oklch(rgb));
    expect(ret).toHaveLength(4);
    expect(ret[3]).toBe(rgb[3]);
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});
