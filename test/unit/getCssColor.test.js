import { describe, expect, test } from '@jest/globals';

import { COLOR_SPACES, getColorSpace, getCssColor } from '../../dist/index.js';


describe('getCssColor', () => {
  const blackRgb = [0, 0, 0, 1];

  const defaultCases = [
    {
      space: 'RGB',
      expected: 'rgb(0% 0% 0%)',
    },
    {
      space: 'HSL',
      expected: 'hsl(0 0% 0%)',
    },
    {
      space: 'HSB',
      expected: 'hsb(0 0% 0%)',
    },
    {
      space: 'XYZ',
      expected: 'xyz(0% 0% 0%)',
    },
    {
      space: 'LAB',
      expected: 'lab(0% 0% 0%)',
    },
    {
      space: 'Lchab',
      expected: 'lch(0% 0% 0)',
    },
    {
      space: 'oklab',
      expected: 'oklab(0% 0% 0%)',
    },
    {
      space: 'oklch',
      expected: 'oklch(0% 0% 0)',
    },
  ];

  test('Default option', () => {
    expect(getCssColor(blackRgb)).toBe(getCssColor(blackRgb, 'RGB'));

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
        expected: 'rgb(0% 0% 0%)',
      },
      {
        space: 'HSL',
        expected: 'hsl(0 0% 0%)',
      },
      {
        space: 'HSB',
        expected: 'rgb(0% 0% 0%)',
      },
      {
        space: 'CMYK',
        expected: 'rgb(0% 0% 0%)',
      },
      {
        space: 'XYZ',
        expected: 'color(xyz-d65 0% 0% 0%)',
      },
      {
        space: 'LAB',
        expected: 'lab(0% 0% 0%)',
      },
      {
        space: 'Lchab',
        expected: 'lch(0% 0% 0)',
      },
      {
        space: 'oklab',
        expected: 'oklab(0% 0% 0%)',
      },
      {
        space: 'oklch',
        expected: 'oklch(0% 0% 0)',
      },
    ];

    for (const { space, expected } of cases) {
      const color = getColorSpace(space).fromRgb_(blackRgb);
      expect(getCssColor(color, space, option)).toBe(expected);
    }

    expect(
      getCssColor(
        [95, 100, 108],
        'XYZ',
        { checkSupport_: true, percent_: false },
      ),
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
      sp.max_.forEach((_, i) => {
        vals[i] = vals[i].replace('%', '');
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
      if (max === 100) return acc + (i ? ' ' : '') + val;
      else return acc + (i ? ' ' : '') + val;
    };

    for (const space of COLOR_SPACES) {
      const color = space.fromRgb_(rgb);
      const range = space.max_;

      const name = /^LCH/.test(space.name_) ? 'lch' : space.name_.toLowerCase();
      const vals = range.reduce(
        (acc, [, max], i) => valHandler(acc, color[i], i, max),
        '',
      );
      expect(getCssColor(color, space, option)).toBe(`${name}(${vals})`);
    }
  });

  test('Alpha channel with default option', () => {
    const alpha = 0.5;
    const blackRgb = [0, 0, 0, alpha];

    for (const { space, expected } of defaultCases) {
      const color = getColorSpace(space).fromRgb_(blackRgb);
      const exp = expected.split(')');
      exp[0] += ' / ' + alpha * 100 + '%';
      expect(getCssColor(color, space)).toBe(exp.join(')'));
    }
  });

  test('Alpha channel with percent_: false', () => {
    const alpha = 0.5;
    const blackRgb = [0, 0, 0, alpha];
    const option = { percent_: false };

    const defaultCases = [
      {
        space: 'RGB',
        expected: `rgb(0 0 0 / ${alpha})`,
      },
      {
        space: 'HSL',
        expected: `hsl(0 0 0 / ${alpha})`,
      },
      {
        space: 'HSB',
        expected: `hsb(0 0 0 / ${alpha})`,
      },
      {
        space: 'XYZ',
        expected: `xyz(0 0 0 / ${alpha})`,
      },
      {
        space: 'LAB',
        expected: `lab(0 0 0 / ${alpha})`,
      },
      {
        space: 'Lchab',
        expected: `lch(0 0 0 / ${alpha})`,
      },
      {
        space: 'oklab',
        expected: `oklab(0 0 0 / ${alpha})`,
      },
      {
        space: 'oklch',
        expected: `oklch(0 0 0 / ${alpha})`,
      },
    ];

    for (const { space, expected } of defaultCases) {
      const color = getColorSpace(space).fromRgb_(blackRgb);
      expect(getCssColor(color, space, option)).toBe(expected);
    }
  });
});
