import { linearRgb2srgb, srgb2linearRgb } from '../colors';
import { dot3 } from '../numeric';
import { rgb2xyzMat, xyz2rgbMat } from './cie-utils';


/**
 * Convert RGB to CIE XYZ.
 * @param rgb RGB color array.
 * @return CIE XYZ color array.
 */
export const rgb2xyz = (rgb: readonly number[]): number[] => {
  const alpha = rgb[3];
  const linear = [
    srgb2linearRgb(rgb[0]),
    srgb2linearRgb(rgb[1]),
    srgb2linearRgb(rgb[2]),
  ];
  return [
    dot3(rgb2xyzMat[0], linear),
    dot3(rgb2xyzMat[1], linear),
    dot3(rgb2xyzMat[2], linear),
    alpha,
  ];
};

/**
 * Convert CIE XYZ to RGB.
 * @param xyz RGB color array.
 * @return RGB color array.
 */
export const xyz2rgb = (xyz: readonly number[]): number[] => {
  const alpha = xyz[3];
  const r = dot3(xyz2rgbMat[0], xyz);
  const g = dot3(xyz2rgbMat[1], xyz);
  const b = dot3(xyz2rgbMat[2], xyz);
  return [
    // clip(r, 0, 1)
    linearRgb2srgb(r < 1 ? r > 0 ? r : 0 : 1),
    linearRgb2srgb(g < 1 ? g > 0 ? g : 0 : 1),
    linearRgb2srgb(b < 1 ? b > 0 ? b : 0 : 1),
    alpha,
  ];
};
