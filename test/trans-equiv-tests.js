/**
 * Test the equivalence between custom function and package.
 * And test the stability of transformation, e.g., test whether
 * `xyz2rgb(rgb2xyz(rgb))` and `rgb` are close or not.
 */

// Controll the test samples.
// import { SampleGenerator } from './utilsForTest/sample.js';
// SampleGenerator.b(5);

await import('./colorModels/ciexyz-test.js');
await import('./colorModels/cielab-test.js');
await import('./colorModels/oklab-test.js');
await import('./colorModels/cieluv-test.js');
await import('./colorModels/cmyk-test.js');
await import('./colorModels/hex-test.js');
await import('./colorModels/hsb-test.js');
await import('./colorModels/hsl-test.js');
await import('./colorModels/hwb-test.js');
await import('./colorModels/named-test.js');

await import('./colorModels/cmyk-formula-test.js');

