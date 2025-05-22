import { map } from '../helpers';
import { clip, pow, rangeMapping } from '../numeric';
import { lab2rgb, rgb2lab } from '../colorModels/cielab';


// # Constants
/**
 * Methods of adjusting contrast.
 */
export const CONTRAST_METHODS = [
  'linear',
  'gamma',
  'auto enhancement',
  'auto brightness'
] as const;
/**
 * Support contrast adjusting methods.
 */
export type ContrastMethod = typeof CONTRAST_METHODS[number];

export type ContrastFunction = (rgbs: readonly number[][], ...arg: number[]) => number[][]



// # Adjusts contrast.
/**
 * Scale ths values of RGB.
 * @param rgbs RGB arrays.
 * @param c Scaling coefficient.
 * @returns RGB arrays.
 */
export const scaling = (rgbs: readonly number[][], c: number = 1): number[][] => {
  return map(
    rgbs,
    (rgb) => {
      return map(
        rgb,
        val => clip(val * c, 0, 255)
      );
    }
  );
};

/**
 * Gamma correction to RGB array(s).
 * @param rgbs RGB array(s).
 * @param gamma Gamma coefficient.
 * @returns RGB arrays.
 */
export const gammaCorrection = (
  rgbs: readonly number[][],
  gamma: number = 1
): number[][] => {
  return map(
    rgbs,
    rgb => map(rgb, (val) => 255 * pow(val / 255, gamma))
  );
};


/**
 * Enhance the contrast by scaling their luminance channel of CIELAB space.
 * @param rgbs
 * @returns RGB arrays.
 */
export const autoEnhancement: ContrastFunction = (rgbs: readonly number[][]): number[][] => {
  let minL: number = Infinity, maxL: number = 0,
    i = 0, temp: number[];

  const labs = map(rgbs, rgb => {
    const lab = rgb2lab(rgb);
    const l = lab[0];
    if (l < minL) minL = l;
    if (l > maxL) maxL = l;
    return lab;
  });

  for (; i < labs.length;) {
    temp = labs[i];
    temp[0] = rangeMapping(temp[0], minL, maxL, 0, 100);
    labs[i++] = lab2rgb(temp);
  }
  return labs;
};


/**
 * Adjust the luminance channel of CIELAB space by gamma correction that gamma
 * satisfies `((mean of luminance) / 100) ** gamma = coeff`
 *
 * Darker when coeff -> 0 and brighter when coeff -> 1
 *
 * Modify from the paper:
 * BABAKHANI, Pedram; ZAREI, Parham. Automatic gamma correction based on average of brightness. Advances in Computer Science : an International Journal, [S.l.], p. 156-159, nov. 2015. ISSN 2322-5157. Available at: <https://www.acsij.org/index.php/acsij/article/view/390>. Date accessed: 22 May. 2025.
 * @param rgbs
 * @param coeff
 * @returns RGB arrays.
 */
export const autoBrightness: ContrastFunction = (
  rgbs: readonly number[][],
  coeff: number = 0.7
): number[][] => {
  let op: (val: number[], i: number) => number[];

  let sumL = 0;
  let lab: number[];
  const labs = map(rgbs, rgb => {
    lab = rgb2lab(rgb);
    sumL += lab[0];
    return lab;
  });

  if (coeff <= 1e-7) {
    op = () => [0, 0, 0];
  } else if (sumL < 1e-5 || coeff === 1) {
    op = () => [255, 255, 255];
  } else {
    const gamma = Math.log(coeff) / Math.log(sumL / rgbs.length / 100);
    op = lab => {
      lab[0] = 100 * pow(lab[0] / 100, gamma);
      return lab2rgb(lab);
    };
  }

  return map(labs, op);
};

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
 * @param space Default: 'RGB'. Color space of input and output colors.
 * @param args
 * @returns RGB colors.
 */
export const adjContrast = (
  rgbs: number[][],
  method: ContrastMethod | number,
  ...args: number[]
): number[][] => {
  if (typeof method === 'number') method = CONTRAST_METHODS[method];
  if (!method) method = 'linear';

  const op = getAdjuster(method);

  const result =  op(rgbs, ...args);

  return result;
};
