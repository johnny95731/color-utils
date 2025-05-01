import { rgb2xyz, xyz2rgb } from './ciexyz';
import { matVecProduct3, type Mat3x3 } from '../numeric';
import type { DeepReadonly } from '../helpers';
import { lcc2lch, lch2lcc } from './lch';

/**
 * Convert RGB to Oklab.
 * @param rgb RGB color array.
 * @return Oklab color array.
 */
type rgb2oklab = (rgb: readonly number[]) => number[]
/**
 * Convert Oklab to RGB.
 * @param oklab Oklab color array.
 * @return RGB color array.
 */
type oklab2rgb = (rgb: readonly number[]) => number[]

const [rgb2oklab, oklab2rgb] = (() => {
  /**
   * Matrix for converting CIEXYZ to temp vector lms.
   */
  const XYZ_2_LMS_MAT: DeepReadonly<Mat3x3> = [
    [0.008189330101, 0.003618667424, -0.001288597137],
    [0.000329845436, 0.009293118715,  0.000361456387],
    [0.000482003018, 0.002643662691,  0.006338517070],
  ];
  /**
   * Matrix for converting lms to Oklab.
   */
  const LMS_2_LAB_MAT: DeepReadonly<Mat3x3> = [
    [0.2104542553, 0.7936177850, -0.0040720468],
    [1.9779984951,-2.4285922050,  0.4505937099],
    [0.0259040371, 0.7827717662, -0.8086757660],
  ];
  /**
   * Matrix for converting Oklab to temp vet lms.
   */
  const LAB_2_LMS_MAT: DeepReadonly<Mat3x3> = [
    [0.9999999984505199, 0.39633779217376786, 0.2158037580607588],
    [1.0000000088817607, -0.10556134232365634, -0.0638541747717059],
    [1.000000054672411, -0.08948418209496577, -1.291485537864092]
  ];
  /**
   * Matrix for converting lms to CIEXYZ.
   */
  const LMS_2_XYZ_MAT: DeepReadonly<Mat3x3> = [
    [122.70138511035211,-55.77999806518222, 28.12561489664678],
    [-4.058017842328059, 111.225686961683, -7.167667866560119],
    [-7.63812845057069, -42.14819784180127, 158.6163220440795]
  ];

  const rgb2oklab: rgb2oklab = (rgb: readonly number[]) => {
    const xyz = rgb2xyz(rgb);
    const lms = matVecProduct3(XYZ_2_LMS_MAT, xyz);
    const lms_ = [
      Math.cbrt(lms[0]),
      Math.cbrt(lms[1]),
      Math.cbrt(lms[2]),
    ];
    return matVecProduct3(LMS_2_LAB_MAT, lms_);
  };

  const oklab2rgb = (oklab: readonly number[]) => {
    const lmsp = matVecProduct3(LAB_2_LMS_MAT, oklab);
    const lms = [
      lmsp[0] * lmsp[0]**2,
      lmsp[1] * lmsp[1]**2,
      lmsp[2] * lmsp[2]**2,
    ];
    const xyz = matVecProduct3(LMS_2_XYZ_MAT, lms);
    return xyz2rgb(xyz);
  };
  return [rgb2oklab, oklab2rgb];
})();

export { rgb2oklab, oklab2rgb };

/**
 * Convert RGB to Oklch.
 * @param rgb RGB color array.
 * @return Oklch color array.
 */
export const rgb2oklch = (rgb: readonly number[]) => {
  return lcc2lch(rgb2oklab(rgb));
};


/**
 * Convert Oklch to RGB.
 * @param oklch Oklch color array.
 * @return RGB color array.
 */
export const oklch2rgb = (oklch: readonly number[]) => {
  return oklab2rgb(lch2lcc(oklch));
};
