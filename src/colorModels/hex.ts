
const hexMatcher = /^#?(([\dA-F]{3}){1,2})$/i;
/**
 * Verify the string whether is a (3 channel, no alpha channel) Hex color.
 * @param str String that need to be verified.
 * @return Validity of string.
 */
export const isValidHex = (str: string): boolean => {
  return hexMatcher.test(str);
};


/**
 * Convert RGB to Hex.
 * @param rgb RGB color array.
 * @return Hex color.
 */
export const rgb2hex = (
  rgb: readonly number[]
): string => {
  // `a << n` equals a * 2**n.
  // (1<<24).toString(16) convert to '1000000'. This will pad 0.
  const hex = '#' + (
    1 << 24 | Math.round(rgb[0]) << 16 | Math.round(rgb[1]) << 8 | Math.round(rgb[2])
  ).toString(16).slice(1);
  return hex.toUpperCase();
};

/**
 * Convert Hex color to RGB color.
 * @param hex Hex color string. Note that this function will not hex hex is valid or not.
 * @return rgb
 */
export const hex2rgb = (hex: string): number[] => {
  const hexMatch = hexMatcher.exec(hex);
  if (!hexMatch) return [0, 0, 0];

  hex = hexMatch[1];
  if (hex.length === 3)
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  // .slice is slower
  const num = parseInt(hex, 16);
  return [num >> 16, (num >> 8) & 0xFF, num & 0xFF];
};
