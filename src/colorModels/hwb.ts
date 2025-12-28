import { hsb2rgb, hsbHelper } from './hsb';

/**
 * Convert RGB to HWB.
 * @param rgb RGB color array.
 * @return [hue, whiteness, blackness].
 */
export const rgb2hwb = (rgb: readonly number[]): number[] => {
  const [hue, min, max,, alpha] = hsbHelper(rgb);
  return [
    hue,
    min / 2.55,
    100 - max / 2.55,
    alpha,
  ];
};

/**
 * Convert HWB to RGB.
 * @param hwb HWB color array.
 * @return RGB color array.
 */
export const hwb2rgb = (hwb: readonly number[]): number[] => {
  const alpha = hwb[3];
  const b = hwb[2];
  let w = hwb[1];
  let temp = 100 - b;
  if (w + b > 100) {
    temp = w /= (w + b) / 100;
  }
  return hsb2rgb([
    hwb[0],
    100 - 100 * w / temp || 0,
    temp,
    alpha,
  ]);
};
