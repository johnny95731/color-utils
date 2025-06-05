import { expect, test } from '@jest/globals';
import convert from 'color-convert';

import { SampleGenerator } from '../../../test-utils/sample.js';
import { rgb2hex, hex2rgb, isValidHex, randInt } from '../../../dist/index.js';

const { rgbs, length } = SampleGenerator.a();

test('isValidHex', () => {
  const cases = [
    {
      hex: '#000',
      ret: true,
    },
    {
      hex: 'FFF',
      ret: true,
    },
    {
      hex: 'a5E',
      ret: true,
    },
    {
      hex: 'a5BE',
      ret: false,
    },
    {
      hex: '#000000',
      ret: true,
    },
    {
      hex: '#qqq',
      ret: false,
    },
  ];
  cases.forEach(({ hex, ret }) => {
    expect(isValidHex(hex)).toBe(ret);
  });
});

test('Invalid hex to rgb', () => {
  const cases = [
    {
      text: 'a5BE',
    },
    {
      text: '#qqq',
    },
  ];
  cases.forEach(({ text }) => {
    expect(hex2rgb(text)).toStrictEqual([0,0,0]);
  });
});

test('Hex-3 to rgb', () => {
  const hex = '0123456789ABCDEF';
  const randomHex = () => hex[randInt(16)];

  for (let i = 0; i < 20; i++) {
    let hex3 = '';
    let hex6 = '';
    for (let j = 0; j < 3; j++) {
      const t = randomHex();
      hex3 += t;
      hex6 += t + t;
    }
    expect(hex2rgb(hex3)).toStrictEqual(hex2rgb(hex6));
  }
});

test('HEX - comparison', () => {
  const getConvert = (idx) => '#' + convert.rgb.hex(rgbs[idx]);
  const getCustom = (idx) => rgb2hex(rgbs[idx]);

  for (let i = 0; i < length; i++) {
    const convert_ = getConvert(i);
    const custom_ = getCustom(i);
    expect(custom_).toBe(convert_);
  }
});

test('HEX - stability', () => {
  for (const rgb of rgbs) {
    const ret = hex2rgb(rgb2hex(rgb));
    for (let i = 0; i < 3; i++) {
      expect(ret[i]).toBeCloseTo(rgb[i]);
    }
  }
});
