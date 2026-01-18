import { expect, test } from '@jest/globals';

import {
  harmonize, HARMONY_METHODS, hsb2rgb, randInt, shades, shiftHue, tints, tones,
} from '../../../dist/index.js';


test('shiftHue', () => {
  for (let i = 0; i < 20; i++) {
    const basis = randInt(360);
    const deg = randInt(360);
    expect(shiftHue([basis, 0, 0, 1], [deg])).toStrictEqual(
      [[basis + deg, 0, 0, 1]],
    );
  }
});

test('shades', () => {
  for (let i = 0; i < 20; i++) {
    const hsb = [randInt(360), 100, 100, 1];
    const ret = shades(hsb);
    expect(ret[0]).toStrictEqual(hsb);
    for (let j = 0; j < ret.length - 1; j++) {
      expect(ret[j][0]).toBe(ret[j + 1][0]);
      expect(ret[j][1]).toBe(ret[j + 1][1]);
      expect(ret[j][2]).toBeGreaterThan(ret[j + 1][2]);
    }
  }
});

test('tints', () => {
  for (let i = 0; i < 20; i++) {
    const hsb = [randInt(360), 100, 100, 1];
    const ret = tints(hsb);
    expect(ret[0]).toStrictEqual(hsb);
    for (let j = 0; j < ret.length - 1; j++) {
      expect(ret[j][0]).toBe(ret[j + 1][0]);
      expect(ret[j][1]).toBeGreaterThan(ret[j + 1][1]);
      expect(ret[j][2]).toBe(ret[j + 1][2]);
    }
  }
});

test('tones', () => {
  for (let i = 0; i < 20; i++) {
    const hsb = [randInt(360), 100, 100, 1];
    const ret = tones(hsb);
    expect(ret[0]).toStrictEqual(hsb);
    for (let j = 0; j < ret.length - 1; j++) {
      expect(ret[j][0]).toBe(ret[j + 1][0]);
      expect(ret[j][1]).toBeGreaterThan(ret[j + 1][1]);
      expect(ret[j][2]).toBeGreaterThan(ret[j + 1][2]);
    }
  }
});

test('harmonize', () => {
  const hueDegs = {
    [HARMONY_METHODS[0]]: shades,
    [HARMONY_METHODS[1]]: tints,
    [HARMONY_METHODS[2]]: tones,
    [HARMONY_METHODS[3]]: [-30, 0, 30],
    [HARMONY_METHODS[4]]: [0, 120, 240],
    [HARMONY_METHODS[5]]: [0, 90, 180, 270],
    [HARMONY_METHODS[6]]: [0, 180],
    [HARMONY_METHODS[7]]: [0, 150, 210],
    [HARMONY_METHODS[8]]: [0, 30, 180, 210],
    [HARMONY_METHODS[9]]: [0, 60, 180, 240],
    [HARMONY_METHODS[10]]: [0, 30, 150, 180],
  };

  for (let i = 0; i < 20; i++) {
    const hsb = [randInt(360), randInt(100), randInt(100)];
    HARMONY_METHODS.map((key, i) => {
      const op = hueDegs[key];
      const ret = harmonize(hsb, key);
      const std = (Array.isArray(op) ? shiftHue(hsb, op) : op(hsb))
        .map(hsb => hsb2rgb(hsb));

      expect(ret).toStrictEqual(harmonize(hsb, i));
      expect(ret).toStrictEqual(std);
    });
    // out of range
    expect(harmonize(hsb, 99999)).toStrictEqual(harmonize(hsb, 3));
  }
});
