import { map } from './helpers';
import { clip, dot3, pow, randInt, round } from './numeric';
import { hex2rgb } from './colorModels/hex';
import { rgb2xyz, xyz2rgb } from './colorModels/ciexyz';
import { hsl2rgb, rgb2hsl } from './colorModels/hsl';
import { hsb2rgb, hsbHelper, rgb2hsb } from './colorModels/hsb';
import { hwb2rgb, rgb2hwb } from './colorModels/hwb';
import { cmyk2rgb, rgb2cmyk } from './colorModels/cmyk';
import { lab2rgb, lchab2rgb, rgb2lab, rgb2lchab } from './colorModels/cielab';
import { lchuv2rgb, luv2rgb, rgb2lchuv, rgb2luv } from './colorModels/cieluv';
import { xyzSpace } from './colorModels/cie-utils';
import { oklab2rgb, oklch2rgb, rgb2oklab, rgb2oklch } from './colorModels/oklab';


export type ColorSpace = {
  /**
   * Name of the color space.
   */
  name_: string,
  /**
   * Browser support.
   */
  isSupported_: boolean,
  /**
   * Label of channels
   */
  labels_: string[],
  /**
   * Range of each channel of a color spaces.
   *
   * The type of values:
   *  - `[number, number][]`: the minimum and maximum of each channel.
   *
   * The most common digits are `255`, `100`, and `360`.
   *  - `255`: Maximum of uint8.
   *  - `100`: The value is a percentage.
   *  - `360`: The unit is a degree.
   *  - others: Usually see this in CIE spaces. The value eather follows the CSS
   *    rules (CIELAB) or represents the extreme value when transform from RGB
   *    to the space.
   */
  max_: readonly (readonly [number, number])[]
  /**
   * Convert RGB to specified color space.
   * @param x RGB values.
   * @returns specified color space values.
   */
  fromRgb_: (x: readonly number[]) => number[],
  /**
   * Convert specified color space to RGB space.
   * @param x specified color space values.
   * @returns RGB values.
   */
  toRgb_: (x: readonly number[]) => number[],
  /**
   * White point. The property only exists in XYZ space.
   */
  white_?: 'd65' | 'd50'
}
/**
 * Support color spaces.
 */
export const COLOR_SPACES: ColorSpace[] = (() => {
  const HCL_MAX = [[0, 360], [0, 100], [0, 100]] as const; // For Hue-Chroma-Luminance models.
  const LCH_MAX = [[0, 100], [0, 150], [0, 360]] as const;
  const identityMap = (x: readonly number[]) => [...x];

  const spaces = [
    {
      name_: 'RGB',
      fromRgb_: identityMap,
      toRgb_: identityMap,
      labels_: ['Red', 'Green', 'Blue'],
      max_: map(3, () => [0, 255]),
      isSupported_: true,
    },
    {
      name_: 'HSL',
      fromRgb_: rgb2hsl,
      toRgb_: hsl2rgb,
      labels_: ['Hue', 'Saturation', 'Luminance'],
      max_: HCL_MAX,
      isSupported_: true,
    },
    {
      name_: 'HSB',
      fromRgb_: rgb2hsb,
      toRgb_: hsb2rgb,
      labels_: ['Hue', 'Saturation', 'Brightness'],
      max_: HCL_MAX,
      isSupported_: false,
    },
    {
      name_: 'HWB',
      fromRgb_: rgb2hwb,
      toRgb_: hwb2rgb,
      labels_: ['Hue', 'Whiteness', 'Blackness'],
      max_: HCL_MAX,
      isSupported_: true,
    },
    {
      name_: 'CMYK',
      fromRgb_: rgb2cmyk,
      toRgb_: cmyk2rgb,
      labels_: ['Cyan', 'Magenta', 'Yellow', 'Black'],
      max_: map(4, () => [0, 100]),
      isSupported_: false,
    },
    (
      // `xyzSpace` missing 2 properties:
      // statement the code here
      xyzSpace.fromRgb_ = rgb2xyz,
      xyzSpace.toRgb_ = xyz2rgb,
      xyzSpace
    ),
    {
      name_: 'LAB',
      fromRgb_: rgb2lab,
      toRgb_: lab2rgb,
      labels_: ['L*', 'a*', 'b*'],
      max_: [[0, 100], [-125, 125], [-125, 125]] as const,
      isSupported_: true,
    },
    {
      name_: 'LUV',
      fromRgb_: rgb2luv,
      toRgb_: luv2rgb,
      labels_: ['L*', 'u*', 'v*'],
      max_: [[0, 100], [-134, 220], [-140, 122]] as const,
      isSupported_: false,
    },
    {
      name_: 'LCHab',
      fromRgb_: rgb2lchab,
      toRgb_: lchab2rgb,
      labels_: ['L*', 'C*', 'h'],
      max_: LCH_MAX,
      isSupported_: true,
    },
    {
      name_: 'LCHuv',
      fromRgb_: rgb2lchuv,
      toRgb_: lchuv2rgb,
      labels_: ['L*', 'C*', 'h'],
      max_: LCH_MAX,
      isSupported_: false,
    },
    {
      name_: 'Oklab',
      fromRgb_: rgb2oklab,
      toRgb_: oklab2rgb,
      labels_: ['L', 'a', 'b'],
      max_: [[0, 1], [-0.4, 0.4], [-0.4, 0.4]],
      isSupported_: true,
    },
    {
      name_: 'Oklch',
      fromRgb_: rgb2oklch,
      toRgb_: oklch2rgb,
      labels_: ['L', 'C', 'h'],
      max_: [[0, 1], [0, 0.4], [0, 360]],
      isSupported_: true,
    },
  ] satisfies (
      Omit<ColorSpace, 'max_'> &
      { 'max_'?: ColorSpace['max_'] | number}
    )[];

  if (typeof CSS !== 'undefined') {
    for (const obj of spaces) {
      const css = /^LCH/.test(obj.name_) ? 'lch' : obj.name_;
      const vals = map(obj.labels_, () => 0).join(' ');
      obj.isSupported_ = CSS.supports(
        'color',
        css === 'XYZ' ?
          `color(xyz ${vals})` :
          `${css}(${vals})`
      );
    }
  }
  return spaces as ColorSpace[];
})();

