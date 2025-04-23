/**
 * Test the performance of transformations.
 */

// Controll the test samples.
// import { SampleGenerator } from './utilsForTest/sample.js';
// SampleGenerator.b(5);

await import('./colorModels/ciexyz.js');
await import('./colorModels/cielab.js');
await import('./colorModels/cieluv.js');
await import('./colorModels/cmyk.js');
await import('./colorModels/hex.js');
await import('./colorModels/hsb.js');
await import('./colorModels/hsl.js');
await import('./colorModels/hwb.js');
await import('./colorModels/named.js');
