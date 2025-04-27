import { colord, extend } from 'colord';
import hwbPlugin from 'colord/plugins/hwb';
import Color from 'color';
import convert from 'color-convert';

import { equivalenceTest, stabilityTest } from '../utilsForTest/color-test.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2hwb, hwb2rgb, rgb2hex } from '../../dist/index.js';

extend([hwbPlugin]);

const { rgbs } = SampleGenerator.defaults;

function hwbEquiv() {
  const colord_ = [
    'colord',
    (rgb) => {
      const { h, w, b } = colord(rgb2hex(rgb)).toHwb();
      return [h, w, b];
    }
  ];
  const color_ = [
    'color',
    (rgb) => {
      return Color(rgb2hex(rgb)).hwb().color;
    }
  ];
  const convert_ = [
    'color-convert',
    (rgb) => {
      return convert.rgb.hwb.raw(rgb);
    }
  ];
  const customRounding = [
    'color-utils',
    (rgb) => {
      return rgb2hwb(rgb).map(val => Math.round(val));
    }
  ];
  const custom = ['color-utils', rgb2hwb];

  equivalenceTest(customRounding, colord_, rgbs);
  equivalenceTest(custom, color_, rgbs);
  equivalenceTest(custom, convert_, rgbs);
}

console.log('HWB equivalence and stability.');
hwbEquiv();
stabilityTest(rgb2hwb, hwb2rgb, rgbs);