const SPACE_INDEX_MAP: Record<string, number> = {
  RGB: 0,
  HSL: 1,
  HSB: 2,
  HWB: 3,
  CMYK: 4,
  XYZ: 5,
  LAB: 6,
  LUV: 7,
  LCHAB: 8,
  LCHUV: 9,
  OKLAB: 10,
  OKLCH: 11,
};

/**
 * Return an item in `COLOR_SPACES`.
 * @param space Item in `COLOR_SPACES` or `COLOR_SPACES[number].name_`
 */
export const getColorSpace = (
  space: ColorSpace | string = COLOR_SPACES[0]
): ColorSpace => {
  if (typeof space === 'string') {
    space = space.toUpperCase();
    return COLOR_SPACES[SPACE_INDEX_MAP[space] ?? 0];
  }
  return space;
};

/**
 * @deprecated.
 * Return the range of a space.
 */
export const getSpaceRange = (
  space: ColorSpace | string
): [number, number][] => {
  return map(getColorSpace(space).max_, r => [r[0], r[1]]);
};

/**
 * Convert the color to specific space.
 * @param color
 */
export const toSpace = (
  color: readonly number[],
  space: ColorSpace | string,
  to: ColorSpace | string
): number[] => {
  space = getColorSpace(space);
  to = getColorSpace(to);
  if (space === to) return [...color];
  if (space.name_ === 'RGB') return to.fromRgb_(color);
  if (to.name_ === 'RGB') return space.toRgb_(color);
  return to.fromRgb_(space.toRgb_(color));

};


export type CssColorOptions = {
  /**
   * Check whether the browser supports the target color format. If not
   * supported, return a fallback string in RGB format.
   * @default false
   */
  checkSupport_?: boolean,
  /**
   * Separator between values.
   * If `checkSupport_` is `true`, the separator is always a space `' '`.
   * @default ' '
   */
  sep_?: string,
  /**
   * Convert all values (except degrees) to percentages.
   * @default true
   */
  percent_?: boolean,
  /**
   * Number of decimal places for rounding values.
   * Set to `false` to disable rounding, or `true` to use the default.
   * @default 2
   */
  place_?: number | boolean
}

/**
 * Return CSS `<color>` value format:
 * - `'space(val val val)'`
 * - `'color(space val val val)'`.
 *
 * If `checkSupport === true` and the brwoser does not support the space,
 * the function convert the color to RGB space and return the RGB format.
 *
 * In Node enviroment, the `ColorSpace.isSupport_` is preset based on supported
 * `<color-function>` values.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
 * @param color Color array.
 * @param space The space of color parameter.
 * @param options
 * @returns
 */
export const getCssColor = (
  color: readonly number[],
  space: ColorSpace | string = 'RGB',
  options: CssColorOptions = {},
): string => {
  // Variables in loop
  let val: number;
  let suffix: string | number;
  let max: number;
  let i = 0;
  let strVal = '';

  let {
    checkSupport_ = false, // eslint-disable-line
    sep_ = ' ',
    percent_ = true, // eslint-disable-line
    place_ = 2
  } = options;

  space = getColorSpace(space);
  if (checkSupport_ && !space.isSupported_) {
    return getCssColor(
      space.toRgb_(color),
      COLOR_SPACES[0],
      options
    );
  }
  sep_ = checkSupport_ ? ' ' : sep_;
  place_ = place_ === true ? 2 : place_;

  const css = /^LCH/.test(space.name_) ? 'lch' : space.name_.toLowerCase();
  const isXyz = css === 'xyz';

  const rounder = place_ === false ? (val: number) => val : round;

  for ([, max] of space.max_) {
    val = color[i++];
    suffix = percent_ && max !== 360 ? '%' : '';
    if (isXyz && !percent_ && checkSupport_) {
      val /= 100;
    } else if (!isXyz && suffix) { // to percentage
      val *= 100 / max;
    }
    if (strVal) strVal += sep_; // Add a seprator before 2nd, 3rd, ..., values.
    strVal += rounder(val, place_ as number) + suffix;
  }

  // Alpha
  val = alphaNormalize(color[i]); // i = space.max_.length
  strVal += (
    val < 1 ?
      ' / ' + (
        percent_ ?
          // @ts-expect-error
          rounder(val * 100, place_) + '%' :
          // @ts-expect-error
          rounder(val, place_)
      ) :
      ''
  );
  // Ignore checking `space.isSupported_` here.
  // Because `checkSupport_ && !space.isSupported_` will try RGB format
  // by calling this function recursively (the first if condition).
  return isXyz && checkSupport_ ?
    `color(xyz-${space.white_ ?? 'd65'} ${strVal})` :
    `${css}(${strVal})`;

};

