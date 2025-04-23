
/**
 * Calculate hue (H channel of HSL/HSB) from rgb. Also, returns minimum and
 * maximum of rgb.
 * @param rgb RGB array.
 * @return [hue, min = min(r,g,b), max = max(r,g,b), max - min].
 */
export const hsbHelper = (rgb: readonly number[]): number[] => {
  const r = rgb[0],
    g = rgb[1],
    b = rgb[2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  // const delta = max - min;
  let hue;
  if (!delta) hue = 0;
  else if (max === r) {
    hue = (g - b) / delta;
    if (hue < 0) hue += 6;
  } else if (max === g)
    hue = (b - r) / delta + 2;
  else // max === b:
    hue = (r - g) / delta + 4;
  return [60 * hue, min, max, delta];
};

/**
 * Convert RGB to HSB.
 * @param rgb RGB color array.
 * @return [hue, sat, brightness].
 */
export const rgb2hsb = (rgb: readonly number[]): number[] => {
  const [hue,, max, delta] = hsbHelper(rgb);
  const sat = 100 * (delta / max);
  return [
    hue,
    isNaN(sat) ? 0 : sat, // saturation
    max * 20 / 51 // brightness
  ];
};

/**
 * Convert HSB to RGB.
 * @param hsb HSB color array.
 * @return RGB color array.
 */
export const hsb2rgb = (hsb: readonly number[]): number[] => {
  let [hue, sat, bri] = hsb;
  hue /= 60;
  sat /= 100;
  bri /= 100;
  const f = (val: number, k = (val + hue) % 6) =>
    255 * (bri - sat * bri * Math.max(Math.min(k, 4 - k, 1), 0));
  return [f(5), f(3), f(1)];
};
