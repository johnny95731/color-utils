import { map } from '../helpers';
import { clip, elementwiseMean, pow } from '../numeric';
import { getColorSpace } from '../colors';
import { hsl2rgb, rgb2hsl } from '../colorModels/hsl';
import type { ColorSpace } from '../colors';


/**
 * Support mix modes.
 */
export const MIXING_MODES = [
  'mean', 'brighter', 'deeper', 'soft light', 'additive'
] as const;

/**
 * Support mix modes.
 */
export type Mixing = typeof MIXING_MODES[number];

export type MixOp =
((c1: readonly number[], c2: readonly number[]) => number[]) |
((c1: readonly number[], c2: readonly number[], space?: ColorSpace | string) => number[]);


/**
 * Mixing two colors by evaluate their elementwise average.
 * @param color1 Color array.
 * @param color2 Color array.
 */
export const meanMix: MixOp = elementwiseMean;


// Simply mix and adjust it.
/**
 * Take the mean mix of color1 and color2 and do gamma correction to adjust
 * saturation and luminance.
 * @param color1 A color array.
 * @param color2 A color array.
 * @param space Default: 'RGB'. Color space of input and output colors.
 * @param gamma Gamma-corection coefficient. The color is deeper if gamma > 1.
 *   The color is brighter if gamma < 1.
 */
export const gammaMix = (
  color1: readonly number[],
  color2: readonly number[],
  space: ColorSpace | string = 'RGB',
  gamma: number = 0.3,
): number[] => {
  const { toRgb_, fromRgb_ } = getColorSpace(space);

  const mean = elementwiseMean(toRgb_(color1), toRgb_(color2));
  const hsl = rgb2hsl(mean);

  const newSat = 100 * pow(hsl[1] / 100, gamma);
  const newLum = 100 * pow(hsl[2] / 100, gamma);
  return fromRgb_(hsl2rgb([hsl[0], newSat, newLum]));
};

export const brighterMix: MixOp = (
  color1: readonly number[],
  color2: readonly number[],
  space?: ColorSpace | string,
) =>
  gammaMix(color1, color2, space, 0.3);

export const deeperMix: MixOp = (
  color1: readonly number[],
  color2: readonly number[],
  space?: ColorSpace
) =>
  gammaMix(color1, color2, space, 1.5);


// Blend-mode methods.
/**
 * Blending two colors by soft light.
 * @param color1 Color 1.
 * @param color2 Color 2.
 * @param space Default: 'RGB'. Color space of input and output colors.
 * @param formula Default: 'w3c'. The softlight formula.
 */
export const softLightBlend: MixOp = (
  color1: readonly number[],
  color2: readonly number[],
  space: ColorSpace | string = 'RGB',
  formula: 'photoshop' | 'pegtop' | 'illusions.hu' | 'w3c' = 'w3c'
) => {
  const { fromRgb_, toRgb_ } = getColorSpace(space);
  color1 = map(toRgb_(color1), val => val / 255);
  color2 = map(toRgb_(color2), val => val / 255);

  let fn: (a: number, i: number) => number;
  // temp store color2[i].
  // 'a' and 'b' to simply compare with formula
  let b: number;
  let w3c: number;
  if (formula === 'photoshop') {
    fn = (a, i) => {
      b = color2[i];
      return 255 * (
        b < 0.5 ?
          a * (2 * b + a * (1 - 2 * b)) :
          2 * a * (1 - b) + Math.sqrt(a) * (2 * b - 1)
      );
    };
  } else if (formula === 'pegtop') {
    fn = (a, i) => {
      b = color2[i];
      return 255 * a * (2 * b + a * (1 - 2 * b));
    };
  } else if (formula === 'illusions.hu') {
    fn = (a, i) => {
      b = color2[i];
      return 255 * a**(2**(1 - 2 * b));
    };
  } else { // w3c
    fn = (a, i) => {
      b = color2[i];
      w3c = a <= 0.25 ? ((16 * a - 12) * a + 4) * a: Math.sqrt(a);
      return 255 * (
        b <= 0.5 ?
          a - (1 - 2 * b) * a * (1 - a):
          a + (2 * b - 1) * (w3c - a)
      );
    };
  }
  return fromRgb_(color1.map(fn));
};

/**
 * Mixing two colors by evaluate their RGB sum.
 * @param color1 Color array.
 * @param color2 Color array.
 * @param space Default: 'RGB'. Color space of input and output colors.
 */
export const additive: MixOp = (
  color1: readonly number[],
  color2: readonly number[],
  space: ColorSpace | string = 'RGB',
): number[] => {
  const { toRgb_, fromRgb_ } = getColorSpace(space);
  const rgb1 = toRgb_(color1);
  const rgb2 = toRgb_(color2);
  const newColor = map(
    rgb1,
    (val, i) => clip(val + rgb2[i], 0, 255),
    3
  );
  return fromRgb_(newColor);
};


/**
 * Mix or blend array of colors
 * @param color Color arrays.
 * @param method Mix method. If not spcified, incorrect string, or number is
 * out of range, default to use 'mean'.
 * @param space Default: 'RGB'. Color space of input and output colors.
 */
export const mixColors = (
  colors: readonly number[][],
  method: Mixing | number = 'mean',
  space: ColorSpace | string = 'RGB',
): number[] => {
  if (typeof method === 'number') method = MIXING_MODES[method];

  let result = colors[0];
  let i: number = 1;

  const ops = {
    [MIXING_MODES[0]]: meanMix,
    [MIXING_MODES[1]]: brighterMix,
    [MIXING_MODES[2]]: deeperMix,
    [MIXING_MODES[3]]: softLightBlend,
    [MIXING_MODES[4]]: additive
  } as const satisfies Record<Mixing, MixOp>;
  const op = ops[method] ?? meanMix;

  while (i < colors.length) {
    result = op(result, colors[i++], space);
  }
  return result;
};
