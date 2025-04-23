import { cloneDeep, map } from './helpers';
import { dot3, pow, randInt, round } from './numeric';
import { hex2rgb } from './colorModels/hex';
import { rgb2xyz, xyz2rgb } from './colorModels/ciexyz';
import { hsl2rgb, rgb2hsl } from './colorModels/hsl';
import { hsb2rgb, hsbHelper, rgb2hsb } from './colorModels/hsb';
import { hwb2rgb, rgb2hwb } from './colorModels/hwb';
import { cmyk2rgb, rgb2cmyk } from './colorModels/cmyk';
import { lab2rgb, lchab2rgb, rgb2lab, rgb2lchab } from './colorModels/cielab';
import { lchuv2rgb, luv2rgb, rgb2lchuv, rgb2luv } from './colorModels/cieluv';
import { xyzMax } from './colorModels/cie-utils';


export type ColorSpace = {
  /**
   * Name of the color space.
   */
  readonly name_: string,
  /**
   * Name of CSS color function (if exists). Note that this may be repeated, for example,
   * LCH(ab) and LCH(uv) are `lch`.
   */
  readonly css_: string,
  /**
   * Browser support this color value or not.
   */
  isSupport_: boolean,
  /**
   * Label of channels
   */
  labels_: string[],
  /**
   * Range of each channel of a color spaces.
   *
   * The type of values:
   *  - `number[]`: the maximum of each channel.
   *  - `([number, number])[]`: the range of each channel.
   *
   * The most common digits are `255`, `100`, and `360`.
   *  - `255`: Maximum of uint8.
   *  - `100`: The value is percentage.
   *  - `360`: The value is degree.
   *  - others: Usually see this in CIE spaces. The value eather follows the CSS
   *    rules (CIELAB) or represents the extreme value when transform from RGB
   *    to the space.
   */
  readonly max_: readonly number[] | readonly (readonly [number, number])[]
  /**
   * Convert RGB to specified color space.
   * @param x RGB values.
   * @returns specified color space values.
   */
  readonly fromRgb_: (x: readonly number[]) => number[],
  /**
   * Convert specified color space to RGB space.
   * @param x specified color space values.
   * @returns RGB values.
   */
  readonly toRgb_: (x: readonly number[]) => number[],
}
/**
 * Support color spaces.
 */
export const COLOR_SPACES: ColorSpace[] = (() => {
  const HCL_MAX = [360, 100, 100] as const; // For Hue-Chroma-Luminance models.
  const LCH_MAX = [100, 100, 360] as const; // Reverse of HCL: Luminance-Chroma-Hue
  const identityMap = (x: readonly number[]) => [...x];

  const spaces = [
    {
      name_: 'RGB',
      fromRgb_: identityMap,
      toRgb_: identityMap,
      labels_: ['Red', 'Green', 'Blue'],
      max_: map(3, () => 255),
      isSupport_: true,
    },
    {
      name_: 'HSL',
      fromRgb_: rgb2hsl,
      toRgb_: hsl2rgb,
      labels_: ['Hue', 'Saturation', 'Luminance'],
      max_: HCL_MAX,
      isSupport_: true,
    },
    {
      name_: 'HSB',
      fromRgb_: rgb2hsb,
      toRgb_: hsb2rgb,
      labels_: ['Hue', 'Saturation', 'Brightness'],
      max_: HCL_MAX,
      isSupport_: false,
    },
    {
      name_: 'HWB',
      fromRgb_: rgb2hwb,
      toRgb_: hwb2rgb,
      labels_: ['Hue', 'Whiteness', 'Blackness'],
      max_: HCL_MAX,
      isSupport_: true,
    },
    {
      name_: 'CMYK',
      fromRgb_: rgb2cmyk,
      toRgb_: cmyk2rgb,
      labels_: ['Cyan', 'Magenta', 'Yellow', 'Black'],
      max_: map(4, () => 100),
      isSupport_: false,
    },
    {
      name_: 'CIEXYZ',
      fromRgb_: rgb2xyz,
      toRgb_: xyz2rgb,
      labels_: ['X', 'Y', 'Z'],
      max_: xyzMax,
      css_: 'xyz',
      isSupport_: false,
    },
    {
      name_: 'CIELAB',
      fromRgb_: rgb2lab,
      toRgb_: lab2rgb,
      labels_: ['L*', 'a*', 'b*'],
      max_: [[0, 100], [-125, 125], [-125, 125]] as const,
      css_: 'lab',
      isSupport_: true,
    },
    {
      name_: 'CIELUV',
      fromRgb_: rgb2luv,
      toRgb_: luv2rgb,
      labels_: ['L*', 'u*', 'v*'],
      max_: [[0, 100], [-134, 220], [-140, 122]] as const,
      css_: 'luv',
      isSupport_: false,
    },
    {
      name_: 'CIELCH(ab)',
      fromRgb_: rgb2lchab,
      toRgb_: lchab2rgb,
      labels_: ['L*', 'C*', 'h'],
      max_: LCH_MAX,
      css_: 'lch',
      isSupport_: true,
    },
    {
      name_: 'CIELCH(uv)',
      fromRgb_: rgb2lchuv,
      toRgb_: lchuv2rgb,
      labels_: ['L*', 'C*', 'h'],
      max_: LCH_MAX,
      css_: 'lch',
      isSupport_: false,
    },
  ] satisfies (
      Omit<ColorSpace, 'css_' | 'max_'> &
      Partial<Pick<ColorSpace, 'css_'>> &
      { 'max_'?: ColorSpace['max_'] | number}
    )[];

  const isInBrowser = typeof CSS !== 'undefined';
  for (const obj of spaces) {
    obj.css_ ??= obj.name_.toLowerCase();
    if (isInBrowser)
      obj.isSupport_ = CSS.supports('color', `${obj.css_}(0 0 0)`);
  }

  return spaces as ColorSpace[];
})();



