import { deg2rad, rad2deg, l2Norm3 } from '../numeric';

/**
 * Convert Luminance-Chroma-Chroma model to LCh Luminance-Chroma-Hue model.
 *
 * @param lcc Color model that is [luminance, chroma1, chroma2]
 * @returns Corresponding Luminance-Chroma-Chroma model
 */
type lcc2lch = (lcc: readonly number[]) => number[]
/**
 * Convert LCh Luminance-Chroma-Hue model to Luminance-Chroma-Chroma model.
 * @param lch Luminance-Chroma-Chroma model.
 * @returns [luminance, chroma1, chroma2] color model.
 */
type lch2lcc = (lch: readonly number[]) => number[]

export const lcc2lch: lcc2lch = (lcc: readonly number[]): number[] => {
  const c1 = lcc[1];
  const c2 = lcc[2];
  const deg = rad2deg(Math.atan2(c2, c1));
  return [
    lcc[0],
    l2Norm3(c1, c2),
    deg < 0 ? deg + 360 : deg,
    lcc[3]
  ];
};
export const lch2lcc: lch2lcc = (lch: readonly number[]): number[] => {
  const rad = deg2rad(lch[2]);
  return [
    lch[0],
    lch[1] * Math.cos(rad),
    lch[1] * Math.sin(rad),
    lch[3]
  ];
};
