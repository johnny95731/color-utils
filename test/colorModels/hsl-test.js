import { colord } from 'colord';
import Color from 'color';
import convert from 'color-convert';

import { equivalenceTest, stabilityTest } from '../utilsForTest/color-test.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2hsl, hsl2rgb, rgb2hex } from '../../dist/colors.mjs';


const { rgbs } = SampleGenerator.defaults;

function hslEquiv() {
  const colord_ = (rgb) => {
    const { h, s, l } = colord(rgb2hex(rgb)).toHsl();
    return [h, s, l];
  };
  const color_ = (rgb) => {
    return Color(rgb2hex(rgb)).hsl().color;
  };
  const convert_ = (rgb) => {
    return convert.rgb.hsl.raw(rgb);
  };
  const custom_ = (rgb) => {
    return rgb2hsl(rgb).map(val => Math.round(val));
  };

  equivalenceTest(custom_, colord_, rgbs);
  equivalenceTest(rgb2hsl, color_, rgbs);
  equivalenceTest(rgb2hsl, convert_, rgbs);
}

console.log('HSL equivalence and stability.');
hslEquiv();
stabilityTest(rgb2hsl, hsl2rgb, rgbs);
