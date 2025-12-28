import { cieTrans, cieTransInv, xyzMax } from './cie-utils';
import { rgb2xyz, xyz2rgb } from './ciexyz';
import { lcc2lch, lch2lcc } from './lch';


/**
 * Convert RGB to CIE LUV.
 * @param rgb RGB color array.
 * @return CIE LUV color array.
 */
type rgb2luv = (xyz: readonly number[]) => number[];

/**
 * Convert CIE LUV to RGB.
 * Note that the change of luminance may be non-intutive.
 * For example, luv2rgb([14, -70, -90]) is [255, 0, 0], but
 * luv2rgb([15, -70, -90]) is [0, 255, 255].
 * @param luv CIE LUV color array.
 * @return RGB color array.
 */
type luv2rgb = (luv: readonly number[]) => number[];

const [rgb2luv, luv2rgb] = (() => {
  const weightedSum = (xyz: readonly number[]) => {
    return xyz[0] + 15 * xyz[1] + 3 * xyz[2];
  };

  const rgb2luv: rgb2luv = (rgb: readonly number[]): number[] => {
    const alpha = rgb[3];
    const xyz = rgb2xyz(rgb);
    const wSumMax = weightedSum(xyzMax);
    const u0 = 4 * xyzMax[0] / wSumMax;
    const v0 = 9 * xyzMax[1] / wSumMax;

    const L = 116 * cieTrans(xyz[1] / xyzMax[1]) - 16;
    const wSum = 1 / weightedSum(xyz);
    const u_ = 4 * xyz[0] * wSum;
    const v_ = 9 * xyz[1] * wSum;
    return [
      L,
      13 * L * (u_ - u0) || 0,
      13 * L * (v_ - v0) || 0,
      alpha,
    ];
  };

  const luv2rgb: luv2rgb = (luv: readonly number[]): number[] => {
    if (!luv[0]) return [0, 0, 0, luv[3]];
    const alpha = luv[3];
    const lum = luv[0];
    const u = luv[1];
    const v = luv[2];

    const wSumMax = 1 / weightedSum(xyzMax);
    const u0 = 4 * xyzMax[0] * wSumMax;
    const v0 = 9 * xyzMax[1] * wSumMax;

    const Y = cieTransInv((lum + 16) / 116) * xyzMax[1];

    const a = 52 / (u + 13 * lum * u0);
    const d = Y * 39 / (v + 13 * lum * v0);

    const X = d / a;
    const xyz = [
      3 * d / a,
      Y, // X and Z does not be divided by maximums
      lum * d - X - 5 * Y,
      alpha,
    ];
    return xyz2rgb(xyz);
  };
  return [rgb2luv, luv2rgb];
})();
export { rgb2luv, luv2rgb };

/**
 * Convert RGB to CIE LCh(uv).
 * @param rgb RGB color array.
 * @return CIE LCh(uv) color array.
 */
export const rgb2lchuv = (rgb: readonly number[]): number[] => {
  return lcc2lch(rgb2luv(rgb));
};

/**
 * Convert CIE LCh(uv) to RGB.
 * @param lch CIE LCh(uv) color array.
 * @return RGB color array.
 */
export const lchuv2rgb = (lch: readonly number[]): number[] => {
  return luv2rgb(lch2lcc(lch));
};
