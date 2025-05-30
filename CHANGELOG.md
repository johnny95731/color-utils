# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Plugins for spaces.
- Handling alpha channel (transparency) in manipulating.
- Set default options manually.
- A faster function to CSS format

### Changed

- Handling alpha channel (transparency) in manipulating.

### Fixed

- `distE00`: Larger error (0.5-0.98) for some lab1 = [l1, a1, a2], lab2 = [l2, -a1, -b1].

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
- **Type change**: remove all `readonly` keyword in `ColorSpace` type. [(d9d8f15)](https://github.com/johnny95731/color-utils/commit/d9d8f1578ab488183b28e774125ac5655420906f)
- **Type change**: Remove `readonly number[]` type in `max_` property of `ColorSpace`. Now only
  [(dea79fb)](https://github.com/johnny95731/color-utils/commit/dea79fb670ecd6c5bb1759f91f82360f24a0233d)

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

### Removed

- Remove export of variables: `rgb2xyzMat`, `xyz2rgbMat`, and `xyzMax`. [(a29abd7)](https://github.com/johnny95731/color-utils/commit/a29abd759aa163dc5d176221ca6025382c21d6d2)
