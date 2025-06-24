import { map, normalizeOption } from '../helpers';
import { clip, pow } from '../numeric';
import { hsl2rgb, rgb2hsl } from '../colorModels/hsl';
import { getAlpha } from '../colors';


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
 * Mixing two colors in same color space by given weights.
 *
 * A JavaScript implementation of the CSS `color-mix()` function, excluding the
 * `<color-interpolation-method>` parameter.
 * @param color1 Color array 1.
 * @param color2 Color array 2.
 * @param weight1 Default: `0.5`. Weight of `color1`. Should be in range [0, 1].
 * @param weight2 Default: `1 - weight2`. Weight of `color1`. Should be in range [0, 1].
 */
export const mix = (
  color1: readonly number[],
  color2: readonly number[],
  weight1: number = 0.5,
  weight2: number = 1 - weight1,
) => {
  const len = Math.min(color1.length, color2.length);

  let weightSum = weight1 + weight2;
  let alphaMultipler = weightSum < 1 ? weightSum : 1; // eslint-disable-line
  if (weightSum !== 1) { // Normalize to weight1 + weight2 = 1
    weight1 /= weightSum;
    weight2 /= weightSum;
  }
  // Reduce formula
  weight1 *= getAlpha(color1);
  weight2 *= getAlpha(color2);
  // Interpolated alpha
  weightSum = weight1 + weight2;

  return map(len, i => {
    if (i < len-1)
      return (weight1 * color1[i] + weight2 * color2[i]) / weightSum;
    else
      return weightSum * alphaMultipler;
  });
};

/**
 * Mixing two colors by evaluate their elementwise average.
 * @param color1 Color array.
 * @param color2 Color array.
 */
export const meanMix = (
  color1: readonly number[],
  color2: readonly number[],
) => {
  return mix(color1, color2);
};


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
  const mean = mix(rgb1, rgb2);
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
 * A general blending function using a specified blend function with
 * the "source over" Porter-Duff compositing operator.
 *
 * Note that the base layer before source layer follows the
 * @param rgbDst Destination RGB color (base layer).
 * @param rgbSrc Source RGB color (top layer).
 * @param blendFn Blending function.
 * @returns RGB color after blending.
 */
export const blend = (
  rgbDst: readonly number[],
  rgbSrc: readonly number[],
  blendFn: (dst: number, src: number) => number
): number[] => {
  const alphaSrc = getAlpha(rgbSrc);
  const alphaDst = getAlpha(rgbDst);

  const factorBlend = alphaSrc * alphaDst;
  const factorSrc   = alphaSrc - factorBlend;
  const factorDst   = alphaDst - factorBlend;

  const newAlpha = alphaSrc + alphaDst - factorBlend;

  return map(4, i => {
    if (i < 3) {
      const oSrc = factorSrc * rgbSrc[i];
      const oDst = factorDst * rgbDst[i];
      const oBlend = factorBlend * 255 * blendFn(rgbDst[i] / 255, rgbSrc[i] / 255);
      return (oSrc + oDst + oBlend) / newAlpha;
    } else {
      return newAlpha;
    }
  });
};


/**
 * Blending two colors by soft light mode.
 * @param rgbDst Destination RGB color (base layer).
 * @param rgbSrc Source RGB color (top layer).
 * @param formula Default: 'w3c'. The softlight formula.
 * @returns RGB color.
 */
export const softLightBlend = (
  rgbDst: readonly number[],
  rgbSrc: readonly number[],
  formula: 'photoshop' | 'pegtop' | 'illusions.hu' | 'w3c' = 'w3c'
) => {
  let fn: (a: number, i: number) => number;
  let w3c: number;
  // a: base layer
  // b: top layer
  if (formula === 'photoshop') {
    fn = (a, b) => {
      return (
        b < 0.5 ?
          a * (2 * b + a * (1 - 2 * b)) :
          2 * a * (1 - b) + Math.sqrt(a) * (2 * b - 1)
      );
    };
  } else if (formula === 'pegtop') {
    fn = (a, b) => {
      return a * (2 * b + a * (1 - 2 * b));
    };
  } else if (formula === 'illusions.hu') {
    fn = (a, b) => {
      return pow(a, pow(2, 1 - 2 * b));
    };
  } else { // w3c
    fn = (a, b) => {
      return (
        b <= 0.5 ? // a = 0, b = 1
          a - (1 - 2 * b) * a * (1 - a):
          (
            w3c = a <= 0.25 ? ((16 * a - 12) * a + 4) * a : Math.sqrt(a),
            a + (2 * b - 1) * (w3c - a)
          )
      );
    };
  }
  return blend(rgbDst, rgbSrc, fn);
};

/**
 * Mixing two RGB colors by evaluate their sums, including the alpha channel.
 * @param rgb1 RGB color.
 * @param rgb2 RGB color.
 * @returns RGB color.
 */
export const additive = (
  rgb1: readonly number[],
  rgb2: readonly number[],
): number[] => {
  const alpha1 = getAlpha(rgb1);
  const alpha2 = getAlpha(rgb2);
  const newAlpha = clip(alpha1 + alpha2, 0, 1);
  return map(
    rgb1,
    (val, i) =>
      i < 3 ?
        clip((alpha1 * val + alpha2 * rgb2[i]) / newAlpha, 0, 255) :
        newAlpha,
    4
  );
};


/**
 * Mix array of RGB colors.
 * @param rgbs Array of RGB colors.
 * @param method Default: `'mean'`. Mix method. If not specified, invalid, or
 * out of range, the default is 'mean'.
 * @returns RGB color.
 */
export const mixColors = (
  rgbs: readonly number[][],
  method: Mixing | number = 'mean',
  ...args: unknown[]
): number[] => {
  method = normalizeOption(method, MIXING_MODES);

  const ops = {
    [MIXING_MODES[0]]: meanMix,
    [MIXING_MODES[1]]: brighterMix,
    [MIXING_MODES[2]]: deeperMix,
    [MIXING_MODES[3]]: softLightBlend,
    [MIXING_MODES[4]]: additive,
    [MIXING_MODES[5]]: mix,
  } as const satisfies Record<Mixing, MixOp>;
  const op: MixOp = ops[method];

  let result = [...rgbs[0]];
  let i: number = 1;
  while (i < rgbs.length) {
    // @ts-expect-error
    result = op(result, rgbs[i++], ...args);
  }
  return result;
};
