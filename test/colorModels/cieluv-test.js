import { stabilityTest } from '../utilsForTest/color-test.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2luv, luv2rgb, rgb2lchuv, lchuv2rgb } from '../../dist/index.js';


const { rgbs } = SampleGenerator.defaults;


console.log('CIELUV stability.');
stabilityTest(rgb2luv, luv2rgb, rgbs);

console.log('CIELCH(uv) stability.');
stabilityTest(rgb2lchuv, lchuv2rgb, rgbs);
