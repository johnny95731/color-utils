import { colord, extend } from 'colord';
import hwbPlugin from 'colord/plugins/hwb';
import Color from 'color';
import convert from 'color-convert';

import { equivalenceTest, stabilityTest } from '../utilsForTest/color-test.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2hwb, hwb2rgb, rgb2hex } from '../../dist/colors.mjs';

extend([hwbPlugin]);

const { rgbs } = SampleGenerator.defaults;

function hwbEquiv() {
  const colord_ = (rgb) => {
    const { h, w, b } = colord(rgb2hex(rgb)).toHwb();
    return [h, w, b];
  };
  const color_ = (rgb) => {
    return Color(rgb2hex(rgb)).hwb().color;
  };
  const convert_ = (rgb) => {
    return convert.rgb.hwb.raw(rgb);
  };
  const custom_ = (rgb) => {
    return rgb2hwb(rgb).map(val => Math.round(val));
  };

  equivalenceTest(custom_, colord_, rgbs);
  equivalenceTest(rgb2hwb, color_, rgbs);
  equivalenceTest(rgb2hwb, convert_, rgbs);
}

console.log('HWB equivalence and stability.');
hwbEquiv();
stabilityTest(rgb2hwb, hwb2rgb, rgbs);
