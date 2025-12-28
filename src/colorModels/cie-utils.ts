import { cloneDeep, map } from '../helpers';

import type { Mat3x3 } from '../numeric';
import type { ColorSpace } from 'src/colors';

/**
 * Matrix factors for RGB to CIE XYZ.
 *
 * Default matrix based on:
 * - RGB model: RGB
 * - Observer: 2°
 * - Reference white: D65
 */
// @ts-expect-error Initialize by `setReferenceWhite`
export const rgb2xyzMat = [] as Mat3x3;
/**
 * Matrix factors for CIE XYZ to RGB. Equals the inverse matrix of
 * `RGB2XYZ_MATRIX`.
 *
 * Default matrix based on:
 * - RGB model: RGB
 * - Observer: 2°
 * - Reference white: D65
 */
// @ts-expect-error Initialize by `setReferenceWhite`
export const xyz2rgbMat = [] as Mat3x3;
/**
 * Maximums of CIEXYZ.
 */
// @ts-expect-error Initialize by `setReferenceWhite`
export const xyzMax = [] as Array3;

export const xyzSpace = {
  name_: 'XYZ',
  labels_: ['X', 'Y', 'Z'],
  isSupported_: true,
  // Init max_ and white_ in setReferenceWhite
} as ColorSpace;

/**
 * Change the transformation matrix between CIEXYZ and RGB by changing the
 * reference white.
 * @param white Reference white: D65 or D50.
 */
export const setReferenceWhite = (() => {
  /**
   * Matrix for RGB to CIEXYZ under D65 white.
   * The values are multiplied by 100.
   */
  const D65: Mat3x3 = [
    [41.24564, 35.75761, 18.04375],
    [21.26729, 71.51522, 7.21750],
    [1.93339, 11.9192, 95.03041],
  ];
  /**
   * Matrix for RGB to CIEXYZ under D50 white
   * The values are multiplied by 100.
   */
  const D50: Mat3x3 = [
    [43.60747, 38.50649, 14.30804],
    [22.25045, 71.68786, 6.06169],
    [1.39322, 9.71045, 71.41733],
  ];
  const invertMat3x3 = (mat: Mat3x3): Mat3x3 | null => {
    const [
      [a, b, c],
      [d, e, f],
      [g, h, i],
    ] = mat;
    const x = e * i - h * f,
      y = f * g - d * i,
      z = d * h - g * e,
      det = a * x + b * y + c * z;

    return det
      ? [
        [x / det, (c * h - b * i) / det, (b * f - c * e) / det],
        [y / det, (a * i - c * g) / det, (d * c - a * f) / det],
        [z / det, (g * b - a * h) / det, (a * e - d * b) / det],
      ]
      : null;
  };

  const setReferenceWhite = (white: 'D65' | 'D50') => {
    const mat = white === 'D50' ? D50 : D65;
    const rowSum = map(mat, row => row[0] + row[1] + row[2]);
    const invMat = invertMat3x3(mat as Mat3x3);
    if (invMat) {
      rgb2xyzMat.splice(0, 3, ...cloneDeep(mat));
      xyz2rgbMat.splice(0, 3, ...invMat);
      xyzMax.splice(0, 3, ...rowSum);

      xyzSpace.max_ = map(rowSum, val => [0, val]);
      xyzSpace.white_ = white === 'D50' ? 'd50' : 'd65';
    };
  };
  setReferenceWhite('D65'); // Initialize
  return setReferenceWhite;
})();


/**
 * Function that be used in the transformation from CIE XYZ to CIE LAB and to CIE LUV.
 * The function maps [0, 1] into [4/29, 1] and is continuous.
 */
type cieTrans = (xyz: number) => number;

/**
 * Function that be used in the transformation from CIE LAB to CIE XYZ and
 * from CIE LUV to CIE XYZ.
 * The function maps [4/29, 1] into [0, 1]
 */
type cieTransInv = (lab: number) => number;

const [cieTrans, cieTransInv] = (() => {
  const threshInv = 6 / 29; // threshold for labFuncInv
  const thresh = threshInv ** 3; // threshold for labFunc
  const scaling = 841 / 108; // = 1 / (3 * threshInv**2)
  const bias = 4 / 29; // = 16 / 116

  const cieTrans: cieTransInv = (val: number): number => {
    return val > thresh ? Math.cbrt(val) : (scaling * val + bias);
  };
  const cieTransInv: cieTransInv = (val: number) => {
    return val > threshInv ? val * val * val : ((val - bias) / scaling);
  };
  return [cieTrans, cieTransInv];
})();
export { cieTrans, cieTransInv };
