<h1>color-utils</h1>

**color-utils** provides functions for color conversions, harmonies, mix, and sort.

:speech_balloon: Newer README.md may push to github but not publish in npm. To see detail changes: [Changelog](https://github.com/johnny95731/color-utils/blob/main/CHANGELOG.md) (record since v1.2.0).

<h2>Features</h2>

- ***Small***: 10.7KB for **conversions only**. 14.6KB in total (13.1KB with [mangle.properties.regex](#mangle)). (with minifying)
- High performance. [Benchmark](#benchmark)
- Detect browser [`<color>`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) support when getting string.
- Functions instead of object. Tree-shaking and minifying are more simpler.
- Immutable.
- Typed.
- Supports ESM and CJS.
- No dependencies

<h2>Install</h2>

```shell
npm install @johnny95731/color-utils
```

<h2>Usage</h2>

```js
import { rgb2hex, rgb2hsb, rgb2gray, randRgbGen } from '@johnny95731/color-utils';

const rgb = randRgbGen(); // [0, 127, 200];

rgb2hex(rgb);  // "#007FC8"
rgb2hsb(rgb);  // [ 201.9, 100, 78.43137254901961 ]
rgb2gray(rgb); // 97.34899999999999
```

<h2>Supported Color Spaces</h2>

More infomations abous color spaces: [Color Space Ranges](#color-space-ranges)

- RGB
- HEX (including 3 and 6 digits.)
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
<summary><code>randRgbGen(): number[]</code></summary>

Return a random RGB array.

</details>

<h3>Basic Conversions</h3>

The naming of converters is connecting input space and output space with a letter 2(to). Most conversinons are group of two, rgb2space and space2rgb. For example, `rgb2hsl` and `hsl2rgb`.

```js
// HEX
const hex = rgb2hex([1, 100, 255]); // "#0164FF"
const rgb = hex2rgb(hex);           // [ 1, 100, 255 ]

// HSL
const hsl = rgb2hsl([1, 100, 255]); // [ 216.61417322834643, 100, 50.19607843137255 ]
const rgb = hsl2rgb(hsl);           // [ 0.9999999999999964, 100.00000000000004, 255 ]

// HSB
const hsb = rgb2hsb([1, 100, 255]); // [ 216.61417322834643, 99.6078431372549, 100 ]
const rgb = hsb2rgb(hsb);           // [ 0.9999999999999964, 100.00000000000004, 255 ]

// HWB
const hwb = rgb2hwb([1, 100, 255]); // [ 216.61417322834643, 0.39215686274509803, 0 ]
const rgb = hwb2rgb(hwb);           // [ 0.9999999999999964, 100.00000000000004, 255 ]

// CMYK
const cmyk = rgb2cmyk([1, 100, 255]); // [ 99.6078431372549, 60.7843137254902, 0, 0 ]
const rgb  = cmyk2rgb(cmyk);          // [ 0.9999999999999964, 99.99999999999999, 255 ]

// NAMED
const named = rgb2named([1, 100, 255]); // "DodgerBlue"
const rgb   = named2rgb(named);         // [ 30, 144, 255 ]

// XYZ
const xyz = rgb2xyz([1, 100, 255]); // [ 22.613136041016254, 16.337688949026983, 96.5499520366833 ]
const rgb = xyz2rgb(xyz);           // [ 1.0000000000002303, 100, 254.99999999999997 ]

// LAB
const lab = rgb2lab([1, 100, 255]); // [ 47.41444304992909, 36.482845533090725, -82.80897290339001 ]
const rgb = lab2rgb(lab);           // [ 1.0000000000000473, 100.00000000000001, 254.99999999999997 ]

// LCHab
const lchab = rgb2lchab([1, 100, 255]); // [ 47.41444304992909, 90.4893585539523, 293.7766742151484 ]
const rgb   = lchab2rgb(lchab);         // [ 1.0000000000000473, 100.00000000000001, 254.99999999999997 ]

// LUV
const luv = rgb2luv([1, 100, 255]); // [ 47.41444304992909, -21.908342012473863, -126.05599759161 ]
const rgb = luv2rgb(luv);           // [ 0.9999171617417457, 100.00000667555592, 254.99998841698246 ]

// LCHuv
const lchuv = rgb2lchuv([1, 100, 255]); // [ 47.41444304992909, 127.94565244099353, 260.1405639338026 ]
const rgb   = lchuv2rgb(lchuv);         // [ 0.9999171617399168, 100.00000667555597, 254.99998841698252 ]

// Oklab
const oklab = rgb2oklab([1, 100, 255]); // [ 0.5597865171261192, -0.03749415892366231, -0.24017306119022924 ]
const rgb   = oklab2rgb(oklab);         // [ 1.0000000000002303, 99.9999999999999, 254.99999999999997 ]

// Oklch
const oklch = rgb2oklch([1, 100, 255]); // [ 0.5597865171261192, 0.24308210809287967, 261.12699837778 ]
const rgb   = oklch2rgb(oklch);         // [ 0.9999999999996816, 99.99999999999994, 254.99999999999997 ]
```

<div>

***Error Handling***

`hex2rgb` and `named2rgb` return `[0, 0, 0]` when the input is invalid.
</div>

<h3><code>ColorSpace</code>Type</h3>

`COLOR_SPACES` array stores `ColorSpace` objects, which contains informations about spaces

key   | info
------|------
name_ | Name of color space
isSupported_ | In browser environment, the value will be initialized by calling `CSS.supports('color', 'space(0 0 0)');`. In node environment, the value will be set to default value as below.
labels_ | Labels of channels.
max_ | Ranges of channels.
fromRgb_ | Converter from RGB to space.
toRgb_ | Converter from space to RGB.

Note: `COLOR_SPACES` does not have HEX and NAMED space. And, both `LCHab` and `LCHuv` will check `CSS.supports('color', 'lch(0 0 0)');` though these two spaces are not equvalent.

<details>
<summary>Default values of <code>ColorSpace.isSupported_</code></summary>

 space | value
-------|-----------
RGB    | `true`
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

```js
toSpace([176, 59, 79], 'RGB', 'XYZ'); // [ 20.88159899406145, 12.925309240980702, 8.790857610353417 ]
rgb2xyz([176, 59, 79]);               // [ 20.88159899406145, 12.925309240980702, 8.790857610353417 ]
```

</details>

<details>
<summary><code>getCssColor(color: readonly number[], space: ColorSpace | string, options?: CssColorOptions): string</code></summary>

Convert the color to string.

If `checkSupport` is `true`, then the function will set `sep = ' '` and change the color space to RGB when the browser does not support this color space.

```js
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
<summary>HSL</summary>

channel | description | min | max
--------|-------------|-----|-----
h | Hue        | 0 | 360
s | Saturation | 0 | 100
l | Luminance  | 0 | 100

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

```js
rgb2gray([1, 100, 255]); // 88.06899999999999
```

</details>

<details>
<summary><code>isLight(rgb: readonly number[] | string): boolean</code></summary>

Return `true` if the grayscale value of an RGB array or a hex string is greater than 127.5. Otherwise, return `false`. [rgb2gray](#rgb2gray)

```js
rgb2gray([156, 49, 93]); // 86.009
isLight([156, 49, 93]);  // false

rgb2gray('#E6ECB6');     // 228.04999999999995
isLight('#E6ECB6');      // true
```

</details>

<details>
<summary><code>rgb2hue(rgb: readonly number[]): number</code></summary>

Hue of RGB. Note that this value is different from hue of CIELCH.

```js
rgb2hue([1, 100, 255]); // 216.61417322834643
```

</details>

<details>
<summary><code>getRelativeLuminance(rgb: readonly number[] | string): number</code></summary>

Return the relative luminance (within `[0, 1]`) of an RGB array or a hex string.
See: [WCAG2.0 relative luminance](https://www.w3.org/TR/WCAG20/#relativeluminancedef)

```js
getRelativeLuminance([191, 123, 86]);   // 0.259141693330052
getRelativeLuminance([0, 0, 0]);        // 0
getRelativeLuminance([255, 255, 255]);  // 1
```

</details>

<details>
<summary><code>getContrastRatio(rgb1: readonly number[] | string, rgb2: readonly number[] | string): number</code></summary>

Return the contrast ratio of two RGB colors.
See: [WCAG2.0 contrast ratio](https://www.w3.org/TR/WCAG20/#contrast-ratiodef)

```js
getContrastRatio([191, 123, 86], [230, 236, 182]); // 2.759999999999999
getContrastRatio([0, 0, 0], '#FFF');               // 20.99999999999999
getContrastRatio('FFF', [0, 0, 0]);                // 20.99999999999999
```

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

```js
isReadable([191, 123, 86], [230, 236, 182]);       // false
isReadable('000', '#FFF', { levelAAA: true });     // true
isReadable('987654', '123456');                    // false
isReadable('987654', '123456', { isLarge: true }); // true
isReadable('987654', '123456', { isLarge: true, levelAAA: true }) // false
```

</details>

<h3>Harmony</h3>
Some function arguments naming hsb, but the method works in HSL or HWB space.

<details>
<summary><code>shiftHue(primary: readonly number[], degs: number[]): number[][]</code></summary>

Return a palette that each color is the hue shift of primary. The primary color should be HSB, HSL, HWB color, or color space that first channel represents hue.

The return space is the **same** as the input space.

```js
shiftHue([43, 12, 94], [0, 30, 60]);    // [ [ 43, 12, 94 ], [ 73, 12, 94 ], [ 103, 12, 94 ] ]
shiftHue([159, 76, 84], [0, 120, 240]); // [ [ 159, 76, 84 ], [ 279, 76, 84 ], [ 399, 76, 84 ] ]
```

</details>

<details>
<summary><code>shades(hsb: readonly number[], num: number = 6): number[][]</code></summary>

Return a gradient that colors decreasing in brightness from `bri = hsb[2]` to `bri * (1-1/num)`.

The return space is the **same** as the input space.

```js
shades([26, 83, 90], 6); // [ [ 26, 83, 90 ], [ 26, 83, 75 ], [ 26, 83, 60 ], [ 26, 83, 45 ], [ 26, 83, 30 ], [ 26, 83, 15 ] ]
shades([84, 39, 80], 2); // [ [ 84, 39, 80 ], [ 84, 39, 40 ] ]
```

</details>

<details>
<summary><code>tints(hsb: readonly number[], num: number = 6): number[][]</code></summary>

Return a gradient that colors decreasing in saturation from `sat = hsb[1]` to `sat * (1-1/num)`.

The return space is the **same** as the input space.

```js
tints([346, 83, 100], 6); // [ [ 346, 83, 100 ], [ 346, 69.17, 100 ], [ 346, 55.33, 100 ], [ 346, 41.5, 100 ], [ 346, 27.67, 100 ], [ 346, 13.83, 100 ] ]
tints([7, 30, 58], 2);    // [ [ 7, 30, 58 ], [ 7, 15, 58 ] ]
```

</details>

<details>
<summary><code>tones(hsb: readonly number[], method: Harmony | number, num: number = 6): number[][]</code></summary>

Return a gradient that colors decreasing in both saturation (from `sat = hsb[1]` to `sat * (1-1/num)`) and brightness (from `bri = hsb[2]` to `bri * (1-1/num)`).

The return space is the **same** as the input space.

```js
tones([256, 51, 52], 6); // [ [ 256, 51, 52 ], [ 256, 42.5, 43.33 ], [ 256, 34, 34.67 ], [ 256, 25.5, 26 ], [ 256, 17, 17.33 ], [ 256, 8.5, 8.67 ] ]
tones([342, 95, 73], 2); // [ [ 342, 95, 73 ], [ 342, 47.5, 36.5 ] ]
```

</details>

<details>
<summary><code>harmonize(hsb: readonly number[], num?: number): number[][]</code></summary>

Generate harmony palettes. The return space is **RGB**.

```js
harmonize([54, 98, 47], 'analogous');      // [ [ 119.85, 49.38, 2.4 ], [ 119.85, 108.1, 2.4 ], [ 72.87, 119.85, 2.40 ] ]
harmonize([58, 64, 48], 'shades', 3);      // [ [ 122.4, 119.8, 44.064 ], [ 81.6, 79.8592, 29.38 ], [ 40.8, 39.93, 14.69 ] ]
harmonize([131, 98, 76], 'complementary'); // [ [ 3.88, 193.8, 38.7 ], [ 193.8, 3.88, 158.98 ] ]
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

Mixing two colors by evaluate weighted sum `weight1 * color1 + weight2 * color2`.<br/>
The weights will be normalized to 1 if their sum > 1.

```js
mix([42, 62, 206], [55, 202, 93], 0.5, 0.5);     // [ 48.5, 132, 149.5 ]
mix([155, 122, 126], [211, 243, 242], 0.2);      // [ 199.8, 218.8, 218.8 ]
mix([204, 248, 241], [149, 241, 118], 3, 2);     // [ 182, 245.2, 191.8 ]
mix([204, 248, 241], [149, 241, 118], 0.6, 0.4); // [ 182, 245.2, 191.8 ]
```

</details>

<details>
<summary><code>meanMix(color1: readonly number[], color2: readonly number[]): number[]</code></summary>

Return the elementwise mean of two colors.

```js
meanMix([42, 62, 206], [55, 202, 93]);     // [ 48.5, 132, 149.5 ]
meanMix([155, 122, 126], [211, 243, 242]); // [ 183, 182.5, 184 ]
```

</details>

<details>
<summary><code>gammaMix(rgb1: readonly number[], rgb2: readonly number[], gamma: number): number[]</code></summary>

1. Evaluate the elementwise mean `mean` of colors.
2. Convert `mean` to HSL space.
3. Evaluate new saturation and luminance: `newVal = 100 * (val / 100)**gamma;`.
4. Convert new HSL color to original space and return.

The inputs and output are in RGB space.

If `gamma < 1`, the returns will ***brighter*** than `meanMix`.
If `gamma > 1`, the returns will ***deeper*** than `meanMix`.

```js
gammaMix([42, 62, 206], [55, 202, 93], 0.7);     // [ 54.39561213833195, 181.8755020626048, 208.5928442623028 ]
gammaMix([155, 122, 126], [211, 243, 242], 1.2); // [ 171.41502723522638, 171.18140357959763, 171.8822745464839 ]
```

</details>

<details>
<summary><code>brighterMix(rgb1: readonly number[], rgb2: readonly number[]): number[]</code></summary>

`gammaMix` with `gamma = 0.3`.

The inputs and output are in RGB space.

```js
brighterMix([42, 62, 206], [55, 202, 93]);     // [ 140.49399108764436, 225.63360346857013, 243.47723480588996 ]
brighterMix([155, 122, 126], [211, 243, 242]); // [ 228.89399229092206, 224.81031497062736, 237.06134693151148 ]
```

</details>

<details>
<summary><code>deeperMix(rgb1: readonly number[], rgb2: readonly number[]): number[]</code></summary>

`gammaMix` with `gamma = 1.5`.

The inputs and output are in RGB space.

```js
deeperMix([42, 62, 206], [55, 202, 93]);     // [ 39.21213833570636, 76.37097203065198, 84.1587515475568 ]
deeperMix([155, 122, 126], [211, 243, 242]); // [ 155.3090002573382, 155.2379985085759, 155.4510037548627 ]
```

</details>

<details>
<summary><code>softLightBlend(rgb1: readonly number[], rgb2: readonly number[], formula: 'photoshop' | 'pegtop' | 'illusions.hu' | 'w3c' = 'w3c'): number[]</code></summary>

See [wiki blend modes](https://en.wikipedia.org/wiki/Blend_modes#Soft_Light).
The order of input color will influence the result.

The inputs and output are in RGB space.

```js
softLightBlend([42, 62, 206], [55, 202, 93], 'RGB');              // [ 22.051211072664362, 99.24922945171917, 195.2889504036909 ]
softLightBlend([42, 62, 206], [55, 202, 93], 'RGB', 'photoshop'); // [ 22.05121107266436, 99.24288450324661, 195.28895040369088 ]
softLightBlend([55, 202, 93], [42, 62, 206], 'RGB', 'photoshop'); // [ 26.072664359861598, 180.4315878508266, 130.55486374261477 ]
```

</details>

<details>
<summary><code>additive(rgb1: readonly number[], rgb2: readonly number[]): number[]</code></summary>

Add their RGB values.

The inputs and output are in RGB space.

```js
additive([42, 62, 206], [55, 202, 93]);     // [ 97, 255, 255 ]
additive([155, 122, 126], [211, 243, 242]); // [ 255, 255, 255 ]
```

</details>

<details>
<summary><code>mixColors(rgbs: readonly number[][], method: Mixing | number = 'mean'): number[]</code></summary>

Mix colors (at least two) by specifying the method.
The return space is the **same** as the input space.

The inputs and output are in RGB space.

```ts
type Mixing =  "additive" | "mean" | "brighter" | "deeper" | "soft light" | "weighted";
```

</details>

<h3>Contrast</h3>

The functions for adjusting contrast of colors.

<details>
<summary><code>scaling(rgbs: readonly number[][], c: number = 1): number[][]</code></summary>

Scale ths values of RGBs by multiplying `c`.
The values will be clipped to `[0, 255]`.

The inputs and output are in RGB space.

```js
scaling([170, 107, 170], 1.2); // [ [ 204, 128.4, 204 ] ]
scaling([146, 167, 40], 0.7);  // [ [ 102.2, 116.9, 28 ] ]
```

</details>

<details>
<summary><code>gammaCorrection(rgbs: readonly number[][], gamma: number = 1): number[][]</code></summary>

Calculate the new value of RGBs by the formula `newVal = 255 * (val / 255)**gamma`.
If `gamma < 1`, the returns will brighter than original color.
If `gamma > 1`, the returns will deeper than original color.

The inputs and output are in RGB space.

The inputs and output are in RGB space.

```js
gammaCorrection([148, 241, 14], 2);  // [ [ 85.9, 227.77, 0.77 ] ]
gammaCorrection([178, 4, 200], 0.7); // [ [ 198.27, 13.91, 215.12 ] ]
```

</details>

<details>
<summary><code>autoEnhancement(rgbs: readonly number[][]): number[][]</code></summary>

Enhance the contrast by the following steps:

1. Find minimum lightness and maximum lightness in LAB space.
2. Scaling from `[minimum, maximum]` to `[0, 100]`
3. Convert new color to RGB space and return.

The inputs and output are in RGB space.

</details>

<details>
<summary><code>autoBrightness(rgbs: readonly number[][], coeff: number = 0.7): number[][]</code></summary>

Adjust the brightness of input RGBs.
The outputs become darker when coeff close to 0 and become brighter when coeff close to 1

1. Find mean lightness `meanL` in LAB space.
2. Calculate `gamma = log(coeff) / log(meanL / 100);`.
3. Do gamma correction to L channel with `gamma`.
4. Convert new color to RGB space and return.

The inputs and output are in RGB space.

</details>

<details>
<summary><code>adjContrast(rgbs: number[][], method: ContrastMethod | number, space: ColorSpace | string, ...args: number[]): number[][]</code></summary>

Adjust the contrast of array of RGB colors by specifying the method.

The inputs and output are in RGB space.

```ts
type ContrastMethod = "linear" | "gamma" | "auto enhancement" | "auto brightness";
```

</details>

<h3>Sorting</h3>

Except the `distE76` function, the other color difference function is not symmetry (`f(a,b)` may not equal to `f(b,a)`).

<details>
<summary><code>diffLuminance(rgb1: readonly number[], rgb2: readonly number[]): number[][]</code></summary>

Return the difference of grayscales `rgb2gray(rgb1) - rgb2gray(rgb2)`.
</details>

<details>
<summary><code>distE76(lab1: readonly number[], lab2: readonly number[]): number</code></summary>

Return the CIE 1976 color difference (CIE76 or E76).
Same as the L2-distance of two LAB colors.

</details>

<details>
<summary><code>distE94(lab1: readonly number[], lab2: readonly number[]): number</code></summary>

Return the CIE 1994 color difference (CIE94 or E94).

</details>

<details>
<summary><code>distE00(lab1: readonly number[], lab2: readonly number[]): number</code></summary>

Return CIEDE2000 color difference (CIEDE2000 or E00).

</details>

<details>
<summary><code>shuffle&lt;T>(arr: T[]): T[]</code></summary>

In-place shuffle an array by Fisher-Yates shuffle.

</details>

<details>
<summary><code>tspGreedy&lt;T>(arr: T[], rgbGetter: (color: T) => number[], diffOp: CIEDifferenceFn, copy: boolean = false): T[]</code></summary>

Sort by Greedy algorithm.
The first item will be fixed. The second is the closest item to the first and so on.

The argument `rgbGetter` make this function can handle the object such as
`{ color : number[], otherProperty: unknown }`.

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

</details>

<details>
<summary><code>sortRgbs(rgbs: readonly number[][], method: Sort | number): number[][]</code></summary>

Return a sorted and copied array of RGB colors. Similar to `sortColors` but input arrays directly.

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

</details>

<h3>Helpers</h3>

Other functions that you may re-use in your code to reduce the total file size.

<details>
<summary><code>srgb2linearRgb(val: number): number</code></summary>

The input is a channel/value of RGB, not array.

The full-scale value of linear-RGB is 1 due to the calculation of CIEXYZ and relative luminance.

```js
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

In most cases, replace `Array.prototype.map` with this function can improve the performance and file size.

</details>

<h4>Numeric</h4>

<details>
<summary><code>pow(x: number, y: number): number</code></summary>

Equivalent to `x**y`. Much more faster than `x**y` and `Math.pow(x,y)` if `y` is uncertain.

For square, simply write `x * x`.

```ts
if (!x && !y) return 1;
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
color-utils   | 1865.8 ± 0.43% | 555434 ± 0.03% | fastest
colord        | 4862.5 ± 4.41% | 218174 ± 0.04% | 61% slower
color         | 7650.0 ± 1.64% | 137757 ± 0.06% | 75% slower
color-convert | 2403.0 ± 0.60% | 433481 ± 0.03% | 22% slower

`xyz2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 1695.1 ± 0.46% | 625703 &ensp;± 0.04% | 90% slower
colord        | 5378.7 ± 0.74% | 198918 &ensp;± 0.07% | 97% slower
color         | 9757.8 ± 0.66% | 110553 &ensp;± 0.10% | 98% slower
color-convert | 236.55 ± 2.35% | 6090139 ± 0.04% | fastest

- 500 colors/sampling

`rgb2xyz`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 90272 &ensp;± 0.34% | 11258 ± 0.17% | fastest
colord        | 274760 ± 1.66% | 3774 &ensp;± 0.40% | 66% slower
color         | 409022 ± 1.10% | 2560 &ensp;± 0.68% | 77% slower
color-convert | 125684 ± 0.74% | 8254 &ensp;± 0.30% | 27% slower

`xyz2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 80871 &ensp;± 0.41% | 12657 &ensp;± 0.20% | 96% slower
colord        | 255404 ± 0.55% | 3995 &ensp;&ensp;± 0.37% | 99% slower
color         | 446865 ± 0.66% | 2278 &ensp;&ensp;± 0.46% | 99% slower
color-convert | 4066.0 ± 0.98% | 305446 ± 0.09% | fastest

</details>

<details>
<summary>CMYK</summary>

- 10 colors/sampling

`rgb2cmyk`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 126.29 ± 0.76% | 9012903 ± 0.02% | fastest
colord        | 2473.6 ± 0.18% | 410141 &ensp;± 0.02% | 95% slower
color         | 6013.0 ± 0.93% | 177287 &ensp;± 0.05% | 98% slower
color-convert | 225.98 ± 1.75% | 6218964 ± 0.04% | 31% slower

`cmyk2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 128.49 ± 0.53% | 8784196 ± 0.02% | fastest
colord        | 1437.3 ± 1.26% | 781985 &ensp;± 0.04% | 91% slower
color         | 5869.8 ± 5.64% | 188463 &ensp;± 0.06% | 98% slower
color-convert | 217.06 ± 1.35% | 6173430 ± 0.04% | 30% slower

- 500 colors/sampling

`rgb2cmyk`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 1099.7 ± 0.18% | 937169 ± 0.02% | fastest
colord        | 73538 &ensp;± 6.12% | 14877 &ensp;± 0.26% | 98% slower
color         | 323961 ± 2.75% | 3353 &ensp;&ensp;± 0.69% | 100% slower
color-convert | 4624.0 ± 2.04% | 273031 ± 0.10% | 71% slower

`rgb2cmyk`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 1217.4 ± 0.17% | 852300 ± 0.03% | fastest
colord        | 94172 &ensp;± 3.22% | 12522 &ensp;± 0.48% | 99% slower
color         | 278511 ± 0.85% | 3735 &ensp;&ensp;± 0.51% | 100% slower
color-convert | 4609.3 ± 1.09% | 269688 ± 0.10% | 68% slower

</details>

<details>
<summary>HEX</summary>

- 10 colors/sampling

`rgb2hex`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 1275.0 ± 0.31% | 801221 ± 0.02% | fastest
colord        | 1470.2 ± 0.47% | 700975 ± 0.02% | 13% slower
color         | 27621 &ensp;± 3.08% | 37596 &ensp;± 0.09% | 95% slower
color-convert | 1772.4 ± 0.71% | 584987 ± 0.02% | 27% slower

`hex2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 1931.1 ± 0.73% | 537991 ± 0.02% | fastest
colord        | 4074.2 ± 0.90% | 257410 ± 0.03% | 52% slower
color         | 10505 &ensp;± 0.75% | 98832 &ensp;± 0.06% | 82% slower
color-convert | 2049.8 ± 1.30% | 523147 ± 0.03% | 3% slower

- 500 colors/sampling

`rgb2hex`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 82675 &ensp;&ensp;± 0.44% | 12431 ± 0.23% | fastest
colord        | 90544 &ensp;&ensp;± 0.47% | 11341 ± 0.22% | 9% slower
color         | 1431425 ± 1.11% | 710 &ensp;&ensp;± 0.80% | 94% slower
color-convert | 101622 &ensp;± 0.39% | 10007 ± 0.19% | 19% slower

`hex2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 107295 ± 0.56% | 9649 ± 0.27% | fastest
colord        | 216812 ± 0.64% | 4746 ± 0.38% | 51% slower
color         | 542092 ± 0.81% | 1885 ± 0.56% | 80% slower
color-convert | 109129 ± 0.61% | 9515 ± 0.28% | 1% slower

</details>

<details>
<summary>HSB</summary>

- 10 colors/sampling

`rgb2hsb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 198.26 ± 0.23% | 5567865 ± 0.03% | fastest
colord        | 435.80 ± 1.37% | 2360374 ± 0.01% | 58% slower
color         | 6764.2 ± 3.26% | 157642 &ensp;± 0.06% | 97% slower
color-convert | 441.37 ± 1.36% | 2475841 ± 0.02% | 56% slower

`hsb2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 146.86 ± 0.28% | 7786961 ± 0.02% | fastest
colord        | 1822.4 ± 17.07% | 675545 &ensp;± 0.04% | 91% slower
color         | 6597.1 ± 0.58% | 155684 &ensp;± 0.04% | 98% slower
color-convert | 385.37 ± 0.86% | 2974037 ± 0.04% | 62% slower

- 500 colors/sampling

`rgb2hsb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 3755.2 ± 0.18% | 276840 ± 0.05% | fastest
colord        | 19889 &ensp;± 7.88% | 55989 &ensp;± 0.13% | 80% slower
color         | 338564 ± 0.88% | 3059 &ensp;&ensp;± 0.53% | 99% slower
color-convert | 17136 &ensp;± 0.78% | 63809 &ensp;± 0.13% | 77% slower

`hsb2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 2292.9 ± 0.15% | 444420 ± 0.02% | fastest
colord        | 70170 &ensp;± 0.62% | 14935 &ensp;± 0.23% | 97% slower
color         | 316699 ± 0.50% | 3198 &ensp;&ensp;± 0.31% | 99% slower
color-convert | 20431 &ensp;± 0.53% | 50821 &ensp;± 0.08% | 89% slower

</details>

<details>
<summary>NAMED</summary>

- 10 colors/sampling

`rgb2named`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 26811 &ensp;± 0.90% | 40043 ± 0.11% | fastest
colord        | 766550 ± 1.30% | 1353 &ensp;± 0.83% | 97% slower
color         | 73089 &ensp;± 0.37% | 13866 ± 0.12% | 65% slower
color-convert | 80482 &ensp;± 0.68% | 13180 ± 0.30% | 67% slower

`named2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 219.39 ± 0.41% | 4905299 ± 0.02% | fastest
colord        | 8576.5 ± 0.64% | 119825 &ensp;± 0.04% | 98% slower
color         | 10620 &ensp;± 1.01% | 96772 &ensp;&ensp;± 0.05% | 98% slower
color-convert | 605.31 ± 1.01% | 1783149 ± 0.02% | 64% slower

- 500 colors/sampling

`rgb2named`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 1297776 &ensp;± 0.61% | 775 ± 0.53% | fastest
colord        | 41900763 ± 6.92% | 25 &ensp;± 4.62% | 97% slower
color         | 3933145 &ensp;± 1.51% | 257 ± 1.09% | 67% slower
color-convert | 3835206 &ensp;± 1.12% | 262 ± 0.84% | 66% slower

`named2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils   | 7554.5 ± 0.11% | 133815 ± 0.04% | fastest
colord        | 487750 ± 1.01% | 2092 &ensp;&ensp;± 0.52% | 98% slower
color         | 529307 ± 0.40% | 1900 &ensp;&ensp;± 0.30% | 99% slower
color-convert | 38757 &ensp;± 0.38% | 26293 &ensp;± 0.10% | 80% slower

</details>

<details>
<summary>Oklab</summary>

- 10 colors/sampling

`rgb2oklab`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 1993.7 ± 1.83% | 548656 ± 0.04% | fastest

`oklab2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 1778.0 ± 0.37% | 585905 ± 0.03% | fastest

- 500 colors/sampling

`rgb2oklab`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 93955 ± 0.54% | 11009 ± 0.25% | fastest

`oklab2rgb`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 92657 ± 0.53% | 11166 ± 0.25% | fastest

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
color-utils          | 6178.9 ± 2.55% | 169818 &ensp;± 0.10% | 95% slower
color-utils (number) | 3045.7 ± 1.81% | 342768 &ensp;± 0.06% | 91% slower
colord               | 296.15 ± 3.08% | 3696381 ± 0.04% | fastest
color                | 28068 &ensp;± 24.30% | 43753 &ensp;&ensp;± 0.31% | 99% slower

`rgb2hsl` + to HSL string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 6926.5 ± 0.96% | 151278 &ensp;± 0.11% | 91% slower
color-utils (number) | 6941.6 ± 1.25% | 152162 &ensp;± 0.12% | 91% slower
colord               | 631.89 ± 0.38% | 1635387 ± 0.03% | fastest
color                | 35209 &ensp;± 0.68% | 29101 &ensp;&ensp;± 0.21% | 98% slower

`rgb2xyz` + to XYZ string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 11611 &ensp;± 1.50% | 96342 &ensp;± 0.23% | 23% slower
color-utils (number) | 10034 &ensp;± 2.05% | 110280 ± 0.19% | 12% slower
colord               | 8633.8 ± 1.91% | 124808 ± 0.17% | fastest
color                | 44340 &ensp;± 1.23% | 24215 &ensp;± 0.42% | 81% slower

`rgb2lab` + to LAB string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 13500 &ensp;± 1.38% | 84932 &ensp;± 0.32% | 19% slower
color-utils (number) | 9923.1 ± 1.81% | 105303 ± 0.13% | fastest
colord               | 9811.5 ± 1.66% | 105048 ± 0.10% | 0.24% slower
color                | 46989 &ensp;± 0.67% | 21661 &ensp;± 0.21% | 79% slower

- 500 colors/sampling

To RGB string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 685076 &ensp;± 4.51% | 1651 &ensp;&ensp;± 2.89% | 99% slower
color-utils (number) | 196111 &ensp;± 2.67% | 5750 &ensp;&ensp;± 1.31% | 95% slower
colord               | 9353.7 &ensp;± 0.39% | 112593 ± 0.19% | fastest
color                | 1482556 ± 5.14% | 728 &ensp;&ensp;&ensp;± 3.15% | 99% slower

`rgb2hsl` + to HSL string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 631669 &ensp;± 2.82% | 1697 &ensp;± 1.99% | 95% slower
color-utils (number) | 541312 &ensp;± 2.21% | 1895 &ensp;± 0.96% | 94% slower
colord               | 31134 &ensp;&ensp;± 0.27% | 32290 ± 0.11% | fastest
color                | 1896772 ± 2.91% | 540 &ensp;&ensp;± 2.01% | 98% slower

`rgb2xyz` + to XYZ string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 700293 &ensp;± 2.18% | 1465 ± 1.17% | 16% slower
color-utils (number) | 637217 &ensp;± 0.89% | 1581 ± 0.69% | 9% slower
colord               | 582477 &ensp;± 1.28% | 1734 ± 0.65% | fastest
color                | 2258110 ± 0.91% | 444 &ensp;± 0.91% | 74% slower

`rgb2lab` + to LAB string

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils          | 701411 &ensp;± 0.85% | 1435 ± 0.67% | 11% slower
color-utils (number) | 630627 &ensp;± 1.46% | 1604 ± 0.71% | fastest
colord               | 648329 &ensp;± 1.84% | 1578 ± 1.07% | 2% slower
color                | 2948231 ± 4.91% | 355 &ensp;± 3.67% | 78% slower

</details>

<details>
<summary>manipulation</summary>

- 10 times/sampling

Adjust 5 colors for 6 times

 Contrast | Latency avg (ns) | Throughput avg (ops/s) | Comparison
----------|------------------|------------------------|------------
linear           | 1934.4 ± 1.08% | 595019 ± 0.05% | fastest
gamma            | 7444.0 ± 0.90% | 141709 ± 0.07% | 76% slower
auto enhancement | 16445 &ensp;± 1.12% | 65080 &ensp;± 0.13% | 89% slower
auto brightness  | 18115 &ensp;± 0.43% | 57247 &ensp;± 0.11% | 90% slower

Harmony: analogous. Generate 3 colors for 10 times

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 4547.9 ± 3.11% | 262059 ± 0.10% | fastest
colord      | 6457.8 ± 0.77% | 179107 ± 0.12% | 32% slower

Harmony: shades. Generate 6 colors for 10 times

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 7883.7 ± 0.67% | 136970 ± 0.09% | fastest
colord      | 134593 ± 1.51% | 7718 &ensp;&ensp;± 0.30% | 94% slower

Mix 2 colors for 499 times

 Mixing | Latency avg (ns) | Throughput avg (ops/s) | Comparison
--------|------------------|------------------------|------------
mean       | 3014.5 ± 0.88% | 384460 ± 0.09% | 6% slower
brighter   | 5030.1 ± 0.48% | 207832 ± 0.05% | 49% slower
deeper     | 5067.8 ± 0.49% | 205364 ± 0.05% | 50% slower
soft light | 7449.1 ± 5.43% | 144906 ± 0.07% | 64% slower
additive   | 3203.7 ± 0.83% | 328805 ± 0.05% | 19% slower
weighted   | 2543.4 ± 0.51% | 407623 ± 0.03% | fastest

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

Harmony: analogous. Generate 3 colors for 500 times

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 217506 ± 1.35% | 5063 ± 0.70% | fastest
colord      | 468879 ± 5.61% | 2666 ± 1.51% | 47% slower

Harmony: shades. Generate 6 colors for 500 times

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 375691 &ensp;± 0.70% | 2728 ± 0.52% | fastest
colord      | 6056219 ± 1.33% | 166 &ensp;± 1.05% | 94% slower

Mix 2 colors for 499 times

 Mixing | Latency avg (ns) | Throughput avg (ops/s) | Comparison
--------|------------------|------------------------|------------
mean       | 118136 ± 0.63% | 8877 ± 0.35% | fastest
brighter   | 230521 ± 0.54% | 4430 ± 0.35% | 50% slower
deeper     | 306693 ± 0.61% | 3333 ± 0.43% | 62% slower
soft light | 353260 ± 1.24% | 2988 ± 0.67% | 66% slower
additive   | 138872 ± 0.78% | 7648 ± 0.42% | 14% slower
weighted   | 148091 ± 2.27% | 7575 ± 0.57% | 15% slower

</details>

<details>
<summary>some other fcuntions</summary>

- 10 colors/sampling

`rgb2hue`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 186.71 ± 0.31% | 6422953 ± 0.03% | fastest
colord      | 234.73 ± 0.28% | 4488302 ± 0.02% | 30% slower
color       | 6431.5 ± 12.29% | 193392 &ensp;± 0.10% | 97% slower

`isReadable`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 3213.7 ± 0.26% | 317981 &ensp;± 0.03% | 81% slower
colord      | 638.20 ± 0.31% | 1691278 ± 0.03% | fastest

- 500 colors/sampling

`rgb2hue`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 4122.0 ± 0.17% | 249077 ± 0.04% | fastest
colord      | 6461.1 ± 0.43% | 169177 ± 0.09% | 32% slower
color       | 268715 ± 0.94% | 3906 &ensp;&ensp;± 0.55% | 98% slower

`isReadable`

 Library | Latency avg (ns) | Throughput avg (ops/s) | Comparison
---------|------------------|------------------------|------------
color-utils | 168171 ± 0.32% | 6003 &ensp;± 0.20% | 80% slower
colord      | 42168 &ensp;± 3.51% | 30471 ± 0.43% | fastest

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
