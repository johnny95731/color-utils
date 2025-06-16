import { map, normalizeOption } from '../helpers';
import { hsb2rgb } from '../colorModels/hsb';


// # Constants
/**
 * Methods of adjusting contrast.
 */
export const HARMONY_METHODS = [
  'shades', 'tints', 'tones', // change saturation and/or luminance
  'analogous',
  'triadic',
  'square',
  'complementary',
  'split complementary',
  'tetradic1', 'tetradic2', 'tetradic3'
] as const;
/**
 * Support harmony adjusting methods.
 */
export type Harmony = typeof HARMONY_METHODS[number];
/**
 * Harmony methods which by changing the hue.
 */
export type HueHarmony = Exclude<Harmony, 'shades' | 'tints' | 'tones'>;


export type HarmonyOp = (
  ((primaryHsb: readonly number[]) => number[][]) |
  ((primaryHsb: readonly number[], num?: number) => number[][])
)


// # Harmonize
/**
 * Generate a harmony palette from a primary color (in HSB).
 *
 * The hues of palette are [
 *   primary + degs[0], primary + degs[1], ...
 * ]
 * @param primary Primary color. Can be HSB, HSL, HWB color, or color space that
 * first channel represents hue.
 * @param degs Shift degrees.
 * @returns HSL/HSB/HWB color (same as input).
 */
export const shiftHue = (
  primary: readonly number[],
  degs: number[]
): number[][] => {
  const [h, s, b, a] = primary;
  // start from 1 'cause first color is primary color.
  return map(degs, (deg) => [h + deg, s, b, a]);
};

// ## Saturation/Brightness harmony
/**
 * Generate gradient that decreasing in brightness.
 */
export const shades = (hsb: readonly number[], num: number = 6) => {
  const [h, s, b, a] = hsb;
  return map(
    num,
    i => [h, s, b * (1 - i / num), a],
  );
};

/**
 * Generate gradient that decreasing in saturation.
 */
export const tints = (hsb: readonly number[], num: number = 6) => {
  const [h, s, b, a] = hsb;
  return map(
    num,
    i => [h, s * (1 - i / num), b, a],
  );
};

/**
 * Generate gradient that decreasing in both saturation and brightness.
 */
export const tones = (hsb: readonly number[], num: number = 6) => {
  const [h, s, b, a] = hsb;
  return map(
    num,
    i => (i = (1 - i / num), [h, s * i, b * i, a]),
  );
};

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
} as const satisfies Record<HueHarmony, number[]> & Record<Exclude<Harmony, HueHarmony>, HarmonyOp>;


/**
 * Generate harmony colors. Returns RGB colors.
 * @param hsb Primary color in HSB space. Calculate other colors base on this color.
 * @param method Harmony method.
 * @param args Argument `num` for `shades`, `tints`, and `tones`.
 * @returns RGB colors.
 */
export const harmonize = (
  hsb: readonly number[],
  method: Harmony | number,
  args?: number
): number[][] => {
  method = normalizeOption(method, HARMONY_METHODS, 'analogous');

  const op = hueDegs[method];
  const result = Array.isArray(op) ?
    shiftHue(hsb, op) :
    op(hsb, args);
  return map(result, hsb => hsb2rgb(hsb));
};
