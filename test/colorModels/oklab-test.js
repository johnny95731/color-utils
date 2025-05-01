import { stabilityTest } from '../utilsForTest/color-test.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2oklab, oklab2rgb, oklch2rgb, rgb2oklch, rgbArraylize } from '../../dist/index.js';

const { rgbs } = SampleGenerator.defaults;


console.log(
  rgb2oklab(rgbArraylize('#0F0')),
);

console.log('Oklab stability.');
stabilityTest(rgb2oklab, oklab2rgb, rgbs);

console.log('Oklch stability.');
stabilityTest(rgb2oklch, oklch2rgb, rgbs);