/**
 * If input a hex, convert to array and return it.
 * If input an array, return it.
 */
export const rgbArraylize = (
  rgb: readonly number[] | string
): readonly number[] => {
  return typeof rgb === 'string' ? hex2rgb(rgb) : rgb;
};

/**
 * Normalize alpha channel to interval [0, 1].
 * @param alpha A number. undefined will be regarded as 1
 */
export const alphaNormalize = (alpha: number | undefined): number => {
  if (alpha === undefined) return 1;
  return clip(alpha, 0, 1);
};

/**
 * @deprecated Interim function. May be deprecated in future.
 *
 * Get the alpha value from a color. The value is the last element of array.
 * @param color Color array.
 */
export const getAlpha = (color: readonly number[]): number => {
  return alphaNormalize(color[color.length-1]);
};

/**
 * Handle RGB channels of a color array, excluding the alpha channel.
 * @param rgb A 3- or 4-element color array.
 * @param fn Callback function that handle first 3 channels.
 */
export const mapNonAlpha = (
  rgb: readonly number[],
  fn: (val: number, i: number) => number
): number[] => {
  return map(
    rgb,
    (val, i) => i < 3 ? fn(val, i) : val
  );
};


/**
 * Calculate hue (H channel of HSL/HSB) from rgb. Also, returns minimum and
 * maximum of rgb.
 * @param rgb RGB array.
 */
export const rgb2hue = (rgb: readonly number[] | string): number => {
  return hsbHelper(rgbArraylize(rgb))[0];
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
export const rgb2gray = (rgb: string | readonly number[]): number => (
  dot3(
    rgbArraylize(rgb),
    [0.299, 0.587, 0.114]
  )
);

/**
 * The rgb is light if the grayscale >= 127.5.
 */
export const isLight = (rgb: readonly number[] | string): boolean => {
  return rgb2gray(rgb) > 127.5;
};

/**
 * Evaluate relative luminance from sRGB.
 * @returns Relative luminance, between [0, 1].
 * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export const rgb2luminance = (rgb: string | readonly number[]): number => {
  rgb = rgbArraylize(rgb);
  return (
    0.2126 * srgb2linearRgb(rgb[0]) +
    0.7152 * srgb2linearRgb(rgb[1]) +
    0.0722 * srgb2linearRgb(rgb[2])
  );
};

/**
 * @deprecated Use `rgb2luminance` instead.
 *
 * Evaluate relative luminance from RGB.
 * @returns Relative luminance, between [0, 1].
 * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export const getRelativeLuminance = rgb2luminance;

/**
 * Returns the contrast ratio which is defined by WCAG 2.1.
 */

/**
 * Returns the contrast ratio which is defined by WCAG 2.1.
 * @see https://www.w3.org/WAI/GL/wiki/Contrast_ratio
 */
export const rgb2contrast = (
  rgb1: string | readonly number[],
  rgb2: string | readonly number[],
) => {
  const ratio =
    (rgb2luminance(rgb1) + 0.05) /
    (rgb2luminance(rgb2) + 0.05);
  return round(ratio < 1 ? 1 / ratio : ratio, 2);
};

/**
 * @deprecated Use `rgb2contrast` instead.
 *
 * Returns the contrast ratio which is defined by WCAG 2.1.
 * @see https://www.w3.org/WAI/GL/wiki/Contrast_ratio
 */
export const getContrastRatio = rgb2contrast;

/**
 * WCAG 2.2 requirements about contrast ratio of text.
 * @see https://www.w3.org/TR/WCAG/#contrast-minimum
 */
export type ReadbleOptions = {
  /**
   * Text size is large scale (`true`) or normal scale (`false`).
   *
   * Large scale: text with at least 18 point or 14 point bold or font size
   * that would yield equivalent size for Chinese, Japanese and Korean (CJK) fonts.
   * @default false
   */
  isLarge?: boolean
  /**
   * Required to satisfy WCAG level AAA (`true`) or level AA (`false`).
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

  return rgb2contrast(rgb1, rgb2) >= threshold;
};


/**
 * Generates a random RGB color.
 * @param randAlpha Default: `false`. With a random value of alpha channel.
 * If set to `false`, the alpha channel will be `1`
 * @return [R, G, B, alpha]
 */
export const randRgbGen = (randAlpha: boolean = false) => [
  randInt(255),
  randInt(255),
  randInt(255),
  randAlpha ? Math.random() : 1
];
