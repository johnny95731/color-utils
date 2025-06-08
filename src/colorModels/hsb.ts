
/**
 * Calculate hue (H channel of HSL/HSB) from rgb. Also, returns minimum and
 * maximum of rgb.
 * @param rgb RGB array.
 * @return [hue, min = min(r,g,b), max = max(r,g,b), max - min, alpha].
 */
export const hsbHelper = (rgb: readonly number[]): number[] => {
  const alpha = rgb[3];
  const r = rgb[0],
    g = rgb[1],
    b = rgb[2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue;
  if (max === b) {
    hue = (r - g) / delta + 4;
  } else if (max === g)
    hue = (b - r) / delta + 2;
  else // max === r:
    // Move from first condition to last since other two assignment is shorter
    // and delta === 0 will excute first condition.
    hue = (g - b) / delta + (g < b ? 6 : 0);
  return [delta && 60 * hue, min, max, delta, alpha];
};

/**
 * Convert RGB to HSB.
 * @param rgb RGB color array.
 * @return [hue, sat, brightness].
 */
export const rgb2hsb = (rgb: readonly number[]): number[] => {
  const [hue,, max, delta, alpha] = hsbHelper(rgb);
  const sat = 100 * (delta / max);
  return [
    hue,
    sat || 0, // saturation
    // 2.55 = 255 / 100
    max / 2.55, // brightness
    alpha
  ];
};

/**
 * Convert HSB to RGB.
 * @param hsb HSB color array.
 * @return RGB color array.
 */
export const hsb2rgb = (hsb: readonly number[]): number[] => {
  const alpha = hsb[3];
  const hue60 = hsb[0] / 60;
  const sat = hsb[1] / 100;
  const briC = hsb[2] * 2.55; // (hsb[2] / 100) * 255
  const bs = briC * sat;
  const f = (val: number) => (
    val = ((val + hue60) % 6 + 6) % 6, // handle negative hue.
    val = val < 2 ? val : 4 - val, // Shorter Math.min(val, 4-val)
    briC - bs * (val < 1 ? val > 0 ? val : 0 : 1 ) // clip(val, 0, 1)
  );
  return [f(5), f(3), f(1), alpha];
};
