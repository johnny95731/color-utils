import { describe, expect, test } from '@jest/globals';

import { COLOR_SPACES, getColorSpace, getSpaceRange, toSpace, getCssColor, rgb2hex, rgbArraylize, rgb2hue, srgb2linearRgb, linearRgb2srgb, rgb2gray, isLight, getRelativeLuminance, getContrastRatio, isReadable, randRgbGen } from '../../dist/index.js';

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
  0, 0,
  0, 120, 240,
  60, 180, 300
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

test('getSpaceRange (Deprecated)', () => {
  for (const space of COLOR_SPACES) {
    expect(getSpaceRange(space)).toStrictEqual(space.max_);
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

describe('getCssColor', () => {
  const blackRgb = [0, 0, 0];

  const defaultCases = [
    {
      space: 'RGB',
      expected: 'rgb(0% 0% 0%)'
    },
    {
      space: 'HSL',
      expected: 'hsl(0 0% 0%)'
    },
    {
      space: 'HSB',
      expected: 'hsb(0 0% 0%)'
    },
    {
      space: 'XYZ',
      expected: 'xyz(0% 0% 0%)'
    },
    {
      space: 'LAB',
      expected: 'lab(0% 0% 0%)'
    },
    {
      space: 'Lchab',
      expected: 'lch(0% 0% 0)'
    },
    {
      space: 'oklab',
      expected: 'oklab(0% 0% 0%)'
    },
    {
      space: 'oklch',
      expected: 'oklch(0% 0% 0)'
    },
  ];

  test('Default option', () => {
    for (const { space, expected } of defaultCases) {
      const color = getColorSpace(space).fromRgb_(blackRgb);
      expect(getCssColor(color, space)).toBe(expected);
    }
  });

  test('checkSupport_: true', () => {
    const option = { checkSupport_: true };
    const cases = [
      {
        space: 'RGB',
        expected: 'rgb(0% 0% 0%)'
      },
      {
        space: 'HSL',
        expected: 'hsl(0 0% 0%)'
      },
      {
        space: 'HSB',
        expected: 'rgb(0% 0% 0%)'
      },
      {
        space: 'CMYK',
        expected: 'rgb(0% 0% 0%)'
      },
      {
        space: 'XYZ',
        expected: 'color(xyz-d65 0% 0% 0%)'
      },
      {
        space: 'LAB',
        expected: 'lab(0% 0% 0%)'
      },
      {
        space: 'Lchab',
        expected: 'lch(0% 0% 0)'
      },
      {
        space: 'oklab',
        expected: 'oklab(0% 0% 0%)'
      },
      {
        space: 'oklch',
        expected: 'oklch(0% 0% 0)'
      },
    ];

    for (const { space, expected } of cases) {
      const color = getColorSpace(space).fromRgb_(blackRgb);
      expect(getCssColor(color, space, option)).toBe(expected);
    }

    expect(
      getCssColor([95, 100, 108], 'XYZ', { checkSupport_: true, percent_: false })
    )
      .toBe('color(xyz-d65 0.95 1 1.08)');
  });

  test('sep_', () => {
    const sep = ',';
    const option = { sep_: sep };

    for (const { space, expected } of defaultCases) {
      const color = getColorSpace(space).fromRgb_(blackRgb);
      expect(getCssColor(color, space, option))
        .toBe(expected.replaceAll(' ', sep));
    }
  });

  test('percent_: false', () => {
    const option = { percent_: false };

    for (let { space, expected } of defaultCases) {
      const sp = getColorSpace(space);
      const color = sp.fromRgb_(blackRgb);

      const vals = expected.split(' ');
      sp.max_.forEach(([, max], i) => {
        if (max !== 100) vals[i] = vals[i].replace('%', '');
      });
      expected = vals.join(' ');

      expect(getCssColor(color, space, option)).toBe(expected);
    }
  });

  test('place_ === true', () => {
    const option = { place_: true };
    for (const space of COLOR_SPACES) {
      const color = space.fromRgb_(blackRgb);
      expect(getCssColor(color, space, option)).toBe(getCssColor(color, space));
    }
  });

  test('place_ === false', () => {
    const rgb = [1.25, 41.54689, 66.99];
    const option = { place_: false, percent_: false };
    const valHandler = (acc, val, i, max) => {
      if (max === 100) return acc + (i ? ' ' : '') + val + '%';
      else return acc + (i ? ' ' : '') + val;
    };

    for (const space of COLOR_SPACES) {
      const color = space.fromRgb_(rgb);
      const range = space.max_;

      const name = /^LCH/.test(space.name_) ? 'lch' : space.name_.toLowerCase();
      const vals = color.reduce((acc, val, i) => valHandler(acc, val, i, range[i][1]), '');
      expect(getCssColor(color, space, option)).toBe(`${name}(${vals})`);
    }
  });
});

test('rgbArraylize', () => {
  for (const rgb of rgbs) {
    const hex = rgb2hex(rgb);
    expect(rgbArraylize(rgb)).toStrictEqual(rgb);
    expect(rgbArraylize(hex)).toStrictEqual(rgb);
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

test('getRelativeLuminance', () => {
  expect(getRelativeLuminance(rgbs[0])).toBe(0);
  expect(getRelativeLuminance(rgbs[1])).toBe(1);
  expect(getRelativeLuminance(rgbs[2])).toBeCloseTo(0.2126);
  expect(getRelativeLuminance(rgbs[3])).toBeCloseTo(0.7152);
  expect(getRelativeLuminance(rgbs[4])).toBeCloseTo(0.0722);
  expect(getRelativeLuminance(rgbs[5])).toBeCloseTo((0.2126+0.7152));
  expect(getRelativeLuminance(rgbs[6])).toBeCloseTo((0.7152+0.0722));
  expect(getRelativeLuminance(rgbs[7])).toBeCloseTo((0.0722+0.2126));
});

describe('getContrastRatio', () => {
  test('Symmetry', () => {
    for (let i = 0; i < rgbs.length; i++) {
      for (let j = 0; j < rgbs.length; j++) {
        const ij = getContrastRatio(rgbs[i], rgbs[j]);
        const ji = getContrastRatio(rgbs[j], rgbs[i]);
        expect(ij).toBe(ji);
      }
    }
  });

  test('Identity', () => {
    expect(getContrastRatio(rgbs[0], rgbs[1])).toBe(21);
    expect(getContrastRatio(rgbs[1], rgbs[0])).toBe(21);
    for (let i = 0; i < rgbs.length; i++) {
      expect(getContrastRatio(rgbs[i], rgbs[i])).toBe(1);
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
          const contrastRatio = getContrastRatio(rgbs[i], rgbs[j]);
          expect(ret).toBe(contrastRatio >= threshold);
        }
      }
    });
  }
});

test('randRgbGen', () => {
  const [min, max] = COLOR_SPACES[0].max_[0];
  for (let k = 0; k < 50; k++) {
    const rgb = randRgbGen();
    expect(rgb).toHaveLength(3);
    for (const val of rgb) {
      expect(val).toBeGreaterThanOrEqual(min);
      expect(val).toBeLessThanOrEqual(max);
    }
  }
});
