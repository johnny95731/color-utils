import { clip, dot3 } from '../numeric';
import { linearRgb2srgb, srgb2linearRgb, } from '../colors';
import { rgb2xyzMat, xyz2rgbMat } from './cie-utils';


/**
 * Convert RGB to CIE XYZ.
 * @param rgb RGB color array.
 * @return CIE XYZ color array.
 */
export const rgb2xyz = (rgb: readonly number[]): number[] => {
  const row1 = rgb2xyzMat[0];
  const row2 = rgb2xyzMat[1];
  const row3 = rgb2xyzMat[2];

  let i = 0;
  let x = 0, y = 0, z = 0;
  let linear: number;
  for (; i < 3;) {
    linear = srgb2linearRgb(rgb[i]);
    // Same as `dot3(rgb2xyzMat[number], linearRgb)`
    x += row1[i] * linear;
    y += row2[i] * linear;
    z += row3[i++] * linear;
  }
  return [x, y, z];
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
