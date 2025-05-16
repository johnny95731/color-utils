# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Plugins for spaces.

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
- **Improve performance**:<br/>
  1. `getColorSpace`: use object literal instead of `Array.prototype.find`. [(af8c264)](https://github.com/johnny95731/color-utils/commit/af8c264632244021d5884311bfddee6237212fdb)
  2. `getCssColor`: `RegExp.prototype.test` instead of `String.prototype.startswith` and remove array destructuring.<br/>
    `Array.prototype.reduce` instead of `map` and `Array.prototype.join`
    [(809c33e)](https://github.com/johnny95731/color-utils/commit/809c33e861773cdf07332f1e7f948ef4d41950d4) [(7f257d5)](https://github.com/johnny95731/color-utils/commit/7f257d5f0a82bc36c0576d8e997c952449120f93) [(53a7476)](https://github.com/johnny95731/color-utils/commit/53a7476455db2a5336a7ee41b4c595ee4a3975e3)<br/>
  3. `getContrastRatio`: remove unnecessary variables.
    [(809c33e)](https://github.com/johnny95731/color-utils/commit/7f257d5f0a82bc36c0576d8e997c952449120f93)<br/>
  4. `rgb2cmyk`: remove unnecessary variables.
    [(809c33e)](https://github.com/johnny95731/color-utils/commit/809c33e861773cdf07332f1e7f948ef4d41950d4)<br/>

### Deprecated

- `getSpaceRange`: Directly get range from `ColorSpace.max_` instead. [(dea79fb)](https://github.com/johnny95731/color-utils/commit/dea79fb670ecd6c5bb1759f91f82360f24a0233d)

### Removed

- Remove export of variables: `rgb2xyzMat`, `xyz2rgbMat`, and `xyzMax`. [(a29abd7)](https://github.com/johnny95731/color-utils/commit/a29abd759aa163dc5d176221ca6025382c21d6d2)
