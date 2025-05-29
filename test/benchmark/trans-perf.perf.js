/**
 * Test the performance of transformations.
 */

// Controll the test samples.
// import { SampleGenerator } from '../../test-utils/sample.js';
// SampleGenerator.b(10);

await import('./colorModels/ciexyz.perf.js');
await import('./colorModels/cielab.perf.js');
await import('./colorModels/cieluv.perf.js');
await import('./colorModels/cmyk.perf.js');
await import('./colorModels/hex.perf.js');
await import('./colorModels/hsb.perf.js');
await import('./colorModels/hsl.perf.js');
await import('./colorModels/hwb.perf.js');
await import('./colorModels/named.perf.js');
await import('./colorModels/oklab.perf.js');
