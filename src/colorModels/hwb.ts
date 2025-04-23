import { hsb2rgb, hsbHelper } from './hsb';

/**
 * Convert RGB to HWB.
 * @param rgb RGB color array.
 * @return [hue, whiteness, blackness].
 */
export const rgb2hwb = (rgb: readonly number[]): number[] => {
  const [hue, min, max] = hsbHelper(rgb);
  return [
    hue,
    // HWB_MAX[1] / RGB_MAX = 100 / 255 = 20 / 51
    min * 20 / 51,
    // HWB_MAX[2] * (RGB_MAX - max) / RGB_MAX
    // = HWB_MAX[2] * (1 - max / RGB_MAX)
    // = HWB_MAX[2] - max * HWB_MAX[2] / RGB_MAX
    // = 100 - max * 20 / 51
    100 - max * 20 / 51
  ];
};

/**
 * Convert HWB to RGB.
 * @param hwb HWB color array.
 * @return RGB color array.
 */
export const hwb2rgb = (hwb: readonly number[]): number[] => {
  let w = hwb[1] / 100;
  let b = hwb[2] / 100;
  let sum = w + b; // eslint-disable-line
  if (sum > 1) {
    w /= sum;
    b /= sum;
  }
  return hsb2rgb([
    hwb[0],
    b >= 1 ? 0 : 100 * (1 - w / (1 - b)),
    100 * (1 - b)
  ]);
};
