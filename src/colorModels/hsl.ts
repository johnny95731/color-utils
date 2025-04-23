import { hsbHelper } from './hsb';


/**
 * Convert RGB to HSL.
 * @param rgb RGB color array.
 * @return [hue, sat, lum]
 */
export const rgb2hsl = (rgb: readonly number[]): number[] => {
  const [hue, min, max, delta] = hsbHelper(rgb);
  const lum = (max + min) / (2 * 255);
  const sat = delta / (1 - Math.abs(2 * lum - 1)) * 100 / 255;
  return [hue, isNaN(sat) ? 0 : sat, 100 * lum];
};

/**
 * Convert HSL to RGB.
 * @param hsl HSL array.
 * @return RGB color array.
 */
export const hsl2rgb = (hsl: readonly number[]): number[] => {
  let [hue, sat, lum] = hsl;
  hue /= 30;
  sat /= 100;
  lum /= 100;
  const a = sat * Math.min(lum, 1-lum);
  const f = (val: number, k = (val + hue) % 12) =>
    255 * (lum - a * Math.max(Math.min(k - 3, 9 - k, 1), -1));
  return [f(0), f(8), f(4)];
};
