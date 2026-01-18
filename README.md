<h1>color-utils</h1>

**color-utils** provides functions for color conversions, harmonies, mix, and sort.

To see detail changes: [Changelog](https://github.com/johnny95731/color-utils/blob/main/CHANGELOG.md) (record since v1.2.0).

<h2>Features</h2>

- **Small**: 11.7KB for core conversion functionality. The full build is only 15.1KB (or 13.6KB with mangle.properties.regex), all sizes after minification.
- **High performance**: Optimized for speed. [Benchmark](#benchmark)
- **Browser Detection**: Automatically detects support for CSS [`<color>`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) values during string conversions.
- **Procedural**: Better Tree-shaking and high performance.
- **Immutable**.
- **Typed**.
- Supports both ESM and CommonJS.
- **Zero Dependencies**.

<h2>Install</h2>

```shell
npm install @johnny95731/color-utils
```

<h2>Usage</h2>

```ts
import { rgb2hex, rgb2hsb, rgb2gray, randRgbGen } from '@johnny95731/color-utils';

const rgb1 = randRgbGen();     // [ 32, 245, 203, 1 ];
rgb2hex(rgb1);  // "#20F5CB"
rgb2hsb(rgb1);  // [ 168.16901408450707, 86.93877551020408, 96.07843137254902, 1 ]
rgb2gray(rgb1); // 176.525

const rgb2 = randRgbGen(true); // [ 124, 191, 136, 0.175 ];
rgb2hex(rgb2);  // "#7CBF882D"
rgb2hsb(rgb2);  // [ 130.7462686567164, 35.07853403141361, 74.90196078431373, 0.175 ]
rgb2gray(rgb2); // 164.69699999999997
```

<h2>Supported Color Spaces</h2>

More infomations abous color spaces: [Color Space Ranges](#color-space-ranges)

- RGB
- HEX (3/4/6/8 digit)
- HSI
- HSL
- HSB (alias of HSV)
- HWB
- CMYK
- NAMED (Closest CSS `<named-color>`).

Absolute color space:

- XYZ (D65 is the default of reference white. Calling `setReferenceWhite('D50')` to switch to D50)
- LAB
- LCHab
- LUV
- LCHuv
- Oklab
- Oklch

<h2>API</h2>

<details>
<summary><code>randRgbGen(randAlpha: boolean = false): number[]</code></summary>

Generates a random RGB color. If set the parameter `randAlpha` to `true`, give a random  alpha value.

```ts
randRgbGen();     // [48, 189, 131, 1]
randRgbGen(true); // [15, 4, 86, 0.487]
```

</details>

<h3>Basic Conversions</h3>

The naming of converters is connecting input space and output space with a letter 2(to). Most conversinons are group of two, rgb2space and space2rgb. For example, `rgb2hsl` and `hsl2rgb`. About alpha channel handling, see [alpha channel](#alpha)

```ts
const rgb1 = randRgbGen();     // [ 32, 245, 203, 1 ];
const hex1 = rgb2hex(rgb1);    // "#20F5CB"
const ret1 = hex2rgb(hex1);    // [ 32, 245, 203, 1 ]

const rgb2 = randRgbGen(true); // [ 124, 191, 136, 0.175 ];
const hex2 = rgb2hex(rgb2);    // "#7CBF882D"
const ret2 = hex2rgb(hex2);    // [ 124, 191, 136, 0.17647058823529413 ]
```

```ts
const rgb = randRgbGen(); // [215, 117, 43, 1];

// HSI
const hsi = rgb2hsi(rgb); // [ 25.813953488372093, 65.60000000000001, 49.01960784313726, 1 ]
const ret = hsi2rgb(hsi); // [ 215.00000000000006, 116.99999999999999, 42.999999999999986, 1 ]

// HSL
const hsl = rgb2hsl(rgb); // [ 25.813953488372093, 68.25396825396825, 50.58823529411765, 1 ]
const ret = hsl2rgb(hsl); // [ 215, 116.99999999999997, 43, 1 ]

// HSB
const hsb = rgb2hsb(rgb); // [ 25.813953488372093, 80, 84.31372549019608, 1 ]
const ret = hsb2rgb(hsb); // [ 214.99999999999997, 116.99999999999994, 42.99999999999997, 1 ]

// HWB
const hwb = rgb2hwb(rgb); // [ 25.813953488372093, 16.862745098039216, 15.686274509803923, 1 ]
const ret = hwb2rgb(hwb); // [ 214.99999999999997, 116.99999999999994, 42.99999999999997, 1 ]

// CMYK
const cmyk = rgb2cmyk(rgb);  // [ 0, 45.581395348837205, 80, 15.686274509803923, 1 ]
const ret  = cmyk2rgb(cmyk); // [ 215, 117.00000000000001, 42.99999999999999, 1 ]

// XYZ
const xyz = rgb2xyz(rgb); // [ 34.82492294995061, 27.348113685721042, 5.729817939366711, 1 ]
const ret = xyz2rgb(xyz); // [ 215, 116.99999999999997, 42.99999999999999, 1 ]

// LAB
const lab = rgb2lab(rgb); // [ 59.295166898095005, 33.23559720107427, 54.87179474020556, 1 ]
const ret = lab2rgb(lab); // [ 214.99999999999994, 117.00000000000003, 42.99999999999999, 1 ]

// LUV
const luv = rgb2luv(rgb); // [ 59.295166898095005, 79.79758781313612, 49.446929802364046, 1 ]
const ret = luv2rgb(luv); // [ 215.00000000000003, 116.99999999999994, 43.0000000000003, 1 ]

// LCHab
const lchab = rgb2lchab(rgb);   // [ 59.295166898095005, 64.15230922829907, 58.796900617389596, 1 ]
const ret   = lchab2rgb(lchab); // [ 214.99999999999994, 117.00000000000003, 42.99999999999999, 1 ]

// LCHuv
const lchuv = rgb2lchuv(rgb);   // [ 59.295166898095005, 93.87573641615329, 31.784609125244227, 1 ]
const ret   = lchuv2rgb(lchuv); // [ 215.00000000000003, 116.99999999999994, 43.0000000000003, 1 ]

// Oklab
const oklab = rgb2oklab(rgb);   // [ 0.6614476183541314, 0.08895010318560151, 0.11843002577812112, 1 ]
const ret   = oklab2rgb(oklab); // [ 215.00000000000006, 116.99999999999986, 43.00000000000048, 1 ]

// Oklch
const oklch = rgb2oklch(rgb);   // [ 0.6614476183541314, 0.1481141177016411, 53.09061919375927, 1 ]
const ret   = oklch2rgb(oklch); // [ 215.00000000000006, 116.99999999999986, 43.00000000000048, 1 ]
```

<h4 id="alpha"><bold>Alpha Channel / Opacity</bold></h4>

The 4th value (5th in CMYK) is the alpha value. The value should be between 0 and 1.

- **conversions except HEX**: Pass through the alpha value without any validation.<br/>
- **`rgb2hex`**: Outputs a 6-digit hex code (omitting the alpha channel) if the alpha value >= 1 or is `undefined`. If the alpha < 1, function will output a 8-digit hex code.<br/>
- **`hex2rgb`**: Computes the alpha value if the input is a 4- or 8-digit hex code; for 3- or 6-digit codes, the alpha channel defaults to 1.
- **color mixing**: Affect results.
- **other manipulations**: Pass through alpha value and does not affect results.

<div>

***Error Handling***

`hex2rgb` and `named2rgb` return `[0, 0, 0]` when the input is invalid.
</div>

<h3><code>ColorSpace</code>Type</h3>

`COLOR_SPACES` array stores `ColorSpace` objects, which contains informations about spaces

key   | info
------|------
name_ | Name of color space
isSupported_ | In browser environment, the value will be initialized by calling `CSS.supports('color', 'space(0 0 0)');`. In node environment, the values are preset.
labels_ | Labels of channels.
max_ | Ranges of channels.
fromRgb_ | Converter from RGB to space.
toRgb_ | Converter from space to RGB.
white_ | White point. The property only exists in XYZ space.

Note: `COLOR_SPACES` does not have HEX and NAMED space. And, both `LCHab` and `LCHuv` will check `CSS.supports('color', 'lch(0 0 0)');` though these two spaces are not equvalent.

<details>
<summary>Default values of <code>ColorSpace.isSupported_</code></summary>

 space | value
-------|-----------
RGB    | `true`
HSI    | `false`
HSL    | `true`
HSB    | `false`
HWB    | `true`
CMYK   | `false`
XYZ    | `true`
LAB    | `true`
LCHab  | `true`
LUV    | `false`
LCHuv  | `true`
Oklab  | `true`
Oklch  | `true`

</details>
<br/>

Argumemts with type `ColorSpace | string` can input `ColorSpace` object or **space name**:

- The space name is case-insensitive.
- `'HEX'` and `'NAMED'` are not valid names.
- Invalid name will be regarded as RGB space.

<details>
<summary><code>getColorSpace(space: ColorSpace | string): ColorSpace</code></summary>

Return an item in `COLOR_SPACES`. If `space` argument is a invalid string, that is, find the item that `ColorSpace.name_ === space` (if no such item, return RGB space).

</details>

<details>
<summary><code>toSpace(color: readonly number[],
    space: ColorSpace | string,
    to: ColorSpace | string
  ): number[]
</code></summary>

Convert color from a space to target space.

```ts
toSpace([176, 59, 79, 1], 'RGB', 'XYZ'); // [ 20.88159899406145, 12.925309240980702, 8.790857610353417, 1 ]
rgb2xyz([176, 59, 79, 1]);               // [ 20.88159899406145, 12.925309240980702, 8.790857610353417, 1 ]
```

</details>

<details>
<summary><code>getCssColor(color: readonly number[], space: ColorSpace | string, options?: CssColorOptions): string</code></summary>

Convert the color to string.

If `checkSupport` is `true`, then the function will set `sep = ' '` and change the color space to RGB when the browser does not support this color space.

```ts
getCssColor([140, 17, 243], 'RGB');                        // "rgb(54.9% 6.67% 95.29%)"
getCssColor([140, 17, 243], 'RGB', { sep_: "," });         // "rgb(54.9%,6.67%,95.29%)"
getCssColor([140, 17, 243], 'RGB', { percent_: false });   // "rgb(140 17 243)"
getCssColor([273, 90, 51], 'HSL');                         // "hsl(273 90% 51%)"
getCssColor([27, 12, 86], 'xyz');                          // "xyz(28.41% 12% 78.98%)"
getCssColor([27, 12, 86], 'xyz', { checkSupport_: true }); // "color(xyz-d65 28.41% 12% 78.98%)"
```

```ts
type CssColorOptions = {
  /**
   * Check the browser support or not. If browser does not support the color,
   * return string in RGB space.
   * @default false
   */
  checkSupport_?: boolean,
  /**
   * Seperator of values. If checkSupport_ is true, the seperator will always be ' '
   * @default ' '
   */
  sep_?: string,
  /**
   * Convert all values to percent except deg.
   * @default true
   */
  percent_?: boolean,
  /**
   * Argument for rounding values. Set false to disable rounding. true equials
   * default value.
   * @default 2
   */
  place_?: number | boolean
}
```

See also

- [`<color>`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)
- [`color()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color)

</details>

<details>
<summary><code>rgbArraylize(rgb: readonly number[] | string): readonly number[]</code></summary>

Normalize RGB or HEX to array type.

</details>

<details>
<summary><code>alphaNormalize(alpha: number | undefined): number</code></summary>

Normalize alpha channel to interval [0, 1].

</details>

<details>
<summary><code>getAlpha(color: readonly number[]): number</code></summary>

Get and normalize the last element of array.

Interim function. May be deprecated in future.

</details>

<details>
<summary><code>setReferenceWhite(white: 'D65' | 'D50'): void</code></summary>

Change the reference white of CIEXYZ space. This library only support sRGB for RGB model.
This function will change `.max_` property of XYZ space.

</details>

<h4 id="color-space-ranges">Color Space Ranges</h4>

Most values are referred to CSS definition.

<details>
<summary>RGB</summary>

channel | description | min | max
--------|-------------|-----|-----
r | Red   | 0 | 255
g | Green | 0 | 255
b | Blue  | 0 | 255

</details>

<details>
<summary>HSI</summary>

channel | description | min | max
--------|-------------|-----|-----
h | Hue        | 0 | 360
s | Saturation | 0 | 100
l | Intensity  | 0 | 100

</details>

<details>
<summary>HSL</summary>

channel | description | min | max
--------|-------------|-----|-----
h | Hue        | 0 | 360
s | Saturation | 0 | 100
l | Lightness  | 0 | 100

</details>

<details>
<summary>HSB</summary>

channel | description | min | max
--------|-------------|-----|-----
h | Hue        | 0 | 360
s | Saturation | 0 | 100
b | Brightness | 0 | 100

</details>

<details>
<summary>HWB</summary>

channel | description | min | max
--------|-------------|-----|-----
h | Hue       | 0 | 360
w | Whiteness | 0 | 100
b | blackness | 0 | 100

</details>

<details>
<summary>CMYK</summary>

channel | description | min | max
--------|-------------|-----|-----
c | Cyan      | 0 | 100
m | Magenta   | 0 | 100
y | Yellow    | 0 | 100
k | key/black | 0 | 100

</details>

<details>
<summary>NAMED</summary>

channel | description
--------|-------------
key |  [\<named-color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/named-color)

Several keywords are *aliases* for each other, we only preserve one of alias:

preserved | removed
----------|---------
cyan      | aqua
magenta   | fuchsia
gray      | grey

and other 6 groups of alias that containing `'gray'` (preserved) or `'grey'` (removed).
</details>

<details>
<summary>XYZ</summary>

The maximum value is based on RGB model and reference white. y channel will be normalize to `100`.
The library currently only supports `sRGB` as RGB model and `D65` (default) and `D50` as reference white.

D65

channel | description | min | max
--------|-------------|-----|-----
x | | 0 | 95.047
y | | 0 | 100
z | | 0 | 108.883

D50

channel | description | min | max
--------|-------------|-----|-----
x | | 0 | 96.422
y | | 0 | 100
z | | 0 | 82.521

</details>

<details>
<summary>LAB</summary>

The range of `a` and `b` follows the format of CSS. See: [lab()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/lab).

channel | description | min | max
--------|-------------|-----|-----
l | Lightness   |    0 | 100
a | Chrominance | -125 | 125
b | Chrominance | -125 | 125

</details>

<details>
<summary>LCHab</summary>

The LCH space that converted from LAB.

channel | description | min | max
--------|-------------|-----|-----
l | Lightness | 0 | 100
c | Chroma    | 0 | 150
h | Hue       | 0 | 360

</details>

<details>
<summary>LUV</summary>

The range of `u` and `v` channels are the extreme values when converting from RGB to LUV.

channel | description | min | max
--------|-------------|-----|-----
l | Lightness   |    0 | 100
u | Chrominance | -134 | 220
v | Chrominance | -140 | 122

</details>

<details>
<summary>LCHuv</summary>

The LCH space that converted from LUV.

channel | description | min | max
--------|-------------|-----|-----
l | Lightness | 0 | 100
c | Chroma    | 0 | 150
h | Hue       | 0 | 360

</details>

<details>
<summary>Oklab</summary>

The range of `a` and `b` follows the format of CSS. See: [oklab()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklab).

channel | description | min | max
--------|-------------|-----|-----
l | Lightness   |    0 | 1
a | Chrominance | -0.4 | 0.4
b | Chrominance | -0.4 | 0.4

</details>

<details>
<summary>Oklch</summary>

channel | description | min | max
--------|-------------|-----|-----
l | Lightness | 0 | 1
c | Chroma    | 0 | 0.4
h | Hue       | 0 | 360

</details>

<h3>Analysis</h3>

<details id="rgb2gray">
<summary><code>rgb2gray(rgb: string | readonly number[]): number
</code></summary>

Return the grayscale value (within `[0, 255]`) of an RGB color.
See: [color brightness](https://www.w3.org/TR/AERT/#color-contrast)

```ts
rgb2gray([1, 100, 255]); // 88.06899999999999
```

</details>

<details>
<summary><code>isLight(rgb: readonly number[] | string): boolean</code></summary>

Return `true` if the grayscale value of an RGB array or a hex string is greater than 127.5. Otherwise, return `false`. [rgb2gray](#rgb2gray)

```ts
rgb2gray([156, 49, 93]); // 86.009
isLight([156, 49, 93]);  // false

rgb2gray('#E6ECB6');     // 228.04999999999995
isLight('#E6ECB6');      // true
```

</details>

<details>
<summary><code>rgb2hue(rgb: readonly number[]): number</code></summary>

Hue of RGB. Note that this value is different from hue of CIELCH.

```ts
rgb2hue([1, 100, 255]); // 216.61417322834643
```

</details>

<details>
<summary><code>rgb2luminance(rgb: readonly number[] | string): number</code></summary>

Return the relative luminance (within `[0, 1]`) of an RGB array or a hex string.
See: [WCAG2.0 relative luminance](https://www.w3.org/TR/WCAG20/#relativeluminancedef)

```ts
rgb2luminance([191, 123, 86]);   // 0.259141693330052
rgb2luminance([0, 0, 0]);        // 0
rgb2luminance([255, 255, 255]);  // 1
```

</details>

<details>
<summary><code>getRelativeLuminance(rgb: readonly number[] | string): number</code></summary>

`getRelativeLuminance` is deprecated. An alias of `rgb2luminance`.

</details>

<details>
<summary><code>rgb2contrast(rgb1: readonly number[] | string, rgb2: readonly number[] | string): number</code></summary>

Return the contrast ratio of two RGB colors.
See: [WCAG2.0 contrast ratio](https://www.w3.org/TR/WCAG20/#contrast-ratiodef)

```ts
rgb2contrast([191, 123, 86], [230, 236, 182]); // 2.759999999999999
rgb2contrast([0, 0, 0], '#FFF');               // 20.99999999999999
rgb2contrast('FFF', [0, 0, 0]);                // 20.99999999999999
```

</details>

<details>
<summary><code>getContrastRatio(rgb1: readonly number[] | string, rgb2: readonly number[] | string): number</code></summary>

`getContrastRatio` is deprecated. An alias of `rgb2contrast`.

</details>

<details>
<summary><code>isReadable(rgb1: readonly number[] | string, rgb2: readonly number[] | string, options: ReadbleOptions): boolean</code></summary>

Check that the contrast ratio of two colors (background and text) is satisfing the WCAG standard.
See: [WCAG2.1 contrast minimum](https://www.w3.org/TR/WCAG21/#contrast-minimum)

```ts
type ReadbleOptions = {
  /**
   * Text size is large scale (`true`) or normal scale (`false`).
   * @default false
   */
  isLarge?: boolean,
  /**
   * Required to satisfy WCAG level AAA (`true`) or level AA (`false`).
   * @default false
   */
  levelAAA?: boolean
}
```

```ts
isReadable([191, 123, 86], [230, 236, 182]);       // false
isReadable('000', '#FFF', { levelAAA: true });     // true
isReadable('987654', '123456');                    // false
isReadable('987654', '123456', { isLarge: true }); // true
isReadable('987654', '123456', { isLarge: true, levelAAA: true }) // false
```

</details>

<h3>Harmony</h3>
Some function arguments naming hsb, but the method works in HSI, HSL, or HWB space.

<details>
<summary><code>shiftHue(primary: readonly number[], degs: number[]): number[][]</code></summary>

Return a palette that each color is the hue shift of primary. The primary color should be HSB, HSL, HWB color, or color space that first channel represents hue.

The return space is the **same** as the input space.

```ts
shiftHue([65, 56, 92, 1], [0, 30, 60]);    // [ [ 65, 56, 92, 1 ], [ 95, 56, 92, 1 ], [ 125, 56, 92, 1 ] ]
shiftHue([209, 36, 87, 1], [0, 120, 240]); // [ [ 209, 36, 87, 1 ], [ 329, 36, 87, 1 ], [ 449, 36, 87, 1 ] ]
```

</details>

<details>
<summary><code>shades(hsb: readonly number[], num: number = 6): number[][]</code></summary>

Return a gradient that colors decreasing in brightness from `bri = hsb[2]` to `bri * (1-1/num)`.

The return space is the **same** as the input space.

```ts
shades([192, 78, 72, 1], 6); // [ [ 192, 78, 72, 1 ], [ 192, 78, 60, 1 ], [ 192, 78, 48.00000000000001, 1 ], [ 192, 78, 36, 1 ], [ 192, 78, 24.000000000000004, 1 ], [ 192, 78, 11.999999999999996, 1 ] ]
shades([340, 56, 73, 1], 2); // [ [ 340, 56, 73, 1 ], [ 340, 56, 36.5, 1 ] ]
```

</details>

<details>
<summary><code>tints(hsb: readonly number[], num: number = 6): number[][]</code></summary>

Return a gradient that colors decreasing in saturation from `sat = hsb[1]` to `sat * (1-1/num)`.

The return space is the **same** as the input space.

```ts
tints([55, 53, 91, 1], 6);  // [ [ 55, 53, 91, 1 ], [ 55, 44.16666666666667, 91, 1 ], [ 55, 35.333333333333336, 91, 1 ], [ 55, 26.5, 91, 1 ], [ 55, 17.666666666666668, 91, 1 ], [ 55, 8.833333333333332, 91, 1 ] ]
tints([229, 18, 96, 1], 2); // [ [ 229, 18, 96, 1 ], [ 229, 9, 96, 1 ] ]
```

</details>

<details>
<summary><code>tones(hsb: readonly number[], method: Harmony | number, num: number = 6): number[][]</code></summary>

Return a gradient that colors decreasing in both saturation (from `sat = hsb[1]` to `sat * (1-1/num)`) and brightness (from `bri = hsb[2]` to `bri * (1-1/num)`).

The return space is the **same** as the input space.

```ts
tones([203, 87, 98, 1], 6); // [ [ 203, 87, 98, 1 ], [ 203, 72.5, 81.66666666666667, 1 ], [ 203, 58.00000000000001, 65.33333333333334, 1 ], [ 203, 43.5, 49, 1 ], [ 203, 29.000000000000004, 32.66666666666667, 1 ], [ 203, 14.499999999999996, 16.33333333333333, 1 ] ]
tones([16, 100, 27, 1], 2); // [ [ 16, 100, 27, 1 ], [ 16, 50, 13.5, 1 ] ]
```

</details>

<details>
<summary><code>harmonize(hsb: readonly number[], num?: number): number[][]</code></summary>

Generate harmony palettes. The return space is **RGB**.

```ts
harmonize([287, 98, 72, 1], 'analogous');    // [ [ 54.65159999999997, 3.671999999999997, 183.6, 1 ], [ 144.61559999999997, 3.671999999999997, 183.6, 1 ], [ 183.6, 3.671999999999997, 132.62040000000002, 1 ] ]
harmonize([88, 14, 83, 1], 'shades', 3);     // [ [ 197.82219999999998, 211.64999999999998, 182.01899999999998, 1 ], [ 131.88146666666668, 141.10000000000002, 121.34600000000002, 1 ], [ 65.94073333333334, 70.55000000000001, 60.67300000000001, 1 ] ]
harmonize([97, 94, 73, 1], 'complementary'); // [ [ 78.24504999999992, 186.14999999999998, 11.169000000000011, 1 ], [ 119.07395000000007, 11.169000000000011, 186.14999999999998, 1 ] ]
```

Input a number as `method` argument will equals the order of method below. If the input is **invalid**, then it will use `'analogous'`

method | deg shift
-------|-----------
shades | none
tints  | none
shades | none
analogous | [-30, 0, 30]
triadic | [0, 120, 240]
square | [0, 90, 180, 270]
complementary | [0, 180]
split complementary | [0, 150, 210]
tetradic1 | [0, 30, 180, 210]
tetradic2 | [0, 60, 180, 240]
tetradic3 |  [0, 30, 150, 180]

</details>

<h3>Mixing</h3>

<details>
<summary><code>mix(color1: readonly number[], color2: readonly number[], weight1: number = 0.5, weight2: number= 1 - weight1): number[]</code></summary>

Mix two colors in the same color space. A JavaScript implementation of the CSS `color-mix()` function, excluding the `<color-interpolation-method>` parameter.

#### Algorithm Overview

1. Extract Alpha Values: `alpha1 = getAlpha(color1)` and `alpha2 = getAlpha(color2)`.
2. Calculate weights and alpha multiplier:

```ts
  weightSum = weight1 + weight2
  weight1p = weight1 / weightSum
  weight2p = weight2 / weightSum
  alphaMultipler = weightSum < 1 ? weightSum : 1
```

<!-- markdownlint-disable MD029 MD032 -->
3. Compute the premultiplied, interpolated result (`premul`):

- For non-alpha channels:<br/>
  `premul[nonAlpha] = weight1p * alpha1 * color1 + weight2p * alpha 2 * color2`<br/>
- For alpha channel: <br/>
  `weight1p * alpha1 + weight2p * alpha2`

<!-- markdownlint-disable MD029 MD032 -->
4. Produce the final mixed result:

- Non-alpha channels: `premul[nonAlpha] / premul[alpha]`
- Alpha channel: `premul[alpha] * alphaMultiplier`

```ts
mix([42, 62, 206, 1], [55, 202, 93, 1], 0.5, 0.5);     // [ 48.5, 132, 149.5, 1 ]
mix([42, 62, 206, 0.5], [55, 202, 93, 0.2], 0.5, 0.5); // [ 45.714285714285715, 102.00000000000001, 173.71428571428572, 0.35 ]
mix([155, 122, 126, 1], [211, 243, 242, 1], 0.2);      // [ 199.8, 218.8, 218.8, 1 ]
mix([204, 248, 241, 1], [149, 241, 118, 1], 3, 2);     // [ 182, 245.2, 191.8, 1 ]
mix([204, 248, 241, 1], [149, 241, 118, 1], 0.6, 0.4); // [ 182, 245.2, 191.8, 1 ]
```

</details>

<details>
<summary><code>meanMix(color1: readonly number[], color2: readonly number[]): number[]</code></summary>

Mix two colors in same color space with `weight1 = weight2 = 0.5`:

```js
const meanMix = (color1, color2) => mix(color1, color2)
```

```ts
meanMix([42, 62, 206, 1], [55, 202, 93, 1]);     // [ 48.5, 132, 149.5, 1 ]
meanMix([42, 62, 206, 0.5], [55, 202, 93, 0.2]); // [ 45.714285714285715, 102.00000000000001, 173.71428571428572, 0.35 ]
meanMix([155, 122, 126, 1], [211, 243, 242, 1]); // [ 183, 182.5, 184, 1 ]
```

</details>

<details>
<summary><code>gammaMix(rgb1: readonly number[], rgb2: readonly number[], gamma: number): number[]</code></summary>

Mix two RGB colors and adjust mixed color using an exponential function in the HSL space.

<!-- markdownlint-disable MD024 -->
#### Algorithm Overview

1. Compute the average RGB color: `mean = mix(rgb1, rgb2)`
2. Convert the mixed color to HSL: `hsl = rgb2hsl(mean)`
3. Adjust the saturation and lightness with the formula: `newVal = 100 * (val / 100)**gamma;`.
4. Convert the adjusted HSL color back to RGB and return the result.

#### About `gamma`

- If `gamma < 1`, the result will be ***brighter*** than `meanMix`.
- If `gamma > 1`, the result will be ***darker*** than `meanMix`.

```ts
gammaMix([42, 62, 206, 1], [55, 202, 93, 1], 0.7);     // [ 54.39561213833193, 181.8755020626048, 208.5928442623028, 1 ]
gammaMix([155, 122, 126, 1], [211, 243, 242, 1], 1.2); // [ 171.41502723522638, 171.18140357959763, 171.8822745464839, 1 ]
```

</details>

<details>
<summary><code>brighterMix(rgb1: readonly number[], rgb2: readonly number[]): number[]</code></summary>

`gammaMix` with `gamma = 0.3`.

```ts
brighterMix([42, 62, 206, 1], [55, 202, 93, 1]);     // [ 140.49399108764436, 225.63360346857013, 243.47723480588996, 1 ]
brighterMix([155, 122, 126, 1], [211, 243, 242, 1]); // [ 228.89399229092203, 224.81031497062733, 237.06134693151145, 1 ]
```

</details>

<details>
<summary><code>deeperMix(rgb1: readonly number[], rgb2: readonly number[]): number[]</code></summary>

`gammaMix` with `gamma = 1.5`.

```ts
deeperMix([42, 62, 206, 1], [55, 202, 93, 1]);     // [ 39.21213833570636, 76.37097203065198, 84.15875154755679, 1 ]
deeperMix([155, 122, 126, 1], [211, 243, 242, 1]); // [ 155.3090002573382, 155.23799850857594, 155.45100375486268, 1 ]
```

</details>

<details>
<summary><code>blendAndComposite(rgbDst: readonly number[], rgbSrc: readonly number[], blendFn: (dst: number, src: number) => number): number[]</code></summary>

Blends and composites the RGBs by a given separable blend mode.

The formula is described in Section 10 of the CSS [Compositing and Blending Level 1](https://www.w3.org/TR/compositing-1/#blendingseparable)

```ts
softLightBlend([42, 62, 206, 1], [55, 202, 93, 1], 'RGB');              // [ 22.051211072664362, 99.24922945171917, 195.2889504036909, 1 ]
softLightBlend([42, 62, 206, 1], [55, 202, 93, 1], 'RGB', 'photoshop'); // [ 22.051211072664362, 99.24922945171917, 195.2889504036909, 1 ]
softLightBlend([55, 202, 93, 1], [42, 62, 206, 1], 'RGB', 'photoshop'); // [ 26.07266435986159, 180.43158785082662, 130.55486374261477, 1 ]
```

</details>

<details>
<summary><code>softLightBlend(rgbDst: readonly number[], rgbSrc: readonly number[], formula: 'photoshop' | 'pegtop' | 'illusions.hu' | 'w3c' = 'w3c'): number[]</code></summary>

Blending two colors by soft light mode. The details of the formulas, see [wiki blend modes](https://en.wikipedia.org/wiki/Blend_modes#Soft_Light).

The algorithm follows the [CSS Compositing and Blending Level 1](https://www.w3.org/TR/compositing-1/#blending).

```ts
softLightBlend([42, 62, 206, 1], [55, 202, 93, 1], 'RGB');              // [ 22.051211072664362, 99.24922945171917, 195.2889504036909, 1 ]
softLightBlend([42, 62, 206, 1], [55, 202, 93, 1], 'RGB', 'photoshop'); // [ 22.051211072664362, 99.24922945171917, 195.2889504036909, 1 ]
softLightBlend([55, 202, 93, 1], [42, 62, 206, 1], 'RGB', 'photoshop'); // [ 26.07266435986159, 180.43158785082662, 130.55486374261477, 1 ]
```

</details>

<details>
<summary><code>additive(rgb1: readonly number[], rgb2: readonly number[]): number[]</code></summary>

Add colors in premultiplied form. Returns non-premultiplied color.

```ts
additive([42, 62, 206, 1], [55, 202, 93, 1]);           // [ 97, 255, 255, 1 ]
additive([155, 122, 126, 0.45], [211, 243, 242, 0.37]); // [ 180.2682926829268, 176.59756097560975, 178.34146341463415, 0.8200000000000001 ]
```

</details>

<details>
<summary><code>mixColors(rgbs: readonly number[][], method: Mixing | number = 'mean', ...args: unknown[]): number[]</code></summary>

Mix array of RGB colors.

```ts
type Mixing = "mean" | "brighter" | "deeper" | "soft light" | "additive" | "weighted";
```

```ts
mixColors([[42, 62, 206, 1], [55, 202, 93, 1]], 'weighted');               // [ 48.5, 132, 149.5, 1 ]
mixColors([[42, 62, 206, 1], [55, 202, 93, 1]], 'additive');               // [ 97, 255, 255, 1 ]
mixColors([[204, 248, 241, 1], [149, 241, 118, 1]], 'weighted', 0.3, 0.4); // [ 172.57142857142858, 244, 170.71428571428572, 0.7 ]
```

</details>

<h3>Contrast</h3>

The functions for adjusting contrast of colors.

<details>
<summary><code>scaling(rgbs: readonly number[][], c: number = 1): number[][]</code></summary>

Scale ths values of RGBs by multiplying `c`. The values will be clipped to [0, 255].

```ts
scaling([[17, 111, 81, 1]], 1.2); // [ [ 20.4, 133.2, 97.2, 1 ] ]
scaling([[41, 85, 4, 1]], 0.7);   // [ [ 28.7, 59.49999999999999, 2.8, 1 ] ]
```

</details>

<details>
<summary><code>gammaCorrection(rgbs: readonly number[][], gamma: number = 1): number[][]</code></summary>

Calculate the new value of RGBs by the formula `newVal = 255 * (val / 255)**gamma`.
If `gamma < 1`, the returns will brighter than original color.
If `gamma > 1`, the returns will deeper than original color.

```ts
gammaCorrection([[144, 106, 201, 1]], 2);  // [ [ 81.31764705882352, 44.062745098039215, 158.43529411764703, 1 ] ]
gammaCorrection([[234, 105, 90, 1]], 0.7); // [ [ 240.11160697162225, 137.02334443635377, 123.00756195341665, 1 ] ]
```

</details>

<details>
<summary><code>autoEnhancement(rgbs: readonly number[][]): number[][]</code></summary>

Enhance the contrast by the following steps:

1. Find minimum lightness and maximum lightness in LAB space.
2. Scaling from `[minimum, maximum]` to `[0, 100]`
3. Convert new color to RGB space and return.

```ts
autoEnhancement([
  [5, 163, 233, 1],
  [194, 37, 77, 1],
  [145, 232, 125, 1]
]);
// [
//    [ 0, 125.02543829567696, 191.690724478888, 1 ],
//    [ 69.86371869062802, 0, 0, 1 ],
//    [ 188.8852777955841, 254.99999999999997, 166.51817892633122, 1 ]
// ]
autoEnhancement([
  [171, 63, 230, 1],
  [90, 200, 208, 1],
  [71, 26, 50, 1],
  [92, 163, 219, 1],
  [29, 106, 122, 1]
]);
// [
//    [ 190.4097722619165, 82.15204189909133, 249.2232976106147, 1 ],
//    [ 165.2445276181483, 254.99999999999997, 254.99999999999997, 1 ],
//    [ 36.03888710573066, 0, 13.533818394557295, 1 ],
//    [ 144.10595642936374, 211.30225758500936, 254.99999999999997, 1 ],
//    [ 31.121144762147622, 107.45232793770546, 123.48232834193126, 1 ]
// ]
```

</details>

<details>
<summary><code>autoBrightness(rgbs: readonly number[][], coeff: number = 0.7): number[][]</code></summary>

Adjust the brightness of input RGBs.
The outputs become darker when coeff close to 0 and become brighter when coeff close to 1

1. Find mean lightness `meanL` in LAB space.
2. Calculate `gamma = log(coeff) / log(meanL / 100);`.
3. Do gamma correction to L channel with `gamma`.
4. Convert new color to RGB space and return.

```ts
autoBrightness([
  [83, 52, 58, 1],
  [195, 252, 65, 1],
  [6, 222, 72, 1]
]);
// [
//    [ 98.8893374729874, 66.65471023272066, 72.65877939106208, 1 ],
//    [ 198.6060106283326, 254.99999999999997, 68.92627267774058, 1 ],
//    [ 38.455276648225585, 231.63632627615166, 81.16402784964014, 1 ]
// ]
autoBrightness([
  [186, 97, 92, 1],
  [215, 131, 15, 1],
  [157, 126, 184, 1],
  [225, 134, 216, 1],
  [171, 66, 54, 1]
], 0.2);
// [
//    [ 84.66604273846562, 3.229276435554995, 11.960918529971233, 1 ],
//    [ 109.25947183319748, 43.64365315837561, 0, 1 ],
//    [ 64.51271668789535, 39.229167645706745, 89.7076130465058, 1 ],
//    [ 129.21558756279447, 44.197582710447534, 123.84066718653253, 1 ],
//    [ 76.32684162830617, 0, 0, 1 ]
// ]
```

</details>

<details>
<summary><code>adjContrast(rgbs: number[][], method: ContrastMethod | number, space: ColorSpace | string, ...args: number[]): number[][]</code></summary>

Adjust the contrast of array of RGB colors by specifying the method.

The inputs and output are in RGB space.

```ts
type ContrastMethod = "linear" | "gamma" | "auto enhancement" | "auto brightness";
```

```ts
adjContrast
adjContrast([
  [200, 0, 0, 1],
  [127, 127, 127, 1],
  [210, 0, 230, 1]
], 'linear', 1.2);
// [ [ 240, 0, 0, 1 ], [ 152.4, 152.4, 152.4, 1 ], [ 252, 0, 255, 1 ] ]
adjContrast([
  [200, 0, 0, 1],
  [127, 127, 127, 1],
  [210, 0, 230, 1]
], 'auto enhancement');
// [
//    [ 80.39493796300214, 0, 0, 1 ],
//    [ 254.99999999999997, 254.99999999999997, 254.99999999999997, 1 ],
//    [ 254.99999999999997, 131.07345360749287, 254.99999999999997, 1 ]
// ]
```

</details>

<h3>Sorting</h3>

Except the `distE76` function, the other color difference function is not symmetry (`f(a,b)` may not equal to `f(b,a)`).

<details>
<summary><code>diffBrightness(rgb1: readonly number[], rgb2: readonly number[]): number[][]</code></summary>

Return the difference of grayscales `rgb2gray(rgb1) - rgb2gray(rgb2)`.

```ts
rgb2gray([19, 23, 163, 1]);                           // 37.763999999999996
rgb2gray([209, 126, 194, 1]);                         // 158.56899999999996
diffBrightness([19, 23, 163, 1], [209, 126, 194, 1]); // -120.80499999999996
```

</details>

<details>
<summary><code>distE76(lab1: readonly number[], lab2: readonly number[]): number</code></summary>

Return the CIE 1976 color difference (CIE76 or E76).
Same as the L2-distance of two LAB colors.

```ts
distE76([78, -51, 75, 1], [40, 27, -28, 1]); // 134.67367968537877
distE76([34, 32, -57, 1], [57, 26, -6, 1]);  // 56.2672195865408
```

</details>

<details>
<summary><code>distE94(lab1: readonly number[], lab2: readonly number[]): number</code></summary>

Return the CIE 1994 color difference (CIE94 or E94).

```ts
distE94([78, -51, 75, 1], [40, 27, -28, 1]); // 63.73647361780924
distE94([34, 32, -57, 1], [57, 26, -6, 1]);  // 30.266846871553767
```

</details>

<details>
<summary><code>distE00(lab1: readonly number[], lab2: readonly number[]): number</code></summary>

Return CIEDE2000 color difference (CIEDE2000 or E00).

```ts
distE00([78, -51, 75, 1], [40, 27, -28, 1]); // 78.6644910780545
distE00([34, 32, -57, 1], [57, 26, -6, 1]);  // 31.97512156573645
```

</details>

<details>
<summary><code>shuffle&lt;T>(arr: T[]): T[]</code></summary>

In-place shuffle an array by Fisher-Yates shuffle.

```ts
shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]); // [ 5, 9, 6, 1, 7, 4, 8, 0, 2, 3 ]
```

</details>

<details>
<summary><code>tspGreedy&lt;T>(arr: T[], rgbGetter: (color: T) => number[], diffOp: CIEDifferenceFn, copy: boolean = false): T[]</code></summary>

Sort by Greedy algorithm.
The first item will be fixed. The second is the closest item to the first and so on.

The argument `rgbGetter` make this function can handle the object such as
`{ color : number[], otherProperty: unknown }`.

```ts
tspGreedy(
  ['White', 'Black', 'Magenta', 'Red', 'Green'],
  (name) => named2rgb(name),
  distE00
);
// [ "White", "Magenta", "Red", "Black", "Green" ]
```

</details>

<details>
<summary><code>sortColors&lt;T>(colors: readonly T[], method: Sort | number, rgbGetter: (color: T) => number[]): T[]</code></summary>

Return a sorted and copied ([cloneDeep](#clone-deep)) array of objects.

The argument `rgbGetter` make this function can handle the object such as
`{ color : number[], otherProperty: unknown }`.

```ts
type Sort =  "luminance" | "random" | "reversion" | "CIE76" | "CIE94" | "CIEDE2000";
```

method    | description
----------|------------
luminance | Ascending in brightness (grayscale)
random    | Shuffle.
reversion | Reverse the order of input array.
CIE76     | `tspGreedy` with `diffOp = distE76`.
CIE94     | `tspGreedy` with `diffOp = distE94`.
CIEDE2000 | `tspGreedy` with `diffOp = distE00`.

```ts
sortColors(
  ['White', 'Black', 'Magenta', 'Red', 'Green'],
  'CIE00',
  (name) => colors.named2rgb(name)
); // [ "White", "Magenta", "Red", "Black", "Green" ]
```

</details>

<details>
<summary><code>sortRgbs(rgbs: readonly number[][], method: Sort | number): number[][]</code></summary>

Return a sorted and copied array of RGB colors. Similar to `sortColors` but input arrays directly.

```ts
type Sort =  "brightness" | "random" | "reversion" | "CIE76" | "CIE94" | "CIEDE2000";
```

method    | description
----------|------------
brightness | Ascending in brightness (grayscale)
random    | Shuffle.
reversion | Reverse the order of input array.
CIE76     | `tspGreedy` with `diffOp = distE76`.
CIE94     | `tspGreedy` with `diffOp = distE94`.
CIEDE2000 | `tspGreedy` with `diffOp = distE00`.

```ts
sortRgbs([
  [255, 255, 255, 1],
  [0, 0, 0, 1],
  [255, 0, 255, 1],
  [255, 0, 0, 1],
  [0, 128, 0, 1]
], 'CIE00');
// [
//    [ 255, 255, 255, 1 ],
//    [ 255, 0, 255, 1 ],
//    [ 255, 0, 0, 1 ],
//    [ 0, 0, 0, 1 ],
//    [ 0, 128, 0, 1 ]
// ]
```

</details>

<h3>Helpers</h3>

Other functions that you may re-use in your code to reduce the total file size.

<details>
<summary><code>srgb2linearRgb(val: number): number</code></summary>

The input is a channel/value of RGB, not array.

The full-scale value of linear-RGB is 1 due to the calculation of CIEXYZ and relative luminance.

```ts
srgb2linearRgb(127);                 // 0.21223075741405512
linearRgb2srgb(srgb2linearRgb(127)); // 127
linearRgb2srgb(0.5);                 // 187.5160306783746
```

</details>

<details>
<summary><code>cieTrans(lab: number): number</code></summary>

The input is a channel/value of LAB, not array.

This function is part of the conversion between CIEXYZ and CIELAB. I do not know the formal name.

```ts
const cieTrans = (val: number): number => {
  return val > (6/29)**3 ? Math.cbrt(val) : (903.3 * x + 16) / 116;
};
const cieTransInv = (val: number) => {
  return val > (6/29) ? val**3 : (val - 16/116) / (903.3/116) ;
};
```

and `cieTransInv` is the inverse function of `cieTrans`.

</details>

<details id="clone-deep">
<summary><code>cloneDeep&lt;T>(obj: T): DeepWriteable&lt;T></code></summary>

Deeply clone object.

The following types will be handle:

- primitive type
- `Number`, `String`, `Boolean` (convert to primitive type)
- `Date`
- built-in object

If other type with `typeof obj === 'object'` will turn into built-in object.
The other types will not be copied.

</details>

<details>
<summary><code>map(arr, callback, len)</code></summary>

```ts
type map = {
  /**
   * Generate an array with specific length.
   */
  <R>(
    len: number,
    callback: (i: number) => R
  ): R[];
  /**
   * Similar to Array.prototype.map but this can control the length of output array .
   */
  <R, T>(
    arr: readonly T[],
    callback: (val: T, i: number) => R,
    len?: number,
  ): R[]
}
```

```ts
map(10, (i) => i);                            // [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
map([167, 96, 101, 1], (val, i) => [i, val]); // [ [ 0, 167 ], [ 1, 96 ], [ 2, 101 ], [ 3, 1 ] ]
```

In most cases, replace `Array.prototype.map` with this function can improve the performance and file size.

</details>

<h4>Numeric</h4>

<details>
<summary><code>pow(x: number, y: number): number</code></summary>

Equivalent to `x**y`. Much more faster than `x**y` and `Math.pow(x,y)` if `y` is uncertain.

```ts
if (!y) return 1;
if (!x) return 0;
return Math.exp(y * Math.log(x));
```

</details>

<details>
<summary><code>randInt(max: number): number</code></summary>

Generate a random (positive) integer in [0, `max`].

</details>

<details>
<summary><code>round(num: number, place: number = 0): number</code></summary>

Rounding a number to specific `place` value. Positive `place` means decimal places and negative means whole number places.

```ts
Math.round(10**place * num) / 10**place;
```

</details>

<details>
<summary><code>clip(num: number, min?: number, max?: number): number</code></summary>

Limit the number in the interval [`min`, `max`]. If `min` and/or `max` is `undefined`,
it will be regarded as unbound.

```ts
if (num < min!) num = min!; // max < min return min
else if (num > max!) num = max!;
return num;
```

</details>

<details>
<summary><code>rangeMapping(val: number, min: number, max: number, newMin: number, newMax: number, place?: number,): number</code></summary>

Scaling and shift to new range. If `place` is given, then round new value.

```ts
const rangeMapping = (
  val: number,
  min: number,
  max: number,
  newMin: number,
  newMax: number,
  place?: number,
) => {
  const ratio = clip((val - min) / (max - min), 0, 1); // avoid floating problem.
  const newVal = newMin + ratio * (newMax - newMin);
  return place == null ? newVal : round(newVal, place);
};
```

```ts
rangeMapping(0, -1, 1, 0, 100);  // 50
rangeMapping(0, 0, 1, 100, 200); // 100
rangeMapping(0, -1, 0, 0, 100);  // 100
rangeMapping(0, 0, 1, 100, 0);   // 100
```

</details>

<details>
<summary><code>deg2rad(deg: number): number</code> and <code>rad2deg(rad: number): number</code></summary>

Conversions between degree and radian.

</details>

<details>
<summary><code>elementwiseMean(arr1: readonly number[], arr2: readonly number[]): number[]</code></summary>

Elementwise mean of two array. The length of output is `Math.min(arr1.length, arr2.length)`.

</details>

Notice that some function only deal with fixed length.

<details>
<summary><code>dot3(arr1: readonly number[], arr2: readonly number[]): number</code></summary>

Dot two arrays with length = 3.

```ts
const dot3 = (arr1: readonly number[], arr2: readonly number[]): number => {
  return arr1[0] * arr2[0] + arr1[1] * arr2[1] + arr1[2] * arr2[2];
};
```

</details>

<details>
<summary><code>squareSum4(a: number, b: number, c: number = 0, d: number = 0): number</code></summary>

Return `a * a + b * b + c * c + d * d`.

</details>

<details>
<summary><code>l2Norm3(a: number, b: number, c: number = 0): number</code></summary>

Return `Math.sqrt(squareSum(a, b, c))`.

</details>

<details>
<summary><code>l2Dist3(a: number, b: number): number</code></summary>

```ts
const l2Dist3 = (color1: readonly number[], color2: readonly number[]): number => {
  return l2Norm3(
    color1[0] - color2[0],
    color1[1] - color2[1],
    color1[2] - color2[2]
  );
};
```

</details>

<h2 id="tests">Tests</h2>

Run command `npm run test`.

- `test/benchmark/**.perf.js`: benchmark files.
- `test/unit/**.test.js`: unit tests and comparison testing.
- `test/unit/cmyk-formula-test.js`: test whether 3 different formulas have same results.
- `test-utils/`: helpers for test.<br/>

<h2 id="benchmark">Benchmark</h2>

Run command `npm run benchmark` (conversions only-).

- Node version: v22.11.0.
- CPU: Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz
- `tinybench` 3.1.1
- libraries:
  - colord: 2.9.3
  - color: 5.0.0
  - color-convert: 3.1.0

Only list some benchmaks since some conversions have similar formula and performance.

<details>
<summary>XYZ</summary>

- 10 colors/sampling

`rgb2xyz`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 1851.1 ± 0.37% | 557289 ± 0.03% | fastest
colord        | 4297.6 ± 2.40% | 242237 ± 0.03% | 57% slower
color         | 7611.4 ± 1.77% | 137102 ± 0.06% | 75% slower
color-convert | 2476.3 ± 0.30% | 412369 ± 0.03% | 26% slower

`xyz2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 1589.6 ± 0.24% | 646723 &ensp;± 0.03% | 91% slower
colord        | 5092.7 ± 0.47% | 204191 &ensp;± 0.06% | 97% slower
color         | 9046.1 ± 2.39% | 116507 &ensp;± 0.07% | 98% slower
color-convert | 181.59 ± 1.91% | 7264901 ± 0.03% | fastest

- 500 colors/sampling

`rgb2xyz`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 91271 &ensp;± 0.43% | 11218 ± 0.20% | fastest
colord        | 254042 ± 0.52% | 4008 &ensp;± 0.34% | 64% slower
color         | 373180 ± 0.56% | 2721 &ensp;± 0.39% | 76% slower
color-convert | 119002 ± 1.08% | 8553 &ensp;± 0.19% | 24% slower

`xyz2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 80381 &ensp;± 0.32% | 12626 &ensp;± 0.15% | 96% slower
colord        | 262667 ± 0.56% | 3885 &ensp;&ensp;± 0.37% | 99% slower
color         | 433858 ± 0.57% | 2335 &ensp;&ensp;± 0.38% | 99% slower
color-convert | 3769.0 ± 0.88% | 315952 ± 0.07% | fastest

</details>

<details>
<summary>CMYK</summary>

- 10 colors/sampling

`rgb2cmyk`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 129.85 ± 0.26% | 8664019 ± 0.02% | fastest
colord        | 1129.7 ± 0.24% | 908981 &ensp;± 0.02% | 90% slower
color         | 4630.8 ± 0.67% | 230182 &ensp;± 0.06% | 97% slower
color-convert | 176.06 ± 0.93% | 7481406 ± 0.03% | 14% slower

`cmyk2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 116.87 ± 0.51% | 9347401 ± 0.01% | fastest
colord        | 1205.9 ± 3.18% | 979420 &ensp;± 0.05% | 90% slower
color         | 5833.9 ± 6.70% | 192073 &ensp;± 0.07% | 98% slower
color-convert | 222.79 ± 13.63% | 6733098 ± 0.04% | 28% slower

- 500 colors/sampling

`rgb2cmyk`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 1470.3 ± 10.16% | 799148 ± 0.05% | fastest
colord        | 65055 &ensp;± 0.49% | 15888 &ensp;± 0.22% | 98% slower
color         | 284322 ± 2.55% | 4028 &ensp;&ensp;± 0.90% | 99% slower
color-convert | 3674.3 ± 0.82% | 321108 ± 0.07% | 60% slower

`rgb2cmyk`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 1313.2 ± 0.25% | 789127 ± 0.03% | fastest
colord        | 65766 &ensp;± 5.52% | 17096 &ensp;± 0.35% | 98% slower
color         | 265675 ± 0.77% | 3887 &ensp;&ensp;± 0.44% | 100% slower
color-convert | 3715.7 ± 0.82% | 314867 ± 0.07% | 60% slower

</details>

<details>
<summary>HEX</summary>

- 10 colors/sampling

`rgb2hex`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 1380.4 ± 0.43% | 749729 ± 0.03% | fastest
colord        | 1460.9 ± 3.29% | 732326 ± 0.03% | 2% slower
color-convert | 1975.8 ± 5.27% | 562771 ± 0.05% | 25% slower

`rgb2hex` with alpha

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 1986.1 ± 0.51% | 542164 ± 0.05% | fastest
colord      | 2039.2 ± 0.49% | 516249 ± 0.04% | 5% slower

`hex2rgb` 8-digit code

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 1854.5 ± 0.36% | 558168 ± 0.03% | fastest
colord      | 2966.4 ± 1.56% | 367006 ± 0.06% | 34% slower

`hex2rgb` 4-digit code

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 1589.4 ± 0.36% | 660329 ± 0.03% | fastest
colord      | 2994.4 ± 0.76% | 367012 ± 0.07% | 44% slower

- 500 colors/sampling

`rgb2hex`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 83161 &ensp;± 0.41% | 12315 ± 0.20% | 0.54% slower
colord        | 83120 &ensp;± 0.47% | 12382 ± 0.21% | fastest
color-convert | 102251 ± 0.41% | 9980 &ensp;± 0.20% | 19% slower

`rgb2hex` with alpha

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 120211 ± 0.81% | 8697 ± 0.32% | fastest
colord      | 131973 ± 0.51% | 7780 ± 0.27% | 11% slower

`hex2rgb` 8-digit code

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 112794 ± 0.51% | 9125 ± 0.26% | fastest
colord      | 133952 ± 0.75% | 7917 ± 0.41% | 13% slower

`hex2rgb` 4-digit code

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 76974 &ensp;± 0.58% | 13528 ± 0.23% | fastest
colord      | 160052 ± 1.14% | 7078 &ensp;± 0.69% | 48% slower

</details>

<details>
<summary>HSB</summary>

- 10 colors/sampling

`rgb2hsb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 184.07 ± 0.22% | 6132417 ± 0.03% | fastest
colord        | 402.23 ± 0.25% | 2549048 ± 0.02% | 58% slower
color         | 5301.1 ± 7.57% | 210845 &ensp;± 0.05% | 97% slower
color-convert | 448.84 ± 0.97% | 2468662 ± 0.02% | 60% slower

`hsb2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 144.36 ± 0.37% | 8069004 ± 0.02% | fastest
colord        | 1532.0 ± 16.83% | 836192 &ensp;± 0.05% | 90% slower
color         | 6647.3 ± 0.73% | 161576 &ensp;± 0.08% | 98% slower
color-convert | 246.41 ± 0.86% | 4666442 ± 0.02% | 42% slower

- 500 colors/sampling

`rgb2hsb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 4229.8 ± 0.31% | 250072 ± 0.06% | fastest
colord        | 15124 &ensp;± 0.18% | 67135 &ensp;± 0.07% | 73% slower
color         | 267355 ± 5.67% | 4124 &ensp;&ensp;± 0.51% | 98% slower
color-convert | 15716 &ensp;± 0.54% | 67010 &ensp;± 0.10% | 73% slower

`hsb2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 2164.3 ± 0.38% | 479900 ± 0.04% | fastest
colord        | 61351 &ensp;± 0.81% | 17598 &ensp;± 0.27% | 96% slower
color         | 324795 ± 0.89% | 3196 &ensp;&ensp;± 0.54% | 99% slower
color-convert | 18926 &ensp;± 1.04% | 58795 &ensp;± 0.16% | 88% slower

</details>

<details>
<summary>NAMED</summary>

- 10 colors/sampling

`rgb2named`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 29979 &ensp;± 0.85% | 37930 ± 0.22% | fastest
colord        | 786384 ± 2.16% | 1372 &ensp;± 1.17% | 96% slower
color         | 91712 &ensp;± 0.95% | 11934 ± 0.39% | 69% slower
color-convert | 94868 &ensp;± 8.01% | 12105 ± 0.36% | 68% slower

`named2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 394.26 ± 1.58% | 2733943 ± 0.02% | fastest
colord        | 9224.9 ± 5.77% | 124649 &ensp;± 0.12% | 95% slower
color         | 8343.4 ± 1.21% | 136053 &ensp;± 0.13% | 95% slower
color-convert | 580.41 ± 0.76% | 1965209 ± 0.04% | 28% slower

- 500 colors/sampling

`rgb2named`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 1494846 &ensp;± 1.61% | 689 ± 1.06% | fastest
colord        | 40092764 ± 4.57% | 26 &ensp;± 3.49% | 96% slower
color         | 4001711 &ensp;± 1.34% | 252 ± 1.07% | 63% slower
color-convert | 4092342 &ensp;± 1.49% | 247 ± 1.13% | 64% slower

`named2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 20613 &ensp;± 0.49% | 51361 ± 0.14% | fastest
colord        | 426264 ± 1.00% | 2436 &ensp;± 0.63% | 95% slower
color         | 359488 ± 1.05% | 2884 &ensp;± 0.54% | 94% slower
color-convert | 41986 &ensp;± 0.64% | 25262 ± 0.21% | 51% slower

</details>

<details>
<summary>Oklab</summary>

- 10 colors/sampling

`rgb2oklab`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 2091.1 ± 0.87% | 515221 ± 0.04% | fastest

`oklab2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 1985.7 ± 1.13% | 520353 ± 0.03% | fastest

- 500 colors/sampling

`rgb2oklab`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 109435 ± 1.22% | 9961 ± 0.44% | fastest

`oklab2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 102899 ± 0.56% | 10081 ± 0.28% | fastest

</details>

<details>
<summary><code>getCSSColor</code></summary>

Our function handle more checks.<br/>

`'color-utils'`: Default option.<br/>
`'color-utils (number)'`: Pass `{ percent_: false }`.

- 10 colors/sampling

To RGB string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 6018.5 ± 0.71% | 174172 &ensp;± 0.12% | 95% slower
color-utils (number) | 3191.5 ± 0.92% | 334829 &ensp;± 0.10% | 91% slower
colord               | 290.57 ± 0.96% | 3756317 ± 0.05% | fastest
color                | 38882 &ensp;± 6.43% | 33738 &ensp;&ensp;± 0.82% | 99% slower

`rgb2hsl` + to HSL string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 5375.8 ± 0.85% | 195076 &ensp;± 0.10% | 88% slower
color-utils (number) | 5045.2 ± 0.61% | 206123 &ensp;± 0.11% | 88% slower
colord               | 620.55 ± 0.36% | 1659794 ± 0.03% | fastest
color                | 35389 &ensp;± 0.89% | 29402 &ensp;&ensp;± 0.28% | 98% slower

`rgb2xyz` + to XYZ string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 9963.4 ± 0.76% | 104127 ± 0.13% | 5% slower
color-utils (number) | 9776.7 ± 2.98% | 107502 ± 0.13% | 2% slower
colord               | 9341.9 ± 1.38% | 109684 ± 0.11% | fastest
color                | 44828 &ensp;± 1.68% | 23190 &ensp;± 0.28% | 79% slower

`rgb2lab` + to LAB string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 11020 ± 0.87% | 94895 &ensp;± 0.15% | 8% slower
color-utils (number) | 10614 ± 0.95% | 97590 &ensp;± 0.12% | 5% slower
colord               | 10011 ± 0.70% | 103238 ± 0.13% | fastest
color                | 54261 ± 1.75% | 19497 &ensp;± 0.42% | 81% slower

- 500 colors/sampling

To RGB string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 466996 &ensp;± 2.13% | 2236 &ensp;&ensp;± 1.28% | 98% slower
color-utils (number) | 147629 &ensp;± 1.10% | 7009 &ensp;&ensp;± 0.60% | 94% slower
colord               | 8732.8 &ensp;± 0.19% | 116532 ± 0.10% | fastest
color                | 1683490 ± 5.91% | 673 &ensp;&ensp;&ensp;± 4.59% | 99% slower

`rgb2hsl` + to HSL string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 556784 &ensp;± 2.23% | 1874 &ensp;± 1.40% | 94% slower
color-utils (number) | 511215 &ensp;± 1.73% | 2013 &ensp;± 1.10% | 94% slower
colord               | 32317 &ensp;&ensp;± 0.39% | 31506 ± 0.21% | fastest
color                | 1854376 ± 2.88% | 551 &ensp;&ensp;± 1.89% | 98% slower

`rgb2xyz` + to XYZ string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 632035 &ensp;± 1.91% | 1621 ± 1.10% | 4% slower
color-utils (number) | 660439 &ensp;± 2.42% | 1580 ± 1.51% | 6% slower
colord               | 611214 &ensp;± 2.01% | 1684 ± 1.20% | fastest
color                | 2190144 ± 1.91% | 461 &ensp;± 1.45% | 73% slower

`rgb2lab` + to LAB string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 729195 &ensp;± 1.21% | 1388 ± 0.91% | 7% slower
color-utils (number) | 698240 &ensp;± 2.53% | 1488 ± 1.44% | fastest
colord               | 698107 &ensp;± 2.23% | 1484 ± 1.47% | 0.27% slower
color                | 2532094 ± 1.79% | 398 &ensp;± 1.60% | 73% slower

</details>

<details>
<summary>manipulation</summary>

- 10 times/sampling

Adjust 10 colors per sampling

 Contrast | Latency avg (ns) | Throughput avg (ops/s) | Comparison
----------|------------------|------------------------|------------
linear           | 1025.1 ± 1.06% | 1077923 ± 0.03% | fastest
gamma            | 3220.9 ± 8.49% | 350958 &ensp;± 0.05% | 67% slower
auto enhancement | 5087.3 ± 0.49% | 201488 &ensp;± 0.03% | 81% slower
auto brightness  | 5280.8 ± 0.25% | 191545 &ensp;± 0.03% | 82% slower

Harmony: analogous. Generate 3 colors for 10 times

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 3907.0 ± 0.94% | 276206 ± 0.04% | fastest
colord      | 6293.9 ± 0.66% | 170207 ± 0.07% | 38% slower

Harmony: shades. Generate 6 colors for 10 times

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 7509.4 ± 0.45% | 137697 ± 0.04% | fastest
colord      | 112589 ± 1.21% | 9072 &ensp;&ensp;± 0.18% | 93% slower

Mix index `i` and index `i-1` for i = 1, 2, ..., 9.

 Mixing | Latency avg (ns) | Throughput avg (ops/s) | Comparison
--------|------------------|------------------------|------------
mean       | 2557.6 ± 0.47% | 410112 ± 0.03% | 23% slower
brighter   | 5644.8 ± 0.53% | 187776 ± 0.06% | 65% slower
deeper     | 5167.1 ± 1.89% | 203618 ± 0.04% | 62% slower
soft light | 2986.2 ± 0.51% | 348301 ± 0.03% | 35% slower
additive   | 2054.4 ± 6.31% | 533152 ± 0.03% | fastest
weighted   | 2664.4 ± 0.61% | 392661 ± 0.03% | 26% slower

Sort 5 colors for 6 times

 Sorting | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
luminance | 24254 ± 0.52% | 43674 ± 0.12% | 13% slower
random    | 20884 ± 0.51% | 50126 ± 0.10% | fastest
reversion | 21663 ± 1.23% | 49685 ± 0.15% | 0.88% slower
CIE76     | 36281 ± 0.51% | 28604 ± 0.14% | 43% slower
CIE94     | 36974 ± 0.47% | 27938 ± 0.13% | 44% slower
CIEDE2000 | 74629 ± 0.41% | 13667 ± 0.16% | 73% slower

- 500 times/sampling

Adjust 500 colors per sampling

 Contrast | Latency avg (ns) | Throughput avg (ops/s) | Comparison
----------|------------------|------------------------|------------
linear           | 40253 &ensp;± 0.73% | 26648 ± 0.18% | fastest
gamma            | 148119 ± 0.46% | 6863 &ensp;± 0.22% | 74% slower
auto enhancement | 245359 ± 0.51% | 4125 &ensp;± 0.24% | 85% slower
auto brightness  | 282041 ± 2.13% | 3624 &ensp;± 0.27% | 86% slower

Harmony: analogous. Generate 3 colors for 500 times.

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 346802 ± 8.85% | 3725 ± 1.13% | fastest
colord      | 355089 ± 2.22% | 3243 ± 1.00% | 13% slower

Harmony: shades. Generate 6 colors for 500 times.

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 460044 &ensp;± 3.19% | 2493 ± 1.02% | fastest
colord      | 6900347 ± 4.51% | 152 &ensp;± 2.75% | 94% slower

Mix index `i` and index `i-1` for i = 1, 2, ..., 499.

 Mixing | Latency avg (ns) | Throughput avg (ops/s) | Comparison
--------|------------------|------------------------|------------
mean       | 119549 ± 0.47% | 8594 &ensp;± 0.27% | 37% slower
brighter   | 237917 ± 0.39% | 4252 &ensp;± 0.27% | 69% slower
deeper     | 284104 ± 0.52% | 3575 &ensp;± 0.34% | 74% slower
soft light | 159288 ± 0.46% | 6417 &ensp;± 0.29% | 53% slower
additive   | 75697 &ensp;± 0.51% | 13711 ± 0.22% | fastest
weighted   | 123320 ± 0.38% | 8249 &ensp;± 0.21% | 40% slower

Sort 500 colors per sampling.

 Sorting | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
brightness | 591173 &ensp;&ensp;± 0.65% | 1714 ± 0.47% | 40% slower
random     | 363527 &ensp;&ensp;± 0.56% | 2787 ± 0.33% | 2% slower
reversion  | 358122 &ensp;&ensp;± 0.59% | 2834 ± 0.35% | fastest
CIE76      | 3701331 &ensp;± 1.22% | 272 &ensp;± 0.92% | 90% slower
CIE94      | 5516852 &ensp;± 2.07% | 184 &ensp;± 1.36% | 94% slower
CIEDE2000  | 47501561 ± 0.86% | 21 &ensp;&ensp;± 0.78% | 99% slower

</details>

<details>
<summary>some other fcuntions</summary>

- 10 colors/sampling

`rgb2hue`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 177.53 ± 0.23% | 6435262 ± 0.03% | fastest
colord      | 220.86 ± 0.22% | 4706358 ± 0.01% | 27% slower
color       | 5044.5 ± 5.06% | 214733 &ensp;± 0.04% | 97% slower

`isReadable`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 2941.2 ± 0.11% | 345725 ± 0.03% | 34% slower
colord      | 1942.5 ± 2.46% | 526095 ± 0.02% | fastest

- 500 colors/sampling

`rgb2hue`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 4711.2 ± 0.87% | 223607 ± 0.06% | fastest
colord      | 5920.9 ± 0.16% | 174818 ± 0.06% | 22% slower
color       | 251684 ± 0.89% | 4116 &ensp;&ensp;± 0.43% | 98% slower

`isReadable`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 170644 ± 0.46% | 5961 &ensp;± 0.26% | 80% slower
colord      | 34777 &ensp;± 0.24% | 29229 ± 0.11% | fastest

</details>

<h2>Others</h2>

<div id="mangle">

:grey_question: Some properties with underscore `_` at the end of name.<br/>
:speech_balloon: Theese properties can be mangled by minifier, such as `terser`, by setting `mangle.properties.regex = /[^_]_$/`.

:grey_exclamation: The `mangle.properties` may cause error when minifying multiple files.<br/>
:speech_balloon: Because the mangled names are different in different files.<br/>
This can be solved by setting `nameCache: {}` (terser) or create a [custom plugin](#terser-plugin) for bundler (if `nameCache` in @rollup/plugin-terser or vite.config does not work).

:exclamation: `nameCache` may **not** work in Nuxt.

  <details id="terser-plugin">
  <summary>custom rollup plugin</summary>

  In this repository [github terser-plugin.ts](https://github.com/johnny95731/color-utils/blob/main/terser-plugin.ts)

  ```ts
  import { minify } from 'terser';

  const defaultOptions = {
    compress: {
      toplevel: true,
    },
    mangle: {
      toplevel: true,
      properties: {
        regex: /[^_]_$/
      }
    },
    nameCache: undefined
  };
  ```

  Plugin:

  ```ts

  export default (
    options
  ) => {
    const mergedOption = mergeDeep({}, defaultOptions, options);
    return {
      name: 'terser',
      renderChunk: {
        order: 'post',
        async handler(code) {
          if (!/(m|c)?js$/.test(chunk.fileName)) return;
          const result = await minify(code, mergedOption);
          return {
            code: result.code!
          };
        },
      }
    };
  };
  ```

  or

  ```ts
  export default (
    outDir = ['./dist'],
    options
  ) => {
    const mergedOption = mergeDeep({}, defaultOptions, options);
    return {
      name: 'terser',
      closeBundle: {
        order: 'post',
        sequential: true,
        async handler() {
          for (const path of outDir) {
            const files = fs.readdirSync(path)
              .filter((filename) => /\.(js|mjs|cjs)$/.test(filename));
            for (const filename of files) {
              const filePath = `${path}/${filename}`;
              const code = fs.readFileSync(filePath, 'utf-8');
              const result = await minify(code, mergedOption);
              if (result.code) fs.writeFileSync(filePath, result.code, 'utf8');
            }
          }
        },
      },
    }
  }
  ```

  </details>
</div>
