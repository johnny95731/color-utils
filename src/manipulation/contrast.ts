import { lab2rgb, rgb2lab } from '../colorModels/cielab';
import { mapNonAlpha } from '../colors';
import { map, normalizeOption } from '../helpers';
import { clip, pow, rangeMapping } from '../numeric';


// # Constants
/**
 * Methods of adjusting contrast.
 * @category Contrast
 */
export const CONTRAST_METHODS = [
  'linear',
  'gamma',
  'auto enhancement',
  'auto brightness',
] as const;
/**
 * Support contrast adjusting methods.
 * @category Contrast
 */
export type ContrastMethod = typeof CONTRAST_METHODS[number];

/** @inline */
type ContrastFunction
  = (rgbs: readonly number[][], ...arg: number[]) => number[][];


// # Adjusts contrast.
/**
 * Scale ths values of RGB.
 * @param rgbs RGB arrays.
 * @param c Scaling coefficient.
 * @returns RGB arrays.
 * @example
 * ```ts
 * const rgbs = map(5, () => randRgbGen())
 * scaling(rgbs)
 * ```
 * @category Contrast
 */
export const scaling = (
  rgbs: readonly number[][],
  c: number = 1,
): number[][] => {
  return map(
    rgbs,
    (rgb) => {
      return mapNonAlpha(
        rgb,
        val => clip(val * c, 0, 255),
      );
    },
  );
};

/**
 * Gamma correction to RGB array(s).
 * @param rgbs RGB array(s).
 * @param gamma Gamma coefficient.
 * @returns RGB arrays.
 * @example
 * ```ts
 * const rgbs = map(5, () => randRgbGen())
 * gammaCorrection(rgbs)
 * ```
 * @category Contrast
 */
export const gammaCorrection = (
  rgbs: readonly number[][],
  gamma: number = 1,
): number[][] => {
  return map(
    rgbs,
    rgb => mapNonAlpha(rgb, val => 255 * pow(val / 255, gamma)),
  );
};


/**
 * @function
 * Enhance the contrast by scaling their luminance channel of CIELAB space.
 * @param rgbs
 * @returns RGB arrays.
 * @example
 * ```ts
 * const rgbs = map(5, () => randRgbGen())
 * autoEnhancement(rgbs)
 * ```
 * @category Contrast
 */
export const autoEnhancement = ((
  rgbs: readonly number[][],
): number[][] => {
  let minL = Infinity;
  let maxL = 0;

  let i = 0;
  let temp: number[];

  const result = map(rgbs, (rgb) => {
    const lab = rgb2lab(rgb);
    const l = lab[0];
    if (l < minL) minL = l;
    if (l > maxL) maxL = l;
    return lab;
  });

  for (; i < result.length;) {
    temp = result[i];
    temp[0] = rangeMapping(temp[0], minL, maxL, 0, 100);
    result[i++] = lab2rgb(temp);
  }
  return result;
}) satisfies ContrastFunction;


/**
 * Adjust the luminance channel of CIELAB space by gamma correction that gamma
 * satisfies `((mean of luminance) / 100) ** gamma = coeff`
 *
 * Darker when coeff -> 0 and brighter when coeff -> 1
 *
 * Modified from the paper:
 * BABAKHANI, Pedram; ZAREI, Parham. Automatic gamma correction based on average of brightness. Advances in Computer Science : an International Journal, [S.l.], p. 156-159, nov. 2015. ISSN 2322-5157. Available at: <https://www.acsij.org/index.php/acsij/article/view/390>. Date accessed: 22 May. 2025.
 * @param rgbs
 * @param coeff
 * @returns RGB arrays.
 * @example
 * ```ts
 * const rgbs = map(5, () => randRgbGen())
 * autoBrightness(rgbs)
 * ```
 * @category Contrast
 */
export const autoBrightness = (
  rgbs: readonly number[][],
  coeff: number = 0.7,
): number[][] => {
  let gamma: number;

  let sumL = 0;
  let lab: number[];
  const labs = map(rgbs, (rgb) => {
    lab = rgb2lab(rgb);
    sumL += lab[0];
    return lab;
  });

  if (coeff <= 1e-7) {
    return map(labs, lab => mapNonAlpha(lab, _ => 0)); // eslint-disable-line
  }
  else if (sumL < 1e-5 || coeff === 1) {
    return map(labs, lab => mapNonAlpha(lab, _ => 255)); // eslint-disable-line
  }
  else {
    // sumL / rgbs.length = mean of luminance
    gamma = Math.log(coeff) / Math.log(sumL / rgbs.length / 100);
    return map(labs, (lab) => {
      lab[0] = 100 * pow(lab[0] / 100, gamma);
      return lab2rgb(lab);
    });
  }
};

/**
 * @function
 * Returns a function for enhancing colors.
 * @param method The enhance method name.
 * @returns An enhance function.
 * @category Contrast
 */
export const getAdjuster = (method: ContrastMethod): ContrastFunction => {
  if (method === CONTRAST_METHODS[0]) return scaling;
  if (method === CONTRAST_METHODS[1]) return gammaCorrection;
  if (method === CONTRAST_METHODS[2]) return autoEnhancement;
  if (method === CONTRAST_METHODS[3]) return autoBrightness;
  return autoBrightness;
};


/**
 * Adjust the contrast of array of RGB colors.
 * @param rgbs RGB colors.
 * @param method Adjust method.
 * @param args
 * @returns RGB colors.
 * ```ts
 * const rgbs = map(5, () => randRgbGen())
 * adjContrast(rgbs, 'linear', 1.2)
 * adjContrast(rgbs, 'auto enhancement')
 * ```
 * @category Contrast
 */
export const adjContrast = (
  rgbs: number[][],
  method: ContrastMethod | number,
  ...args: number[]
): number[][] => {
  method = normalizeOption(method, CONTRAST_METHODS);
  const op = getAdjuster(method);
  const result = op(rgbs, ...args);
  return result;
};
