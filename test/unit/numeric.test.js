import { describe, expect, test } from '@jest/globals';

import {
  clip, deg2rad, dot3, elementwiseMean, l2Dist3, l2Norm3, pow,
  rad2deg, rangeMapping, round, squareSum4,
} from '../../dist/index.js';


test('pow', () => {
  const specialCases = [
    {
      args: [0, 0],
      ret: 1,
    },
    {
      args: [0, 1],
      ret: 0,
    },
    {
      args: [5, 0],
      ret: 1,
    },
    {
      args: [0, Infinity],
      ret: 0,
    },
  ];
  specialCases.forEach(({ args, ret }) => {
    expect(pow(...args)).toBe(ret);
  });

  for (let i = 0; i < 20; i++) {
    const rand = Math.random();
    const rand2 = Math.random();
    expect(pow(rand, 0)).toBe(1);
    expect(pow(0, rand)).toBe(0);
    expect(pow(rand, rand2)).toBeCloseTo(rand ** rand2, 1e-10);
  }
});

test('round', () => {
  const cases = [
    {
      args: [0, 0],
      ret: 0,
    },
    {
      args: [0.12345, 0],
      ret: 0,
    },
    {
      args: [0.12345],
      ret: 0,
    },
    {
      args: [0.54321, 0],
      ret: 1,
    },
    {
      args: [0.54321],
      ret: 1,
    },
    {
      args: [0.45862, 2],
      ret: 0.46,
    },
    {
      args: [0.45862, 2],
      ret: 0.46,
    },
    {
      args: [0.99462, 5],
      ret: 0.99462,
    },
    {
      args: [12, -1],
      ret: 10,
    },
  ];
  cases.forEach(({ args, ret }) => {
    expect(round(...args)).toBe(ret);
  });
});

test('clip', () => {
  const cases = [
    {
      args: [0, -1, 1],
      ret: 0,
    },
    {
      args: [0, 1, 2],
      ret: 1,
    },
    {
      args: [0, -2, -1],
      ret: -1,
    },
    {
      args: [0, 1, -3],
      ret: 1,
    },
  ];
  cases.forEach(({ args, ret }) => {
    expect(clip(...args)).toBe(ret);
  });
});

test('rangeMapping', () => {
  const cases = [
    {
      args: [0, 0, 1, 0, 100],
      ret: 0,
    },
    {
      args: [1, 0, 1, 0, 100],
      ret: 100,
    },
    {
      args: [0.123456, 0, 1, 0, 100, 2],
      ret: 12.35,
    },
    {
      args: [0.5, 0, 1, -100, 100],
      ret: 0,
    },
  ];
  cases.forEach(({ args, ret }) => {
    expect(rangeMapping(...args)).toBe(ret);
  });
});

describe('Degree and Radian', () => {
  const cases = [
    {
      deg: 0,
      rad: 0,
    },
    {
      deg: 180,
      rad: Math.PI,
    },
    {
      deg: 90,
      rad: Math.PI / 2,
    },
    {
      deg: 360,
      rad: Math.PI * 2,
    },
  ];
  test('deg2rad', () => {
    cases.forEach(({ deg, rad }) => {
      expect(deg2rad(deg)).toBeCloseTo(rad);
    });
  });
  test('rad2deg', () => {
    cases.forEach(({ deg, rad }) => {
      expect(rad2deg(rad)).toBeCloseTo(deg);
    });
  });
});

test('dot3', () => {
  const generator = () => {
    return [
      [...Array(3)].map(
        () => Math.random() < 0.1 ? 0 : Math.random() * 100 - 50,
      ),
      [...Array(3)].map(
        () => Math.random() < 0.1 ? 0 : Math.random() * 100 - 50,
      ),
    ];
  };
  const stdCases = [
    {
      args: [[0, 0, 0], [1, 10, 100]],
      ret: 0,
    },
    {
      args: [[1, 1, 1], [1, 10, 100]],
      ret: 111,
    },
    {
      args: [[1, 0, 0], [1, 10, 100]],
      ret: 1,
    },
    {
      args: [[0, 1, 0], [1, 10, 100]],
      ret: 10,
    },
    {
      args: [[0, 0, 1], [1, 10, 100]],
      ret: 100,
    },
  ];
  stdCases.forEach(({ args: [arr1, arr2], ret }) => {
    expect(dot3(arr1, arr2)).toBeCloseTo(ret);
    expect(dot3(arr2, arr1)).toBeCloseTo(dot3(arr1, arr2));
  });
  for (let i = 0; i < 20; i++) {
    const [arr1, arr2] = generator();
    const ret = arr1.reduce((acc, val, i) => acc + val * arr2[i], 0);
    expect(dot3(arr1, arr2)).toBeCloseTo(ret);
  }
});

test('squareSum4', () => {
  const generator = () => {
    return [...Array(4)].map((_, i) =>
      Math.random() < 0.1
        ? (i > 1 ? undefined : 0)
        : Math.random() * 100 - 50);
  };
  for (let i = 0; i < 20; i++) {
    const args = generator();
    const ret = args.reduce(
      (acc, val) => val == null ? acc : acc + val * val,
      0,
    );
    expect(squareSum4(...args)).toBeCloseTo(ret);
  }
});

test('l2Norm3', () => {
  const generator = () => {
    return [...Array(3)].map(() =>
      Math.random() < 0.1
        ? 0
        : Math.random() * 100 - 50);
  };
  for (let i = 0; i < 20; i++) {
    const args = generator();
    const ret = Math.sqrt(args.reduce((acc, val) => acc + val * val, 0));
    expect(l2Norm3(...args)).toBeCloseTo(ret);
  }
});

test('l2Dist3', () => {
  const generator = () => {
    return [
      [...Array(3)].map(() =>
        Math.random() < 0.1
          ? 0
          : Math.random() * 100 - 50),
      [...Array(3)].map(() =>
        Math.random() < 0.1
          ? 0
          : Math.random() * 100 - 50),
    ];
  };
  for (let i = 0; i < 20; i++) {
    const [arr1, arr2] = generator();
    const ret = Math.sqrt(
      arr1.reduce((acc, val, i) => (val -= arr2[i], acc + val * val), 0),
    );
    expect(l2Dist3(arr1, arr2)).toBeCloseTo(ret);
  }
});

test('elementwiseMean', () => {
  const generator = () => {
    return [
      [...Array(3)].map(() =>
        Math.random() < 0.1
          ? 0
          : Math.random() * 100 - 50),
      [...Array(3)].map(() =>
        Math.random() < 0.1
          ? 0
          : Math.random() * 100 - 50),
    ];
  };
  for (let i = 0; i < 20; i++) {
    const [arr1, arr2] = generator();
    const ret = arr1.map((val, i) => (val + arr2[i]) / 2, 0);
    elementwiseMean(arr1, arr2).forEach((val, i) => {
      expect(val).toBeCloseTo(ret[i]);
    });
  }
});
