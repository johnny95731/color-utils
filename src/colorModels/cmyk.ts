
/**
 * Convert RGB to CMYK.
 * @param rgb RGB color array.
 * @return CMYK color array.
 */
export const rgb2cmyk = (rgb: readonly number[]): number[] => {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const max = Math.max(r, g, b);
  return [
    (1 - r / max) * 100 || 0,
    (1 - g / max) * 100 || 0,
    (1 - b / max) * 100 || 0,
    (1 - max) * 100
  ];
};

/**
 * Convert CMYK to RGB.
 * @param cmyk CMYK color array.
 * @return RGB color array.
 */
export const cmyk2rgb = (cmyk: readonly number[]): number[] => {
  const c = cmyk[0] / 100;
  const m = cmyk[1] / 100;
  const y = cmyk[2] / 100;
  const k = cmyk[3] / 100;

  return [
    255 * (1 - Math.min(1, c * (1 - k) + k)),
    255 * (1 - Math.min(1, m * (1 - k) + k)),
    255 * (1 - Math.min(1, y * (1 - k) + k)),
  ];
};
