import { alphaNormalize } from '../colors';


const hexMatcher = /^#?([0-9a-f]{3,8})$/i;
/**
 * Verify the string whether is a (3 channel, no alpha channel) Hex color.
 * @param str String that need to be verified.
 * @return Validity of string.
 */
export const isValidHex = (str: string): boolean => {
  const len = hexMatcher.exec(str)?.[1].length;
  return len != null && len !== 5 && len !== 7;
};


/**
 * Convert RGB to Hex.
 * @param rgb RGB color array.
 * @return Hex color.
 */
export const rgb2hex = (
  rgb: readonly number[],
): string => {
  let alphaNum = alphaNormalize(rgb[3]);
  let alphaHex: string;
  // `a << n` equals `a * 2**n`.
  // (16777216).toString(16) === '1000000'. Pads '0' from the left.
  // Do bitwise operation to (a + 0.5) equals to do rounding.
  let hex = (
    16777216 | (rgb[0] + 0.5) << 16 | (rgb[1] + 0.5) << 8 | (rgb[2] + 0.5)
  ).toString(16).slice(1);
  if (alphaNum < 1) {
    alphaNum = (alphaNum * 255 + 0.5) | 0;
    alphaHex = alphaNum.toString(16);
    hex += alphaNum < 16 ? '0' + alphaHex : alphaHex;
  }
  return ('#' + hex).toUpperCase();
};

/**
 * Convert Hex color to RGB color.
 * @param hex Hex code. If the input is not valid, outputs `[0,0,0,1]`.
 * @return rgb
 */
export const hex2rgb = (hex: string): number[] => {
  const hexMatch = hexMatcher.exec(hex);
  const len = hexMatch?.[1].length;
  if (!len || len === 5 || len === 7) return [0, 0, 0, 1];
  const num = parseInt(hexMatch[1], 16);
  let shift;

  if (len < 5) { // 3-digit or 4-digit
    // 15 = 0xF, a single hex char.
    // parseInt('9A3', 16) & 15 = parseInt('3', 16) = get last hex digit.
    // parseInt('A', 16) * 17 = parseInt('AA', 16) = to 2 repeated hex digit
    // parseInt('E5B', 16) >>> 4 = parseInt('E5', 16) = right shift 1 hex digit.
    shift = len < 4 ? 8 : 12;
    return [ // 3-digit / 4-digit
      ((num >> shift) & 15) * 17, // right shift 8 / 12
      ((num >> (shift - 4)) & 15) * 17, // right shift 4 / 8
      ((num >> (shift - 8)) & 15) * 17, // right shift 0 / 4
      len > 3 ? (num & 15) * 17 / 255 : 1,
    ];
  }
  shift = len < 8 ? 16 : 24;
  return [ // 6-digit / 8-digit
    (num >> shift) & 255, // right shift 16 / 24
    (num >> (shift - 8)) & 255, // right shift 8  / 16
    (num >> (shift - 16)) & 255, // right shift 0  / 8
    len > 6 ? (num & 255) / 255 : 1,
  ];
};
