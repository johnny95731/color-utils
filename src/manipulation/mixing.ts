import { map } from '../helpers';
import { clip, elementwiseMean, pow } from '../numeric';
import { hsl2rgb, rgb2hsl } from '../colorModels/hsl';


/**
 * Support mix modes.
 */
export const MIXING_MODES = [
  'mean', 'brighter', 'deeper', 'soft light', 'additive', 'weighted'
] as const;

/**
 * Support mix modes.
 */
export type Mixing = typeof MIXING_MODES[number];

export type MixOp =
  ((c1: readonly number[], c2: readonly number[]) => number[]) |
  ((c1: readonly number[], c2: readonly number[], formula: string) => number[]) |
  ((c1: readonly number[], c2: readonly number[], ...args: number[]) => number[]);


/**
 * Mixing two colors by evaluate their elementwise weighted sum.
 * @param color1 Color array.
 * @param color2 Color array.
 * @param weight1 Default: `0.5`. Weight of `color1`. Should be in range [0, 1].
 */
export const mix = (
  color1: readonly number[],
  color2: readonly number[],
  weight1: number = 0.5,
  weight2: number = 1 - weight1,
) => {
  // Normalize to weight1 + weight2 = 1
  if (weight1 + weight2 > 1) {
    weight1 /= weight1 + weight2;
    weight2 = 1 - weight1;
  }
  return map(
    Math.min(color1.length, color2.length),
    i => weight1 * color1[i] + weight2 * color2[i]
  );
};

/**
 * Mixing two colors by evaluate their elementwise average.
 * @param color1 Color array.
 * @param color2 Color array.
 */
export const meanMix = elementwiseMean;


// Simply mix and adjust it.
/**
 * Take the mean mix of color1 and color2 and do gamma correction to adjust
 * saturation and luminance.
 * @param rgb1 RGB color.
 * @param rgb2 RGB color.
 * @param gamma Gamma-corection coefficient. The color is deeper if gamma > 1.
 *   The color is brighter if gamma < 1.
 * @returns RGB color.
 */
export const gammaMix = (
  rgb1: readonly number[],
  rgb2: readonly number[],
  gamma: number = 0.3,
): number[] => {
  const mean = elementwiseMean(rgb1, rgb2);
  const hsl = rgb2hsl(mean);

  hsl[1] = 100 * pow(hsl[1] / 100, gamma);
  hsl[2] = 100 * pow(hsl[2] / 100, gamma);
  return hsl2rgb(hsl);
};

/**
 *
 * @param rgb1 RGB color.
 * @param rgb2 RGB color.
 * @returns Color in `space`
 */
export const brighterMix = (
  rgb1: readonly number[],
  rgb2: readonly number[],
) =>
  gammaMix(rgb1, rgb2, 0.3);

export const deeperMix = (
  rgb1: readonly number[],
  rgb2: readonly number[],
) =>
  gammaMix(rgb1, rgb2, 1.5);


// Blend-mode methods.
/**
 * Blending two colors by soft light.
 * @param rgb1 Color 1.
 * @param rgb2 Color 2.
 * @param formula Default: 'w3c'. The softlight formula.
 * @returns RGB color.
 */
export const softLightBlend = (
  rgb1: readonly number[],
  rgb2: readonly number[],
  formula: 'photoshop' | 'pegtop' | 'illusions.hu' | 'w3c' = 'w3c'
) => {
  rgb1 = map(rgb1, val => val / 255);
  rgb2 = map(rgb2, val => val / 255);

  let fn: (a: number, i: number) => number;
  // temp store color2[i].
  // 'a' and 'b' to simply compare with formula
  let b: number;
  let w3c: number;
  if (formula === 'photoshop') {
    fn = (a, i) => {
      b = rgb2[i];
      return 255 * (
        b < 0.5 ?
          a * (2 * b + a * (1 - 2 * b)) :
          2 * a * (1 - b) + Math.sqrt(a) * (2 * b - 1)
      );
    };
  } else if (formula === 'pegtop') {
    fn = (a, i) => {
      b = rgb2[i];
      return 255 * a * (2 * b + a * (1 - 2 * b));
    };
  } else if (formula === 'illusions.hu') {
    fn = (a, i) => {
      b = rgb2[i];
      return 255 * a**(2**(1 - 2 * b));
    };
  } else { // w3c
    fn = (a, i) => {
      b = rgb2[i];
      w3c = a <= 0.25 ? ((16 * a - 12) * a + 4) * a: Math.sqrt(a);
      return 255 * (
        b <= 0.5 ?
          a - (1 - 2 * b) * a * (1 - a):
          a + (2 * b - 1) * (w3c - a)
      );
    };
  }
  return map(rgb1, fn);
};

/**
 * Mixing two colors by evaluate their RGB sum.
 * @param rgb1 Color array.
 * @param rgb2 Color array.
 * @returns RGB color.
 */
export const additive = (
  rgb1: readonly number[],
  rgb2: readonly number[],
): number[] => {
  return map(
    rgb1,
    (val, i) => clip(val + rgb2[i], 0, 255),
    3
  );
};


/**
 * Mix or blend array of RGB colors. Return a RGB color.
 * @param rgbs Array of RGB colors.
 * @param method Mix method. If not spcified, incorrect string, or number is
 * out of range, default to use 'mean'.
 * @returns RGB color.
 */
export const mixColors = (
  rgbs: readonly number[][],
  method: Mixing | number = 'mean',
  ...args: unknown[]
): number[] => {
  if (typeof method === 'number') method = MIXING_MODES[method];

  const ops = {
    [MIXING_MODES[0]]: meanMix,
    [MIXING_MODES[1]]: brighterMix,
    [MIXING_MODES[2]]: deeperMix,
    [MIXING_MODES[3]]: softLightBlend,
    [MIXING_MODES[4]]: additive,
    [MIXING_MODES[5]]: mix,
  } as const satisfies Record<Mixing, MixOp>;
  const op: MixOp = ops[method] ?? meanMix;

  let result = [...rgbs[0]];
  let i: number = 1;
  while (i < rgbs.length) {
    // @ts-expect-error
    result = op(result, rgbs[i++], ...args);
  }
  return result;
};
