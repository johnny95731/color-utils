import { expect, test } from '@jest/globals';
import { colord } from 'colord';

import {
  rgb2hex, hex2rgb, isValidHex, randInt, map,
} from '../../../dist/index.js';
import { randRgbGen } from '../../../test-utils/helpers.js';
import { SampleGenerator } from '../../../test-utils/sample.js';


const { length } = SampleGenerator.a();

const rgbs = map(length, () => {
  const rgb = randRgbGen();
  if (Math.random() < 0.95) rgb[3] = randInt(255) / 255;
  return rgb;
});

const hexChar = '0123456789ABCDEF';
const getRandomHexChar = () => hexChar[randInt(15)];
const hexGenerator = num => map(num, getRandomHexChar).join('');

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
      hex: 'a579E',
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

test('Hex 4-digit/8-digit - equivalent', () => {
  for (let i = 0; i < 20; i++) {
    let hex4 = '';
    let hex8 = '';
    for (let j = 0; j < 4; j++) {
      const t = getRandomHexChar();
      hex4 += t;
      hex8 += t + t;
    }
    const rgb4 = hex2rgb(hex4);
    const rgb8 = hex2rgb(hex8);
    expect(rgb4.slice(0, 3)).toEqual(rgb8.slice(0, 3));
    expect(rgb4[3]).toBeCloseTo(rgb8[3]);
  }
});

test('Hex 3-digit/6-digit - equivalent', () => {
  for (let i = 0; i < 20; i++) {
    let hex3 = '';
    let hex6 = '';
    for (let j = 0; j < 3; j++) {
      const t = getRandomHexChar();
      hex3 += t;
      hex6 += t + t;
    }
    expect(hex2rgb(hex3)).toStrictEqual(hex2rgb(hex6));
  }
});

test('rgb2hex - comparison', () => {
  const getConvert = (idx) => {
    const [r, g, b, a] = rgbs[idx];
    return colord({ r, g, b, a }).toHex().toUpperCase();
  };
  const getCustom = idx => rgb2hex(rgbs[idx]);

  for (let i = 0; i < length; i++) {
    const colord_ = getConvert(i);
    const custom_ = getCustom(i);
    expect(custom_).toBe(colord_);
  }
});

test('hex2rgb 8-digit - comparison', () => {
  const hex8 = map(length, () => '#' + hexGenerator(8));
  const getColord = (idx) => {
    const { r, g, b, a } = colord(hex8[idx]).toRgb();
    return [r, g, b, a];
  };
  const getCustom = idx => hex2rgb(hex8[idx]);

  for (let i = 0; i < length; i++) {
    const colord_ = getColord(i);
    const custom_ = getCustom(i);
    expect(custom_.slice(0, 3)).toEqual(colord_.slice(0, 3));
    expect(custom_[3]).toBeCloseTo(colord_[3], 2);
  }
});

test('hex2rgb 6-digit - comparison', () => {
  const hex6 = map(length, () => '#' + hexGenerator(6));
  const getColord = (idx) => {
    const { r, g, b, a } = colord(hex6[idx]).toRgb();
    return [r, g, b, a];
  };
  const getCustom = idx => hex2rgb(hex6[idx]);

  for (let i = 0; i < length; i++) {
    const colord_ = getColord(i);
    const custom_ = getCustom(i);
    expect(custom_).toEqual(colord_);
  }
});

test('hex2rgb 4-digit - comparison', () => {
  const hex6 = map(length, () => '#' + hexGenerator(4));
  const getColord = (idx) => {
    const { r, g, b, a } = colord(hex6[idx]).toRgb();
    return [r, g, b, a];
  };
  const getCustom = idx => hex2rgb(hex6[idx]);

  for (let i = 0; i < length; i++) {
    const colord_ = getColord(i);
    const custom_ = getCustom(i);
    expect(custom_.slice(0, 3)).toEqual(colord_.slice(0, 3));
    expect(custom_[3]).toBeCloseTo(colord_[3], 2);
  }
});

test('hex2rgb 3-digit - comparison', () => {
  const hex6 = map(length, () => '#' + hexGenerator(3));
  const getColord = (idx) => {
    const { r, g, b, a } = colord(hex6[idx]).toRgb();
    return [r, g, b, a];
  };
  const getCustom = idx => hex2rgb(hex6[idx]);

  for (let i = 0; i < length; i++) {
    const colord_ = getColord(i);
    const custom_ = getCustom(i);
    expect(custom_).toEqual(colord_);
  }
});

test('Invalid hex to rgb', () => {
  const cases = [
    {
      text: 'a579E',
    },
    {
      text: '#1234567',
    },
    {
      text: '#qqq',
    },
  ];
  cases.forEach(({ text }) => {
    expect(hex2rgb(text)).toStrictEqual([0, 0, 0, 1]);
  });
});

test('HEX - stability', () => {
  for (const rgb of rgbs) {
    const hex = rgb2hex(rgb);
    const ret = hex2rgb(hex);
    expect(ret).toHaveLength(4);
    try {
      if (rgb[3] == null)
        expect(ret[3]).toBe(1);
      else
        expect(ret[3]).toBeCloseTo(rgb[3]);
      for (let i = 0; i < 3; i++) {
        expect(ret[i]).toBeCloseTo(rgb[i]);
      }
    }
    catch {
      throw new Error(`
${rgb}
${hex}
${ret}
`);
    }
  }
});
