import { hsbHelper } from './hsb';


/**
 * Convert RGB to HSL.
 * @param rgb RGB color array.
 * @return [hue, sat, lum]
 */
export const rgb2hsl = (rgb: readonly number[]): number[] => {
  const [hue, min, max, delta] = hsbHelper(rgb);
  const sum = max + min;
  const sat = delta / (sum < 255 ? sum : 510 - sum) * 100;
  return [
    hue,
    sat || 0,
    // luminance = (max + min) / (2 * 255) * 100
    sum / 5.1
  ];
};

/**
 * Convert HSL to RGB.
 * @param hsl HSL array.
 * @return RGB color array.
 */
export const hsl2rgb = (hsl: readonly number[]): number[] => {
  const hue30 = hsl[0] / 30;
  const lum = hsl[2] * 2.55;
  const a = hsl[1] / 100 * (lum < 127.5 ? lum : 255 - lum);
  const f = (val: number) => (
    val = ((val + hue30) % 12 + 12) % 12, // handle negative hue.
    val = val < 6 ? val - 3 : 9 - val, // Shorter Math.min(val - 3, 9 - val)
    lum - a * (val < 1 ? val > -1 ? val : -1 : 1) // clip(val, -1, 1)
  );
  return [f(0), f(8), f(4)];
};
