import { describe, expect, test } from '@jest/globals';

import { COLOR_SPACES, getColorSpace, toSpace, alphaNormalize, rgb2hex, rgbArraylize, rgb2hue, srgb2linearRgb, linearRgb2srgb, rgb2gray, isLight, rgb2luminance, rgb2contrast, isReadable, randRgbGen } from '../../dist/index.js';

/**
 * Black, white, red, green, blue, yello, cyna, magenta.
 */
const rgbs = [
  [0, 0, 0], // Black
  [255, 255, 255], // White
  [255, 0, 0], // Red
  [0, 255, 0], // Green
  [0, 0, 255], // Blue
  [255, 255, 0], // Yellow
  [0, 255, 255], // Cyan
  [255, 0, 255], // Magenta
];

const hue = [
  0, 0, // black, white
  0, 120, 240, // r, g, b
  60, 180, 300 // y, c, m
];

test('getColorSpace', () => {
  expect(getColorSpace()).toBe(COLOR_SPACES[0]);
  expect(getColorSpace('invalid')).toBe(COLOR_SPACES[0]);
  for (const space of COLOR_SPACES) {
    expect(getColorSpace(space)).toBe(space);
    expect(getColorSpace(space.name_)).toBe(space);
    expect(getColorSpace(space.name_.toLowerCase())).toBe(space);
    expect(getColorSpace(space.name_.toUpperCase())).toBe(space);
  }
});

test('toSpace', () => {
  for (const space of COLOR_SPACES) {
    for (const rgb of rgbs) {
      const color = space.fromRgb_(rgb);
      const ret = space.toRgb_(color);
      expect(toSpace(rgb, 'RGB', space)).toEqual(color);
      expect(toSpace(color, space, 'RGB')).toEqual(ret);
    }
  }
});


test('rgbArraylize', () => {
  for (const rgb of rgbs) {
    const hex = rgb2hex(rgb);
    expect(rgbArraylize(rgb)).toStrictEqual(rgb);
    expect(rgbArraylize(hex).slice(0, 3)).toStrictEqual(rgb);
  }
});

test('alphaNormalize', () => {
  const cases = [
    {
      arg: undefined,
      ret: 1,
    },
    {
      arg: 0.2,
      ret: 0.2,
    },
    {
      arg: 0,
      ret: 0,
    },
    {
      arg: 1,
      ret: 1,
    },
    {
      arg: 1.9,
      ret: 1,
    },
    {
      arg: -15,
      ret: 0,
    },
  ];
  for (const { arg, ret } of cases) {
    expect(alphaNormalize(arg)).toStrictEqual(ret);
  }
});

test('rgb2hue', () => {
  for (let i = 0; i < rgbs.length; i++) {
    expect(rgb2hue(rgbs[i])).toBe(hue[i]);
  }
});

test('RGB linearlize', () => {
  expect(srgb2linearRgb(0)).toBe(0);
  expect(srgb2linearRgb(255)).toBe(1);
  for (const rgb of rgbs) {
    for (const val of rgb) {
      expect(
        linearRgb2srgb(srgb2linearRgb(val))
      ).toBeCloseTo(val);
    }
  }
});

test('rgb2gray', () => {
  expect(rgb2gray(rgbs[0])).toBe(0);
  expect(rgb2gray(rgbs[1])).toBe(255);
  expect(rgb2gray(rgbs[2])).toBeCloseTo(0.299 * 255);
  expect(rgb2gray(rgbs[3])).toBeCloseTo(0.587 * 255);
  expect(rgb2gray(rgbs[4])).toBeCloseTo(0.114 * 255);
  expect(rgb2gray(rgbs[5])).toBeCloseTo((0.299+0.587) * 255);
  expect(rgb2gray(rgbs[6])).toBeCloseTo((0.587+0.114) * 255);
  expect(rgb2gray(rgbs[7])).toBeCloseTo((0.114+0.299) * 255);
});

