import { lcc2lch, lch2lcc } from './lch';
import { rgb2xyz, xyz2rgb } from './ciexyz';
import { cieTrans, cieTransInv, xyzMax } from './cie-utils';

/**
 * Convert RGB to CIE Lab.
 * @param rgb RGB color array.
 * @return CIE Lab color array.
 */
export const rgb2lab = (rgb: readonly number[]): number[] => {
  const alpha = rgb[3];
  const xyz = rgb2xyz(rgb);
  const fy = cieTrans(xyz[1] / xyzMax[1]);
  return [
    116 * fy - 16,
    500 * (cieTrans(xyz[0] / xyzMax[0]) - fy),
    200 * (fy - cieTrans(xyz[2] / xyzMax[2])),
    alpha
  ];
};

/**
 * Convert CIE LAB to RGB.
 * @param lab CIE LAB color array.
 * @return RGB color array.
 */
export const lab2rgb = (lab: readonly number[]): number[] => {
  const alpha = lab[3];
  const c1 = (lab[0] + 16) / 116,
    c2 = c1 + lab[1] / 500,
    c3 = c1 - lab[2] / 200;
  return xyz2rgb([
    cieTransInv(c2) * xyzMax[0],
    cieTransInv(c1) * xyzMax[1],
    cieTransInv(c3) * xyzMax[2],
    alpha
  ]);
};

/**
 * Convert RGB to CIE LCh(ab).
 * @param rgb RGB color array.
 * @return CIE LCh(ab) color array.
 */
export const rgb2lchab = (rgb: readonly number[]): number[] => {
  return lcc2lch(rgb2lab(rgb));
};

/**
 * Convert CIE LCh(ab) to RGB.
 * @param lch CIE LCh(ab) color array.
 * @return RGB color array.
 */
export const lchab2rgb = (lch: readonly number[]): number[] => {
  return lab2rgb(lch2lcc(lch));
};
