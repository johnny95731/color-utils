import { colord, extend } from 'colord';
import Color from 'color';
import cmykPlugin from 'colord/plugins/cmyk';
import convert from 'color-convert';

import { equivalenceTest, stabilityTest } from '../utilsForTest/color-test.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2cmyk, cmyk2rgb, rgb2hex } from '../../dist/index.js';

extend([cmykPlugin]);

const { rgbs } = SampleGenerator.defaults;

function cmykEquiv() {
  const colord_ = [
    'colord',
    (rgb) => {
      const { c, m, y, k } = colord(rgb2hex(rgb)).toCmyk();
      return [c, m, y, k];
    }
  ];;
  const color_ = [
    'color',
    (rgb) => {
      return Color(rgb2hex(rgb)).cmyk().color;
    }
  ];
  const convert_ = [
    'color-convert',
    (rgb) => {
      return convert.rgb.cmyk.raw(rgb);
    }
  ];
  const customRounding = [
    'color-utils',
    (rgb) => {
      return rgb2cmyk(rgb).map(val => Math.round(val));
    }
  ];
  const custom = ['color-utils', rgb2cmyk];

  equivalenceTest(customRounding, colord_, rgbs); // colord will round the values
  equivalenceTest(custom, color_, rgbs);
  equivalenceTest(custom, convert_, rgbs);
}


console.log('CMYK equivalence and stability.');
cmykEquiv();
stabilityTest(rgb2cmyk, cmyk2rgb, rgbs);
