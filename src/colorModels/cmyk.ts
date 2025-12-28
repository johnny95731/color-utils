/**
 * Convert RGB to CMYK.
 * @param rgb RGB color array.
 * @return CMYK color array.
 */
export const rgb2cmyk = (rgb: readonly number[]): number[] => {
  const alpha = rgb[3];
  const r = rgb[0];
  const g = rgb[1];
  const b = rgb[2];
  const max = Math.max(r, g, b) * 0.01;
  // r / (Math.max(r, g, b) * .01) = (r / Math.max(r, g, b)) * 100
  return [
    100 - r / max || 0,
    100 - g / max || 0,
    100 - b / max || 0,
    100 - max / 0.0255, // multiply 10000/255 = divide .0255
    alpha,
  ];
};

/**
 * Convert CMYK to RGB.
 * @param cmyk CMYK color array.
 * @return RGB color array.
 */
export const cmyk2rgb = (cmyk: readonly number[]): number[] => {
  const alpha = cmyk[4];
  const white255 = 255 - cmyk[3] * 2.55; // cmyk[3] = black
  let r = 1 - cmyk[0] / 100;
  let g = 1 - cmyk[1] / 100;
  let b = 1 - cmyk[2] / 100;
  // Prevent minifying by terser. Because minifying make it slower:
  // return [
  //   white255 * (1 - cmyk[0] / 100),
  // ]
  r *= white255;
  g *= white255;
  b *= white255;
  return [r, g, b, alpha];
};
