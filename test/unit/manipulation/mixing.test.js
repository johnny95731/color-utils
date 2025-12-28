import { expect, test } from '@jest/globals';

import {
  additive, brighterMix, deeperMix, elementwiseMean, meanMix, mix,
  mixColors, MIXING_MODES, randRgbGen, softLightBlend,
} from '../../../dist/index.js';


test('mix', () => {
  for (let i = 0; i < 20; i++) {
    const rgb1 = randRgbGen();
    const rgb2 = randRgbGen();

    const factor = Math.random() * 10 + 1;
    const factor2 = Math.random();

    const mean = elementwiseMean(rgb1, rgb2);

    const resDefault = mix(rgb1, rgb2);
    const resNormal = mix(rgb1, rgb2, factor2);
    const resNormalize = mix(rgb1, rgb2, factor, factor);

    const res0 = mix(rgb1, rgb2, 0);
    const res1 = mix(rgb1, rgb2, 1);

    rgb1.forEach((val, i) => {
      expect(resDefault[i]).toBeCloseTo(mean[i]);

      const q = 1 - factor2;
      expect(resNormal[i]).toBeCloseTo(val * factor2 + rgb2[i] * q);

      expect(resNormalize[i]).toBeCloseTo(mean[i]);
      expect(res0[i]).toBeCloseTo(rgb2[i]);
      expect(res1[i]).toBeCloseTo(rgb1[i]);
    });
  }
});

test('meanMix', () => {
  for (let i = 0; i < 20; i++) {
    const rgb1 = randRgbGen();
    const rgb2 = randRgbGen();

    const mean = elementwiseMean(rgb1, rgb2);
    const ret = meanMix(rgb1, rgb2);

    rgb1.forEach((val, i) => {
      expect(ret[i]).toBeCloseTo(mean[i]);
    });
  }
});

test('softLightBlend', () => {
  const keys = [
    'photoshop', 'pegtop', 'illusions.hu', 'w3c',
  ];

  const black = [0, 0, 0, 1];
  const white = [255, 255, 255, 1];

  keys.forEach((key) => {
    expect(softLightBlend(black, white, key)).toStrictEqual(black);
    expect(softLightBlend(white, black, key)).toStrictEqual(white);
  });
});

test('mixColors', () => {
  const ops = {
    [MIXING_MODES[0]]: meanMix,
    [MIXING_MODES[1]]: brighterMix,
    [MIXING_MODES[2]]: deeperMix,
    [MIXING_MODES[3]]: softLightBlend,
    [MIXING_MODES[4]]: additive,
    [MIXING_MODES[5]]: mix,
  };
  for (let i = 0; i < 20; i++) {
    const rgb1 = randRgbGen();
    const rgb2 = randRgbGen();

    MIXING_MODES.forEach((key, i) => {
      const op = ops[key];
      const ret = mixColors([rgb1, rgb2], key);

      expect(ret).toStrictEqual(mixColors([rgb1, rgb2], i));
      expect(ret).toStrictEqual(op(rgb1, rgb2));
    });
    // Default
    expect(mixColors([rgb1, rgb2])).toStrictEqual(mixColors([rgb1, rgb2], 0));
    // out of range
    expect(mixColors([rgb1, rgb2], 99999)).toStrictEqual(
      mixColors([rgb1, rgb2], 0),
    );
  }
});
