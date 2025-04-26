import { colord } from 'colord';
import Color from 'color';
import convert from 'color-convert';

import { equivalenceTest, stabilityTest } from '../utilsForTest/color-test.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2hsb, hsb2rgb, rgb2hex } from '../../dist/index.js';

const { rgbs } = SampleGenerator.defaults;

function hsbEquiv() {
  const colord_ = (rgb) => {
    const { h, s, v } = colord(rgb2hex(rgb)).toHsv();
    return [h, s, v];
  };
  const color_ = (rgb) => {
    return Color(rgb2hex(rgb)).hsv().color;
  };
  const convert_ = (rgb) => {
    return convert.rgb.hsv.raw(rgb);
  };
  const custom_ = (rgb) => {
    return rgb2hsb(rgb).map(val => Math.round(val));
  };

  equivalenceTest(custom_, colord_, rgbs);
  equivalenceTest(rgb2hsb, color_, rgbs);
  equivalenceTest(rgb2hsb, convert_, rgbs);
}
function hsbEquiv2() {
  const colord_ = (rgb) => {
    const hsv = colord(rgb2hex(rgb)).toHsv();
    const { r, g, b } = colord(hsv).toRgb();
    return [r, g, b];
  };
  const color_ = (rgb) => {
    return Color(rgb2hex(rgb)).hsv().rgb().color;
  };
  const convert_ = (rgb) => {
    const hsv = convert.rgb.hsv.raw(rgb);
    return convert.hsv.rgb.raw(hsv);
  };
  const custom_ = (rgb) => {
    return hsb2rgb(rgb2hsb(rgb));
  };

  equivalenceTest(custom_, colord_, rgbs);
  equivalenceTest(custom_, color_, rgbs);
  equivalenceTest(custom_, convert_, rgbs);
}

console.log('hsb stability');
stabilityTest(rgb2hsb, hsb2rgb, rgbs);
console.log('rgb2hsb equivalence');
hsbEquiv();
console.log('hsb2rgb equivalence');
hsbEquiv2();
