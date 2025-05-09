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
import { oklab2rgb, oklch2rgb, rgb2oklab, rgb2oklch } from './colorModels/oklab';


export type ColorSpace = {
  /**
   * Name of the color space.
   */
  readonly name_: string,
  /**
   * Browser support this color value or not.
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
   *  - `number[]`: the maximum of each channel.
   *  - `([number, number])[]`: the range of each channel.
   *
   * The most common digits are `255`, `100`, and `360`.
   *  - `255`: Maximum of uint8.
   *  - `100`: The value is a percentage.
   *  - `360`: The unit is a degree.
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
  const lCH_MAX = [100, 150, 360] as const;
  const identityMap = (x: readonly number[]) => [...x];

  const spaces = [
    {
      name_: 'RGB',
      fromRgb_: identityMap,
      toRgb_: identityMap,
      labels_: ['Red', 'Green', 'Blue'],
      max_: map(3, () => 255),
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
      max_: map(4, () => 100),
      isSupported_: false,
    },
    {
      name_: 'XYZ',
      fromRgb_: rgb2xyz,
      toRgb_: xyz2rgb,
      labels_: ['X', 'Y', 'Z'],
      max_: xyzMax,
      isSupported_: false,
    },
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
      max_: lCH_MAX,
      isSupported_: true,
    },
    {
      name_: 'LCHuv',
      fromRgb_: rgb2lchuv,
      toRgb_: lchuv2rgb,
      labels_: ['L*', 'C*', 'h'],
      max_: lCH_MAX,
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
      max_: [1, 0.4, 360],
      isSupported_: true,
    },
  ] satisfies (
      Omit<ColorSpace, 'max_'> &
      { 'max_'?: ColorSpace['max_'] | number}
    )[];

  const isInBrowser = typeof CSS !== 'undefined';
  for (const obj of spaces) {
    if (isInBrowser) {
      const css = /^LCH/.test(obj.name_) ? 'lch' : obj.name_;
      const vals = map(obj.labels_, () => 0).join(' ');
      obj.isSupported_ = CSS.supports('color', `${css}(${vals})`);
    }
  }
  return spaces as ColorSpace[];
})();



/**
 * Return an item in `COLOR_SPACES`.
 * @param space Item in `COLOR_SPACES` or `COLOR_SPACES[number].name_`
 */
export const getColorSpace = (
  space: ColorSpace | string = COLOR_SPACES[0]
): ColorSpace => {
  if (typeof space === 'string') {
    space = space.toUpperCase();
    return COLOR_SPACES.find(item => item.name_.toUpperCase() === space) ?? COLOR_SPACES[0];
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


export type CssColorOptions = {
  /**
   * Check the browser support or not. If browser does not support the format,
   * return string in RGB space.
   * @default false
   */
  checkSupport_?: boolean,
  /**
   * Seperator of values. If `checkSupport_` is `true`, the seperator will
   * always be `' '`.
   * @default ' '
   */
  sep_?: string,
  /**
   * Convert all values to percent except degree.
   * @default true
   */
  percent_?: boolean,
  /**
   * Argument for rounding values. Set `false` to disable rounding. `true` equials
   * default value.
   * @default 2
   */
  place_?: number | boolean
}

/**
 * Return CSS `<color>` value format: `space(val val val)`.
 * If `checkSupport === true` and the brwoser does not support, then return
 * RGB format.
 * In node enviroment, the `ColorSpace.isSupport_` based on <color-function>
 * value (not include theese spaces that only support by`color()`)
 * MDN <color>: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
 * @param color Color.
 * @param space Color space of color.
 * @param options
 * @returns
 */
export const getCssColor = (
  color: readonly number[],
  space: ColorSpace | string = 'RGB',
  options: CssColorOptions = {},
): string => {
  let temp: number;
  let suffix: string;
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
      { checkSupport_, sep_, percent_, place_ }
    );
  }
  sep_ = checkSupport_ ? ' ' : sep_;
  place_ = place_ === true ? 2 : place_;
  const noRounding = place_ === false;
  const range = getSpaceRange(space);

  const vals = map(range, ([,max], i) => {
    temp = color[i];
    if (
      max === 1 ||
      max === 100 ||
      (percent_ && max !== 360)
    ) {
      temp *= 100 / range[i][1];
      suffix = '%';
    } else {
      suffix = '';
    }
    return (noRounding ? temp : round(temp, place_ as number)) + suffix;
  });
  const css = space.name_.startsWith('LCH') ? 'lch' : space.name_;
  return `${css}(${vals.join(sep_)})`;
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
 * Evaluate relative luminance from RGB.
 * @returns Relative luminance, between [0, 1].
 */
export const getRelativeLuminance = (rgb: string | readonly number[]): number => {
  return dot3(
    map(rgbArraylize(rgb), val => srgb2linearRgb(val)),
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
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);
  const ratio = (lum1 + 0.05) / (lum2 + 0.05);
  return round(ratio < 1 ? 1 / ratio : ratio, 2);
};

/**
 * WCAG 2.2 requirements about contrast ratio of text.
 * https://www.w3.org/TR/WCAG/#contrast-minimum
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

  return getContrastRatio(rgb1, rgb2) >= threshold;
};


/**
 * Generate an RGB color.
 * @return [R, G, B]
 */
export const randRgbGen = () => map(3, () => randInt(255));
