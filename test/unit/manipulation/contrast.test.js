import { expect, test } from '@jest/globals';
import { adjContrast, autoBrightness, autoEnhancement, CONTRAST_METHODS, gammaCorrection, getAdjuster, randInt, randRgbGen, scaling } from '../../../dist/index.js';

test('scaling', () => {
  for (let i = 0; i < 20; i++) {
    const rgb = randRgbGen();
    const rgbs = [rgb];
    const factor = Math.random();

    const resZero = scaling(rgbs, 0)[0];
    const resOne = scaling(rgbs, 1)[0];
    const resN1 = scaling(rgbs, -1)[0];
    const res255 = scaling(rgbs, 255)[0];
    const resP5 = scaling(rgbs, factor)[0];

    for (let i = 0; i < 3; i++) {
      expect(resZero[i]).toBe(0);
      expect(resOne[i]).toBe(rgb[i]);
      expect(resN1[i]).toBeCloseTo(0);
      expect(res255[i]).toBe(rgb[i] ? 255 : 0);
      expect(resP5[i]).toBeCloseTo(rgb[i] * factor);
    }
    for (const res of [resZero, resOne, resN1, res255, resP5]) {
      expect(res[3]).toBe(rgb[3]);
    }
  }
});

test('gammaCorrection', () => {
  for (let i = 0; i < 20; i++) {
    const rgb = randRgbGen();
    const rgbs = [rgb];
    const factor = Math.random() * 2;

    const resZero = gammaCorrection(rgbs, 0)[0];
    const resOne = gammaCorrection(rgbs, 1)[0];
    const resP5 = gammaCorrection(rgbs, factor)[0];

    for (let i = 0; i < 3; i++) {
      expect(resZero[i]).toBeCloseTo(255);
      expect(resOne[i]).toBeCloseTo(rgb[i]);
      expect(resP5[i]).toBeCloseTo(255 * (rgb[i] / 255)**factor);
    }
    for (const res of [resZero, resOne, resP5]) {
      expect(res[3]).toBe(rgb[3]);
    }
  }
});

test('autoBrightness', () => {
  for (let i = 0; i < 20; i++) {
    const rgb = randRgbGen();
    const rgbs = [rgb];

    const resZero = autoBrightness(rgbs, 0)[0];
    const resOne = autoBrightness(rgbs, 1)[0];

    for (let i = 0; i < 3; i++) {
      expect(resZero[i]).toBeCloseTo(0);
      expect(resOne[i]).toBeCloseTo(255);
    }
    for (const res of [resZero, resOne]) {
      expect(res[3]).toBe(rgb[3]);
    }
    expect(autoBrightness([[0, 0, 0]])).toEqual([[255, 255, 255]]);
  }
});

test('getAdjuster', () => {
  const ops = [
    scaling,
    gammaCorrection,
    autoEnhancement,
    autoBrightness,
  ];

  CONTRAST_METHODS.forEach((key, j) => {
    const ret = getAdjuster(key);
    expect(ret).toBe(ops[j]);
  });
});

test('adjContrast', () => {
  const ops = [
    scaling,
    gammaCorrection,
    autoEnhancement,
    autoBrightness,
  ];

  for (let i = 0; i < 20; i++) {
    const num = randInt(8) + 2;
    const rgbs = [...Array(num)].map(() => randRgbGen());

    CONTRAST_METHODS.forEach((key, j) => {
      const ret = adjContrast(rgbs, key);
      const std = ops[j](rgbs);

      expect(ret).toStrictEqual(adjContrast(rgbs, j));
      ret.forEach((arr, k) => {
        expect(arr).toEqual(std[k]);
      });
    });
    // out of range
    expect(adjContrast(rgbs, 99999)).toEqual(adjContrast(rgbs, 0));
  }
});
