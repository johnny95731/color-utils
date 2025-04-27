import { colord } from 'colord';
import Color from 'color';
import convert from 'color-convert';

import { equivalenceTest, stabilityTest } from '../utilsForTest/color-test.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2hsb, hsb2rgb, rgb2hex } from '../../dist/index.js';

const { rgbs } = SampleGenerator.defaults;

function hsbEquiv() {
  const colord_ = [
    'colord',
    (rgb) => {
      const { h, s, v } = colord(rgb2hex(rgb)).toHsv();
      return [h, s, v];
    }
  ];
  const color_ = [
    'color',
    (rgb) => {
      return Color(rgb2hex(rgb)).hsv().color;
    }
  ];
  const convert_ = [
    'color-convert',
    (rgb) => {
      return convert.rgb.hsv.raw(rgb);
    }
  ];
  const customRounding = [
    'color-utils',
    (rgb) => {
      return rgb2hsb(rgb).map(val => Math.round(val));
    }
  ];
  const custom = ['color-utils', rgb2hsb];

  equivalenceTest(customRounding, colord_, rgbs);
  equivalenceTest(custom, color_, rgbs);
  equivalenceTest(custom, convert_, rgbs);
}
function hsbEquiv2() {
  const colord_ = [
    'colord',
    (rgb) => {
      const hsv = colord(rgb2hex(rgb)).toHsv();
      const { r, g, b } = colord(hsv).toRgb();
      return [r, g, b];
    }
  ];
  const color_ = [
    'color',
    (rgb) => {
      return Color(rgb2hex(rgb)).hsv().rgb().color;
    }
  ];
  const convert_ = [
    'color-convert',
    (rgb) => {
      const hsv = convert.rgb.hsv.raw(rgb);
      return convert.hsv.rgb.raw(hsv);
    }
  ];
  const custom = [
    'color-utils',
    (rgb) => {
      return hsb2rgb(rgb2hsb(rgb));
    }
  ];

  equivalenceTest(custom, colord_, rgbs);
  equivalenceTest(custom, color_, rgbs);
  equivalenceTest(custom, convert_, rgbs);
}

console.log('hsb stability');
stabilityTest(rgb2hsb, hsb2rgb, rgbs);
console.log('rgb2hsb equivalence');
hsbEquiv();
console.log('hsb2rgb equivalence');
hsbEquiv2();
