import { colord } from 'colord';
import Color from 'color';
import convert from 'color-convert';

import { equivalenceTest, stabilityTest } from '../utilsForTest/color-test.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2hsl, hsl2rgb, rgb2hex } from '../../dist/index.js';


const { rgbs } = SampleGenerator.defaults;

function hslEquiv() {
  const colord_ = [
    'colord',
    (rgb) => {
      const { h, s, l } = colord(rgb2hex(rgb)).toHsl();
      return [h, s, l];
    }
  ];
  const color_ = [
    'color',
    (rgb) => {
      return Color(rgb2hex(rgb)).hsl().color;
    }
  ];
  const convert_ = [
    'color-convert',
    (rgb) => {
      return convert.rgb.hsl.raw(rgb);
    }
  ];
  const customRounding = [
    'color-utils',
    (rgb) => {
      return rgb2hsl(rgb).map(val => Math.round(val));
    }
  ];
  const custom = ['color-utils', rgb2hsl];

  equivalenceTest(customRounding, colord_, rgbs);
  equivalenceTest(custom, color_, rgbs);
  equivalenceTest(custom, convert_, rgbs);
}

console.log('HSL equivalence and stability.');
hslEquiv();
stabilityTest(rgb2hsl, hsl2rgb, rgbs);