test('isLight', () => {
  expect(isLight(rgbs[0])).toBeFalsy();
  expect(isLight(rgbs[1])).toBeTruthy();
  expect(isLight(rgbs[2])).toBe(0.299 > .5);
  expect(isLight(rgbs[3])).toBe(0.587 > .5);
  expect(isLight(rgbs[4])).toBe(0.114 > .5);
  expect(isLight(rgbs[5])).toBe((0.299 + 0.587) > .5);
  expect(isLight(rgbs[6])).toBe((0.587 + 0.114) > .5);
  expect(isLight(rgbs[7])).toBe((0.114 + 0.299) > .5);
});

test('rgb2luminance', () => {
  expect(rgb2luminance(rgbs[0])).toBe(0);
  expect(rgb2luminance(rgbs[1])).toBe(1);
  expect(rgb2luminance(rgbs[2])).toBeCloseTo(0.2126);
  expect(rgb2luminance(rgbs[3])).toBeCloseTo(0.7152);
  expect(rgb2luminance(rgbs[4])).toBeCloseTo(0.0722);
  expect(rgb2luminance(rgbs[5])).toBeCloseTo((0.2126+0.7152));
  expect(rgb2luminance(rgbs[6])).toBeCloseTo((0.7152+0.0722));
  expect(rgb2luminance(rgbs[7])).toBeCloseTo((0.0722+0.2126));
});

describe('rgb2contrast', () => {
  test('Symmetry', () => {
    for (let i = 0; i < rgbs.length; i++) {
      for (let j = 0; j < rgbs.length; j++) {
        const ij = rgb2contrast(rgbs[i], rgbs[j]);
        const ji = rgb2contrast(rgbs[j], rgbs[i]);
        expect(ij).toBe(ji);
      }
    }
  });

  test('Identity', () => {
    expect(rgb2contrast(rgbs[0], rgbs[1])).toBe(21);
    expect(rgb2contrast(rgbs[1], rgbs[0])).toBe(21);
    for (let i = 0; i < rgbs.length; i++) {
      expect(rgb2contrast(rgbs[i], rgbs[i])).toBe(1);
    }
  });
});

describe('isReadable', () => {
  const cases = [
    // [
    //   testName,
    //   option,
    //   threshold,
    // ],
    [
      'Default option: normal text and level AA',
      undefined,
      4.5
    ],
    [
      'Large text and level AA',
      { isLarge: true },
      3
    ],
    [
      'Large text and level AAA',
      { isLarge: true, levelAAA: true, },
      4.5
    ],
    [
      'Normal text and level AAA',
      { levelAAA: true, },
      7
    ],
  ];

  for (const [testName, option, threshold] of cases) {
    test(testName, () => {
      expect(isReadable(rgbs[0], rgbs[1], option)).toBeTruthy();
      expect(isReadable(rgbs[1], rgbs[0], option)).toBeTruthy();
      for (let i = 0; i < rgbs.length; i++) {
        for (let j = 0; j < rgbs.length; j++) {
          const ret = isReadable(rgbs[i], rgbs[j], option);
          const contrastRatio = rgb2contrast(rgbs[i], rgbs[j]);
          expect(ret).toBe(contrastRatio >= threshold);
        }
      }
    });
  }
});

describe('randRgbGen', () => {
  const [min, max] = COLOR_SPACES[0].max_[0];
  test('randAlpha: false', () => {
    for (let k = 0; k < 50; k++) {
      const rgb = randRgbGen();
      expect(rgb).toHaveLength(4);
      expect(rgb[3]).toBe(1);
      for (const val of rgb) {
        expect(val).toBeGreaterThanOrEqual(min);
        expect(val).toBeLessThanOrEqual(max);
      }
    }
  });

  test('randAlpha: true', () => {
    for (let k = 0; k < 50; k++) {
      const rgb = randRgbGen(true);
      expect(rgb).toHaveLength(4);
      expect(rgb[3]).toBeLessThan(1);
      expect(rgb[3]).toBeGreaterThan(0);
      for (const val of rgb) {
        expect(val).toBeGreaterThanOrEqual(min);
        expect(val).toBeLessThanOrEqual(max);
      }
    }
  });
});
