import { hsbHelper } from './hsb';


/**
 * Convert RGB to HSI.
 * @param rgb RGB color array.
 * @return [hue, sat, lum]
 */
export const rgb2hsi = (rgb: readonly number[]): number[] => {
  const [hue, min,,, alpha] = hsbHelper(rgb);
  const intensity = (rgb[0] + rgb[1] + rgb[2]) / 3; // [0, 255]
  const sat = 100 * (1 - min / intensity);
  return [
    hue,
    sat || 0,
    intensity / 2.55, // [0, 100]
    alpha,
  ];
};

/**
 * Convert HSI to RGB.
 * @param hsi HSI array.
 * @return RGB color array.
 */
export const hsi2rgb = (hsi: readonly number[]): number[] => {
  const alpha = hsi[3];
  const hue60 = ((hsi[0] / 60) % 6 + 6) % 6;
  const sat = hsi[1] / 100;
  const lum = hsi[2] / 100;
  const z = 1 - Math.abs(hue60 % 2 - 1);
  const m = lum * (1 - sat) * 255;

  const c0 = (3 * lum * sat) / (1 + z);
  const c = c0 * 255 + m;
  const x = (c0 * z) * 255 + m;

  const indices = [c, x, m, m, x, c, c, x, m, m];
  const hIdx = Math.floor(hue60);
  return [
    indices[hIdx],
    indices[hIdx + 4],
    indices[hIdx + 2],
    alpha,
  ];
};
