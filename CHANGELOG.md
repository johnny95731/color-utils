# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Support ictcp, jzazbz, and jzczhz color spaces.
- Plugins for spaces.

## [2.0.0] - 2025-06-

### Added

- Unifying naming conventions.<br/>
  Introduced `rgb2contrast` as a replacement for `getContrastRatio`.<br/>
  Introduced `rgb2luminance` as a replacement for `getRelativeLuminance`. [(4cc883f)](https://github.com/johnny95731/color-utils/commit/4cc883f4202a427bfe6d5f64f85d20410f5062b1)
- Add `alphaNormalize` function to handle an alpha value to valid number.
  `undefined` will be regarded as `1` and numbers will be clipped to `[0, 1]`. [(7ac44b6)](https://github.com/johnny95731/color-utils/commit/7ac44b65abd7a929f6a2644a6761cd0d82d2eac5)
- Add `getAlpha` function to get and normalize alpha value. [(d47c96b)](https://github.com/johnny95731/color-utils/commit/d47c96b38fa42cb58b162ca09a36c248197fdab8)
- Add `mapNonAlpha` function to handle first 3 values in an array and pass other values. [(9a7fd73)](https://github.com/johnny95731/color-utils/commit/9a7fd7306414bbf5667f42bbc903511e7c60a1b0)

### Changed

- Apply a square root to the result in `distE94`. [(4e58030)](https://github.com/johnny95731/color-utils/commit/4e580301429ad2e6504bf3255179e732ab5d8a8d)
- Enable alpha channel support in conversions.<br/>
  `randRgbGen` supports alpha value. Conversions pass alpha channel. Supports 3-, 4-, 6-, 8-digit in hex conversions. Test alpha channels. [(7ac44b6)](https://github.com/johnny95731/color-utils/commit/7ac44b65abd7a929f6a2644a6761cd0d82d2eac5)
- **BREAKING:** Enable alpha channel support in color mixings.<br/>
  Handle alpha compositing. Add benchmarks of mix and softLightBlend. Handle alpha channel in unit tests.<br/>
  Cannot determine if the 3rd value represents an alpha channel in mix, since CMYK space has 4 channels. [(d47c96b)](https://github.com/johnny95731/color-utils/commit/d47c96b38fa42cb58b162ca09a36c248197fdab8) [(a1047b4)](https://github.com/johnny95731/color-utils/commit/a1047b4f66b4d22bf015db2d533adb7f20b506e3) [(cd52602)](https://github.com/johnny95731/color-utils/commit/cd52602144d04735c9863466b84e4717abe6509b)
- Enable alpha channel support in harmony. [(cd52602)](https://github.com/johnny95731/color-utils/commit/cd52602144d04735c9863466b84e4717abe6509b)
- Enable alpha channel support in contrast.<br/>
  Add `mapNonAlpha` function to handle first 3 values. [(790f708)](https://github.com/johnny95731/color-utils/commit/790f708789f7f8294d6a59e5a173f97c9050e8bc)
- Handle alpha value in `getCssColor`.<br/>
  Normalize and round alpha value. Remove % symbol for channels with `max_` = `100` when `percent_` = `false`. [(7ac44b6)](https://github.com/johnny95731/color-utils/commit/7ac44b65abd7a929f6a2644a6761cd0d82d2eac5) [(426efb3)](https://github.com/johnny95731/color-utils/commit/426efb3d8bda02bcc4261790603954121b7fee11)
- **BREAKING:** Replace the word "luminance" with "brightness" in sorting.<br/>
  sortColors function uses grayscale to compare, not relative luminance. [(585e0c0)](https://github.com/johnny95731/color-utils/585e0c0b3c382d9d1582979f974b7c770a64017a)
- **BREAKING:** named2rgb supports alpha and is case insensitive<br/>
  Convert all keys of namedColor to lower case. Input of `named2rgb` is case insensitive. `named2rgb` handle alpha value. [(50306ed)](https://github.com/johnny95731/color-utils/50306ed94d91642c267a486fd08ad1c103b3212d)

### Deprecated

- `getContrastRatio`: Use `rgb2contrast` instead. <br/>
  `getRelativeLuminance`: Use `rgb2luminance` instead. [(4cc883f)](https://github.com/johnny95731/color-utils/commit/4cc883f4202a427bfe6d5f64f85d20410f5062b1)

### Docs

- Correct the JSDoc of `l2Dist3`. The result already includes the square root. [(515775a)](https://github.com/johnny95731/color-utils/commit/515775ab0ab376416478b3034bc3b5724892d7a5)
- Add @see tag to the JSDoc of CIE color difference functions. [(0a95633)](https://github.com/johnny95731/color-utils/commit/0a95633bb23a78b5c1e8658a595601a99fda2f81)

### Fixed

- Fix floating issue at discontinuous point (`Math.abs(h1P - h2P)` near 180).<br/>
   `distE00`: Larger error (0.5-0.98) for some lab1 = [l1, a1, a2], lab2 = [l2, -a1, -b1].<br/>
  A small changes of hue (<1e-14) cause result changes ~=1 for some special inputs. The performance is also enhanced.<br/>
  Currently, the result is more closer to Bruce Lindbloom's Web Site. [(a23b01f)](https://github.com/johnny95731/color-utils/commit/a23b01f3f0a0e4e7a1115b42a7654a227beeb14f)

### Performance

- Improve `tspGreedy`. Skip first and last elements in loop. [(9ccdccd)](https://github.com/johnny95731/color-utils/commit/9ccdccd8a94cfdba4d454696ece175cfc8b6efb8)

### Refactor

- Change for-loop conditions and omit checking hue in LCHab. <br/>
  Replace conditions from Array.length to 3 (4 for CMYK). Omits checking hue due to floating issue. [(15f8d57)](https://github.com/johnny95731/color-utils/commit/15f8d5700fdfc056f25d631c475f17122646cf08)
- Replace assignment with early returns in `clip` function. [(6339cba)](https://github.com/johnny95731/color-utils/commit/6339cbaa89291941bd316bc9b38b9c7c9c143bdc)
- Move revalent code in manipulations to a new function. <br/>
  Normalize string option or index of options to string type. [(19ebe3e)](https://github.com/johnny95731/color-utils/commit/19ebe3eed3dc1a79ba4a05facce22cb34c74a368)
- Return early in `toSpace`. Does not affect result. [(ab06c61)](https://github.com/johnny95731/color-utils/commit/ab06c611822c75ceb0bd4e50c87afcafcfbb3452)

## [1.2.2] - 2025-05-30

### Build

- Console bundle size when rollup. [(c7825ef)](https://github.com/johnny95731/color-utils/commit/c7825ef957c10dc18188ee2f14d8018d6c0e3aca)
- `performanceTest` prints markdown table format if `print` argument is true. [(92f5d21)](https://github.com/johnny95731/color-utils/commit/92f5d2124520f866553fe9355c28aa7269fd9006)
- `SampleGenerator.defaults` gives 500 samples instead of 10. Benchmark test 500 samples by default. [(414d700)](https://github.com/johnny95731/color-utils/commit/414d700f5736b8d094746c900cc7f1b8929730dd)
- `getCssColor`: Merge default option test and { percent_: false } test in benchmark. Add xyz in benchmark. [(08bdcda)](https://github.com/johnny95731/color-utils/commit/08bdcda8bb6e165a174f55debfe40ca75e901886)
- Add `color-diff` library to test `distE00`. Performance test and comparison testing of distE00. Test different formula in distE00. [(55443fa)](https://github.com/johnny95731/color-utils/commit/55443faa6fd827e5365a3d31bc9ce3e409ff5e8d)

### Changed

- `distE00`: The result will take square-root. Now it is standard result. [(bbd165f)](https://github.com/johnny95731/color-utils/commit/bbd165f799ca440611cf42d5dab29016b158c31a)

### Deprecated

- `matVecProduct3`. [(1bb59d3)](https://github.com/johnny95731/color-utils/commit/1bb59d3e89632861ec3512484bfc3e5d551d9568)

### Fixed

- Correct type reference in `map`. [(9fbfa1a)](https://github.com/johnny95731/color-utils/commit/9fbfa1a7aa3f108aff51132e0f70a9e7b4685020)
- Get length from array not function in comparison testing (unit test). [(fa45fd7)](https://github.com/johnny95731/color-utils/commit/fa45fd7fac57eef6fc727ce581bd6e10ad5aa407)
- Correct benchmark test names and functions. [(29afed8)](https://github.com/johnny95731/color-utils/commit/29afed8f466f268a0ce3da6cc292729a7caf4feb)

### Performance

- Improve performance on larger test cases (500 colors/run) and reduce file size: [(aa8007d)](https://github.com/johnny95731/color-utils/commit/aa8007dc4df0bfdf7283a824ae82f963732192bb) <br/>
  `hsb2rgb`: 3x faster.<br/>
  `hsl2rgb`: 2.7x faster.<br/>
  `hwb2rgb`: 1.4x faster.<br/>
  `xyz2rgb`: 1.1x faster.<br/>
  `rgb2oklab`: 2x faster.<br/>
  `oklab2rgb`: 1.9x faster.
- Improve performance:<br/>
  `getRelativeLuminance`: call function to  [(b395d20)](https://github.com/johnny95731/color-utils/commit/b395d20c3ebbbf0c6330e2c4bc6550bc348ea7d0)<br/>
  `distE00`: Reduce pre-computed constants in closure. Reduce ternary operator. [(bbd165f)](https://github.com/johnny95731/color-utils/commit/bbd165f799ca440611cf42d5dab29016b158c31a)

## [1.2.1] - 2025-05-25

### Build

- Unit test with Jest. Replace non-benchmark test file by jest test. [(b0df1d9)](https://github.com/johnny95731/color-utils/commit/b0df1d94f39ee1e3de73ccd5f514c2a4403e0617) [(f7af533)](https://github.com/johnny95731/color-utils/commit/f7af533fd43712e11816d504ff92325abe2b213a) [(b87a198)](https://github.com/johnny95731/color-utils/commit/b87a198f03bdabae5c89309962431217aaaaba79)
- More benchmark on `getCssColor`. [(0e8b838)](https://github.com/johnny95731/color-utils/commit/0e8b83832693c6432639225f39f3e4ed45bf4f9a)

### Fixed

- Argument `copy` work incorrectly in `tspGreedy`. [(2afe076)](https://github.com/johnny95731/color-utils/commit/2afe0762c41a9343d9c059c75978ae6c0140fd4b)
- Incorrect value range in XYZ space when calling `getCssColor`.<br/>
  *CSS color module level 4* specifying `100%` equals `1`. [(f75620c)](https://github.com/johnny95731/color-utils/commit/f75620c7458dbc00c0d4c6bc8cd930f453de070f)<br/>
- L-channel of Oklab and Oklch will not use percentage when set `percent_: false`. [(d74f5c2)](https://github.com/johnny95731/color-utils/commit/d74f5c29c3172f2d572337f6e6e56ac55ef3ee3b)<br/>

### Refactor

- Renamed argument `toSpace` to `to` of function `toSpace`. [(ddde9ea)](https://github.com/johnny95731/color-utils/commit/ddde9ea8bfa6444c05c755e1710f6722e7388e21)

## [1.2.0] - 2025-05-16

### Added

- New mix operator: `mix`, which evaluate weighted sum of two colors.<br/>
  `MIXING_MODES` add new string `'weighted'`.<br/>
  `mixColors` new valid value for parameter `method`: `'weighted'` or `5` (index),<br/>
  which call new mix operator `mix`. [(97f9474)](https://github.com/johnny95731/color-utils/commit/97f9474e4908b8b6b07382c90519d83ba0e570cf) [(e33d11a)](https://github.com/johnny95731/color-utils/commit/e33d11adbe7b6cb1f672a330a8982003979faf9d)

### Build

- Bundled files will keep function names. [(61e92ed)](https://github.com/johnny95731/color-utils/commit/61e92ed57f2e3a6ba08fbc09b15bd87e79b8a807)
- `terser-plugin.ts`: use `renderChunk` instead of `closeBundle` [(bd4dcf3)](https://github.com/johnny95731/color-utils/commit/bd4dcf33d47c793a6f4650b990d600c8da1b3d0f)

### Changed

- **`getCssColor`**: different behavior for XYZ space.<br/>
  Return `'color(xyz-d65 x y z)'` or `'color(xyz-d50 x y z)'` if `checkSupport_` is `true` and the browser does supports. (changed)<br/>
  Return `'xyz(x y z)'` otherwise. [(a29abd7)](https://github.com/johnny95731/color-utils/commit/a29abd759aa163dc5d176221ca6025382c21d6d2) [(0335e6f)](https://github.com/johnny95731/color-utils/commit/0335e6f20ecdfdba8002cf31467529836cdaafba) [(067d61f)](https://github.com/johnny95731/color-utils/commit/067d61ff0ffda1a91f7a8b6a5d32566f0cccfaa1)

### Deprecated

- `getSpaceRange`: Directly get range from `ColorSpace.max_` instead. [(dea79fb)](https://github.com/johnny95731/color-utils/commit/dea79fb670ecd6c5bb1759f91f82360f24a0233d)

### Performance

- `getColorSpace`: use object literal instead of `Array.prototype.find`. [(af8c264)](https://github.com/johnny95731/color-utils/commit/af8c264632244021d5884311bfddee6237212fdb)
- `getCssColor`: `RegExp.prototype.test` instead of `String.prototype.startswith` and remove array destructuring.<br/>
    `Array.prototype.reduce` instead of `map` and `Array.prototype.join`
    [(809c33e)](https://github.com/johnny95731/color-utils/commit/809c33e861773cdf07332f1e7f948ef4d41950d4) [(7f257d5)](https://github.com/johnny95731/color-utils/commit/7f257d5f0a82bc36c0576d8e997c952449120f93) [(53a7476)](https://github.com/johnny95731/color-utils/commit/53a7476455db2a5336a7ee41b4c595ee4a3975e3)<br/>
- `getContrastRatio`: remove unnecessary variables.
    [(809c33e)](https://github.com/johnny95731/color-utils/commit/7f257d5f0a82bc36c0576d8e997c952449120f93)<br/>
- `rgb2cmyk`: remove unnecessary variables.
    [(809c33e)](https://github.com/johnny95731/color-utils/commit/809c33e861773cdf07332f1e7f948ef4d41950d4)<br/>

### Refactor

- Type change: remove all `readonly` keyword in `ColorSpace` type. [(d9d8f15)](https://github.com/johnny95731/color-utils/commit/d9d8f1578ab488183b28e774125ac5655420906f)
- Type change: Remove `readonly number[]` type in `max_` property of `ColorSpace`. Now only
  [(dea79fb)](https://github.com/johnny95731/color-utils/commit/dea79fb670ecd6c5bb1759f91f82360f24a0233d)

### Removed

- Remove export of variables: `rgb2xyzMat`, `xyz2rgbMat`, and `xyzMax`. [(a29abd7)](https://github.com/johnny95731/color-utils/commit/a29abd759aa163dc5d176221ca6025382c21d6d2)
