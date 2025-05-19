<h1>color-utils</h1>

**color-utils** provides functions for color conversions, harmonies, mix, and sort.

:speech_balloon: Newer README.md may push to github but not publish in npm. To see detail changes: [Changelog](https://github.com/johnny95731/color-utils/blob/main/CHANGELOG.md) (record since v1.2.0).

<h2>Features</h2>

- **Small**: 10.4KB for conversions only. 14.3KB size after minified (12.8KB with [mangle.properties.regex](#mangle))
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

<details>
<summary><b>Error handling</b></summary>

`hex2rgb` and `named2rgb` return `[0, 0, 0]` when the input is incorrect.
</details>

<h3><code>ColorSpace</code>Type</h3>

`COLOR_SPACES` array stores `ColorSpace` object, which has informations

key   | info
------|------
name_ | Name of color space
isSupported_ | In browser environment, the value will be initialized by calling `CSS.supports('color', 'space(0 0 0)');`. In node environment, the value will be set to default value as below.
labels_ | Labels of channels.
max_ | Maximums or ranges.
fromRgb_ | Converter from RGB to space.
toRgb_ | Converter from space to RGB.

Note: `COLOR_SPACES` does not have HEX and NAMED space object. And, both `LCHab` and `LCHuv` will check `CSS.supports('color', 'lch(0 0 0)');` though these two spaces are not equvalent.

<details>
<summary>Default values of <code>.isSupported_</code></summary>

 space | value
-------|-----------
RGB    | `true`
HSL    | `true`
HSB    | `false`
HWB    | `true`
CMYK   | `false`
XYZ    | `false`
LAB    | `true`
LCHab  | `true`
LUV    | `false`
LCHuv  | `true`

</details>

<details>
<summary><code>getColorSpace(space: ColorSpace | string): ColorSpace</code></summary>

Return an item in `COLOR_SPACES`. If input a string, find an item that `.name_` property equals the string (if find no item, return RGB space).

</details>

<details>
<summary><code>toSpace(color: readonly number[],
    space: ColorSpace | string,
    toSpace: ColorSpace | string
  ): number[]
</code></summary>

Conversion by specifying the origin space and target space. The space name does not support HEX and NAMED and is case-insensitive.

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
<summary><code>setReferenceWhite(white: 'D65' | 'D50'): void</code></summary>

Change the reference white of CIEXYZ space. This library only support sRGB for RGB model.
This function will change `.max_`

</details>

<h3 id="color-space-ranges">Color Space Ranges</h3>

The `ColorSpace.max_` property gives maximums if its type is `number[]` and gives ranges if its type is `[number, number][]`.

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

<br>
Though some channel of CIE spaces is theoretically unbounded. But, in practice, we give a maximum value.

<details>
<summary>XYZ</summary>

The maximum value is based on RGB model and reference white. y channel will be normalize to `100`.
The library currently only supports `sRGB` as RGB model and `D65` (default) and `D50` as reference white.

<h4>D65</h4>

channel | description | min | max
--------|-------------|-----|-----
x | | 0 | 95.047
y | | 0 | 100
z | | 0 | 108.883

<h4>D50</h4>

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

Return the L2-distance of two LAB colors.
This is the CIE 1976 color difference (CIE76 or E76).

</details>

<details>
<summary><code>distE94(lab1: readonly number[], lab2: readonly number[]): number</code></summary>

Return the square of CIE 1994 color difference (CIE94 or E94).

The ***square***:
CIE94 formula will take square root. This function is present for comparing the color difference between colors, e.g. `distE94(lab1, lab2) < distE94(lab1, lab3)`, thus the square root is unnecessary.

</details>

<details>
<summary><code>distE00(lab1: readonly number[], lab2: readonly number[]): number</code></summary>

Return the square of CIEDE2000 color difference (CIEDE2000 or E00).

The reason for square is the same as in `distE94`.

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

Return a sorted and copied array of RGB colors. Similar to `sortColors` but input RGB colors directly.

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
<summary><code>cloneDeep&lt;T>(obj: T, cloneCustom: boolean = false): DeepWriteable&lt;T></code></summary>

Deeply clone object.

The following types will be handle:

- primitive type
- `Number`, `String`, `Boolean`
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

```js
ratio = (val - min) / (max - min)
newVal = newMin + ratio * (newMax - newMin)
```

</details>

<details>
<summary><code>deg2rad(deg: number): number</code> and <code>rad2deg(rad: number): number</code></summary>

Convert between degree and radian.

</details>

<details>
<summary><code>elementwiseMean(arr1: readonly number[], arr2: readonly number[]): number[]</code></summary>

Elementwise mean of two array. The length of output is `Math.min(arr1.length, arr2.length)`.

</details>

Notice that some function only deal with fixed length.

<details>
<summary><code>dot3(arr1: readonly number[], arr2: readonly number[]): number</code></summary>

Dot two arrays with length = 3.
Return `arr1[0] * arr2[0] + arr1[1] * arr2[1] + arr1[2] * arr2[2]`.

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

```js
return l2Norm3(color1[0] - color2[0], color1[1] - color2[1], color1[2] - color2[2]);
```

</details>

<h2 id="tests">Tests</h2>

All test files are in test folder. `test/utilsForTest` contains helpers for test.<br/>
File name convention:

- **`cmyk-formula-test.js`**: Test whether 3 different formulas are the same.

- **End with `-test`**: test
  1. The equivalence of result between this module and other modules.
  2. The stability of conversions, for example, test whether `rgb` and `hsl2rgb(rgb2hsl(rgb))` are close enough.

- **Others**: performance test.

<h2 id="benchmark">Benchmark</h2>

Run command `npm run benchmark`.

- Node version: v22.11.0.
- CPU: Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz
- library: `tinybench` 3.1.1
- Every test function convert 10 colors by default. For details, see `SampleGenerator.defaults` in `./test/utilsForTest/sample.js`.

Only list some benchmaks since some conversions have similar formula and performance.

<details>
<summary>XYZ</summary>

`rgb2xyz`

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 1821.1 ± 0.19% | 566821 &ensp;± 0.03% | 90% slower
colord        | 5139.0 ± 5.52% | 211382 &ensp;± 0.05% | 96% slower
color         | 8217.0 ± 5.29% | 133942 &ensp;± 0.09% | 98% slower
color-convert | 228.57 ± 2.15% | 5418805 ± 0.03%      | fastest

`xyz2rgb`

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 1725.0 ± 0.40% | 609665 &ensp;± 0.04% | 87% slower
colord        | 5375.2 ± 6.18% | 206343 &ensp;± 0.06% | 95% slower
color         | 9078.4 ± 0.68% | 116323 &ensp;± 0.08% | 97% slower
color-convert | 271.65 ± 1.68% | 4527525 ± 0.02% | fastest

</details>

<details>
<summary>CMYK</summary>

`rgb2cmyk`

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 124.54 ± 0.41% | 9074605 ± 0.02% | fastest
colord        | 1207.4 ± 0.18% | 852937 &ensp;± 0.03% | 91% slower
color         | 6611.2 ± 8.00% | 171155 &ensp;± 0.07% | 98% slower
color-convert | 187.30 ± 1.32% | 7109575 ± 0.03% | 22% slower

`cmyk2rgb`

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 111.24 ± 0.38% | 9546184 ± 0.01% | fastest
colord        | 2159.8 ± 0.79% | 493868 &ensp;± 0.04% | 95% slower
color         | 5433.1 ± 0.72% | 190225 &ensp;± 0.03% | 98% slower
color-convert | 185.55 ± 1.17% | 7044702 ± 0.03% | 26% slower

</details>

<details>
<summary>HEX</summary>

`rgb2hex`

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 1260.0 ± 0.30% | 804682 ± 0.01% | fastest
colord        | 1504.9 ± 7.80% | 726625 ± 0.02% | 10% slower
color         | 25645&thinsp; ± 0.59% | 39933 &ensp;± 0.09% | 95% slower
color-convert | 1734.6 ± 0.64% | 594626 ± 0.02% | 26% slower

`hex2rgb`

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 1893.9 ± 0.67% | 544611 ± 0.01% | fastest
colord        | 4055.7 ± 0.81% | 257520 ± 0.03% | 53% slower
color         | 10063&thinsp; ± 0.69% | 102302 ± 0.05% | 81% slower
color-convert | 2052.2 ± 0.90% | 514284 ± 0.02% | 6% slower

</details>

<details>
<summary>HSB</summary>

`rgb2hsb`

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 193.43 ± 0.35% | 5511814 ± 0.03% | fastest
colord        | 478.54 ± 2.38% | 2271904 ± 0.03% | 59% slower
color         | 10462&thinsp; ± 5.43% | 118337 &ensp;± 0.20% | 98% slower
color-convert | 506.35 ± 0.80% | 2304598 ± 0.04% | 58% slower

`hsb2rgb`

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 257.93 ± &ensp;0.13% | 4286701 ± 0.02% | fastest
colord        | 3552.7 ± 10.13% | 350989 &ensp;± 0.07% | 92% slower
color         | 6898.6 ± &ensp;2.49% | 153517 &ensp;± 0.06% | 96% slower
color-convert | 284.37 ± &ensp;5.50% | 4270099 ± 0.02% | 0.39% slower

</details>

<details>
<summary>NAMED</summary>

`rgb2named`

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 31319 &ensp;± 4.58% | 36141 ± 0.17% | fastest
colord        | 724427 ± 0.87% | 1402 &ensp;± 0.53% | 96% slower
color         | 75252 &ensp;± 0.35% | 13445 ± 0.12% | 63% slower
color-convert | 76712 &ensp;± 0.39% | 13260 ± 0.15% | 63% slower

`named2rgb`

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 216.23 ± 0.86% | 5104754 ± 0.03% | fastest
colord        | 11034&thinsp; ± 5.59% | 99782 &ensp;± 0.10% | 98% slower
color         | 9834.4 ± 0.42% | 103986 &ensp;± 0.05% | 98% slower
color-convert | 558.28 ± 0.67% | 1908326 ± 0.02% | 63% slower

</details>

<details>
<summary><code>getCSSColor</code></summary>

Slower since handle more check.

RGB string

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 5520.3.8 ± 0.83%      | 187493 &ensp;± 0.08%      | 95% slower
colord        | 271.32 ± 2.08%        | 3947510 ± 0.04%           | fastest
color         | 25000 &thinsp;± 3.32% | 44691 &ensp;&ensp;± 0.31% | 99% slower

HSL string

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 7195.6 ± 1.00%        | 145698 &ensp;± 0.12%      | 91% slower
colord        | 610.75 ± 0.28%        | 1669903 ± 0.03%           | fastest
color         | 36477 &thinsp;± 0.95% | 28502 &ensp;&ensp;± 0.28% | 98% slower

LAB string

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 9401.9 &thinsp;± 0.82% | 109794 ± 0.10%      | fastest
colord        | 9710.0 ± 0.68%         | 105149 ± 0.09%      | 4% slower
color         | 48419 &thinsp;± 0.89%  | 21025 &ensp;± 0.17% | 81% slower

</details>

<details>
<summary><code>rgb2hue</code></summary>

Slower since handle more check.

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 186.44 ± 0.33% | 6011580 ± 0.03% | fastest
colord        | 208.50 ± 0.35% | 4923280 ± 0.01% | 18% slower
color         | 6931.3 ± 7.03% | 156062 &ensp;± 0.04% | 97% slower

</details>

<details>
<summary><code>isReadable</code></summary>

Slower since handle more check.

library | Latency avg (ns) | throughput avg (ops/s) | comparison
--------|------------------|------------------------|------------
color-utils   | 4500.8 ± 0.55% | 229408 ± 0.03% | fastest
colord        | 5718.3 ± 0.28% | 176155 ± 0.03% | 23% slower

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