/**
 * Return a `COLOR_SPACES` item
 * @param space Item in `COLOR_SPACES` or `COLOR_SPACES[number].name_`
 */
export const getColorSpace = (
  space: ColorSpace | string = COLOR_SPACES[0]
): ColorSpace => {
  if (typeof space === 'string') {
    space = space.toUpperCase();
    return COLOR_SPACES.find(item => item.name_ === space) ?? COLOR_SPACES[0];
  }
  return space;
};

/**
 * If the type of `space.max_` is `number[]`, convert to `[0, max_[number]][]`.
 * Otherwise, return a copy of space.max_.
 * @param space
 * @returns
 */
export const getSpaceRange = (
  space: ColorSpace | string
): [number, number][] => {
  const max_ = getColorSpace(space).max_;
  if (Array.isArray(max_[0])) {
    return cloneDeep(max_ as readonly (readonly [number, number])[]);
  }
  return map(max_ as readonly number[] , val => [0, val]);
};

/**
 * Convert the color to specific space.
 * @param color
 */
export const toSpace = (
  color: readonly number[],
  space: ColorSpace | string,
  toSpace: ColorSpace | string
): number[] => {
  space = getColorSpace(space);
  toSpace = getColorSpace(toSpace);
  if (space === toSpace) return [...color];
  if (space.name_ === 'RGB') return toSpace.fromRgb_(color);
  if (toSpace.name_ === 'RGB') space.toRgb_(color);
  return toSpace.fromRgb_(space.toRgb_(color));

};


/**
 * Return CSS <color> value format: `space(val val val)`.
 * If `checkSupport === true` and the brwoser does not support, then return
 * RGB format.
 * In node enviroment, the `ColorSpace.isSupport_` based on <color-function>
 * value (not include theese spaces that only support by`color()`)
 * MDN <color>: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
 * @param color Color.
 * @param space Color space of color.
 * @param checkSupport Default: `false`. Check the browser support or not. T
 * @param sep Default: `' '`. Seperator of color function.
 * @returns
 */
export const getCssColor = (
  color: number[],
  space: ColorSpace | string = 'RGB',
  checkSupport: boolean = false,
  sep: string = ' '
): string => {
  color = [...color];
  space = getColorSpace(space);
  if (checkSupport && !space.isSupport_) {
    return getCssColor(space.toRgb_(color), COLOR_SPACES[0]);
  }
  return `${space.css_}(${color.join(sep)})`;
};

