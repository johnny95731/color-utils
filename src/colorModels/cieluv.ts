import { lcc2lch, lch2lcc } from './lch';
import { rgb2xyz, xyz2rgb } from './ciexyz';
import { cieTrans, cieTransInv, xyzMax,  } from './cie-utils';


/**
 * Convert RGB to CIE LUV.
 * @param rgb RGB color array.
 * @return CIE LUV color array.
 */
type rgb2luv = (xyz: readonly number[]) => number[]

/**
 * Convert CIE LUV to RGB.
 * Note that the change of luminance may be non-intutive.
 * For example, luv2rgb([14, -70, -90]) is [255, 0, 0], but
 * luv2rgb([15, -70, -90]) is [0, 255, 255].
 * @param luv CIE LUV color array.
 * @return RGB color array.
 */
type luv2rgb = (luv: readonly number[]) => number[]

const [rgb2luv, luv2rgb] = (() => {
  const uTransform = (xyz: readonly number[]) => (
    4 * xyz[0] / (xyz[0] + 15 * xyz[1] + 3 * xyz[2])
  );
  const vTransform = (xyz: readonly number[]) => (
    9 * xyz[1] / (xyz[0] + 15 * xyz[1] + 3 * xyz[2])
  );

  const rgb2luv: rgb2luv = (rgb: readonly number[]): number[] => {
    const xyz = rgb2xyz(rgb);
    const u0 = uTransform(xyzMax);
    const v0 = vTransform(xyzMax);

    const L = 116 * cieTrans(xyz[1] / xyzMax[1]) - 16;
    const u_ = uTransform(xyz);
    const v_ = vTransform(xyz);
    return [
      L,
      isNaN(u_) ? 0 : 13 * L * (u_ - u0),
      isNaN(v_) ? 0 : 13 * L * (v_ - v0),
    ];
  };

  const luv2rgb: luv2rgb = (luv: readonly number[]): number[] => {
    if (!luv[0]) return [0, 0, 0];
    const [lum, u, v] = luv;
    const u0 = uTransform(xyzMax);
    const v0 = vTransform(xyzMax);

    const u_ = u / (13 * lum) + u0;
    const v_ = v / (13 * lum) + v0;

    const Y = cieTransInv((lum + 16) / 116);
    const xyz = [
      2.25 * u_ / v_ * Y * 100,
      Y * xyzMax[1], // X and Z does not be divided by maximums
      (3 - 0.75 * u_ - 5 * v_) / v_ * Y * 100,
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
