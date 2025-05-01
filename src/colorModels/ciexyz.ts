import { clip, dot3, matVecProduct3 } from '../numeric';
import { linearRgb2srgb, srgb2linearRgb, } from '../colors';
import { rgb2xyzMat, xyz2rgbMat } from './cie-utils';


/**
 * Convert RGB to CIE XYZ.
 * @param rgb RGB color array.
 * @return CIE XYZ color array.
 */
export const rgb2xyz = (rgb: readonly number[]): number[] => {
  const linear = [
    srgb2linearRgb(rgb[0]),
    srgb2linearRgb(rgb[1]),
    srgb2linearRgb(rgb[2]),
  ];
  return matVecProduct3(rgb2xyzMat, linear);
};

/**
 * Convert CIE XYZ to RGB.
 * @param xyz RGB color array.
 * @return RGB color array.
 */
export const xyz2rgb = (xyz: readonly number[]): number[] => {
  return [
    linearRgb2srgb(clip(dot3(xyz2rgbMat[0], xyz), 0, 1)),
    linearRgb2srgb(clip(dot3(xyz2rgbMat[1], xyz), 0, 1)),
    linearRgb2srgb(clip(dot3(xyz2rgbMat[2], xyz), 0, 1)),
  ];
};