/**
 * If input a hex, convert to array and return it.
 * If input an array, return it.
 */
export const rgbArraylize = (
  rgb: readonly number[] | string
): readonly number[] => {
  return typeof rgb === 'string' ? hex2rgb(rgb) : rgb;
  // return Array.isArray(rgb) ? rgb : hex2rgb(rgb as string);
};


/**
 * Calculate hue (H channel of HSL/HSB) from rgb. Also, returns minimum and
 * maximum of rgb.
 * @param rgb RGB array.
 */
export const rgb2hue = (rgb: readonly number[]): number => {
  return hsbHelper(rgb)[0];
};


/**
 * Linearlize a sRGB channel.
 * Maps [0, 255] into [0, 1]
 */
export const srgb2linearRgb = (val: number) => {
  return val < 10.31475 ? // 10.31475 = 0.04045 * 255
    val / 3294.6 : // 3294.6 = 12.92 * 255
    pow((val + 14.025) / 269.025, 2.4);
};
/**
 * Gamma correction a sRGB-linear channel
 * Maps [0, 255] into [0, 1]
 */
export const linearRgb2srgb = (val: number) => {
  return val < 0.0031308 ?
    val * 3294.6 :
    pow(val, 1 / 2.4) * 269.025 - 14.025;
};


/**
 * Conver RGB to grayscale. The value is the same as the Y channel of YIQ space.
 * @param rgb Array of RGB color.
 * @return Grayscale [0, 255]
 */
export const rgb2gray = (rgb: readonly number[]): number => (
  0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]
);

/**
 * The rgb is light if the grayscale >= 127.5.
 */
export const isLight = (rgb: readonly number[] | string): boolean => {
  return rgb2gray(rgbArraylize(rgb)) > 127.5;
};

/**
 * Evaluate relative luminance from RGB.
 * @returns Relative luminance, between [0, 1].
 */
export const relativeLuminance = (srgb: string | readonly number[]): number => {
  return dot3(
    map(rgbArraylize(srgb), val => srgb2linearRgb(val)),
    [0.2126, 0.7152, 0.0722]
  );
};

/**
 * Returns the contrast ratio which is defined by WCAG 2.1.
 */
export const getContrastRatio = (
  rgb1: string | readonly number[],
  rgb2: string | readonly number[],
) => {
  const lum1 = relativeLuminance(rgb1);
  const lum2 = relativeLuminance(rgb2);
  const ratio = (lum1 + 0.05) / (lum2 + 0.05);
  return round(ratio < 1 ? 1 / ratio : ratio, 2);
};

/**
 * WCAG 2.2 requirements about contrast ratio of text.
 * https://www.w3.org/TR/WCAG/#contrast-minimum
 */
type ReadbleOptions = {
  /**
   * Text size is large scale or normal scale.
   *
   * Large scale: text with at least 18 point or 14 point bold or font size
   * that would yield equivalent size for Chinese, Japanese and Korean (CJK) fonts.
   * @default false
   */
  isLarge?: boolean
  /**
   * Required to satisfy WCAG level AAA or not.
   *
   * WCAG has three levels of conformance:
   * - Level A is the minimum level.
   * - Level AA includes all Level A and AA requirements. Many organizations strive to meet Level AA.
   * - Level AAA includes all Level A, AA, and AAA requirements.
   *
   * Text contrast ratio has no level A.
   * @default false
   */
  levelAAA?: boolean
}
export const isReadable = (
  rgb1: string | readonly number[],
  rgb2: string | readonly number[],
  options: ReadbleOptions = {}
) => {
  const { levelAAA, isLarge } = options;
  const threshold = (
    levelAAA && !isLarge ? 7 :
      !levelAAA && isLarge ? 3 :
        4.5
  );
  // Equals to
  // if (levelAAA && !isLarge) threshold = 7;
  // else if (!levelAAA && isLarge) threshold = 3;
  // else threshold = 4.5;

  return getContrastRatio(rgb1, rgb2) >= threshold;
};


/**
 * Generate an RGB color.
 * @return [R, G, B]
 */
export const randRgbGen = () => map(3, () => randInt(255));
