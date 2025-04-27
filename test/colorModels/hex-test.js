import { colord, extend } from 'colord';
import Color from 'color';
import cmykPlugin from 'colord/plugins/cmyk';
import convert from 'color-convert';

import { equivalenceTest, stabilityTest } from '../utilsForTest/color-test.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2hex, hex2rgb } from '../../dist/index.js';

extend([cmykPlugin]);

const { rgbs } = SampleGenerator.defaults;

/**
 * @param {string} hex1
 * @param {string} hex2
 */
const isSameHex = (hex1, hex2) => hex1.toLowerCase() === hex2.toLowerCase();

function hexEquiv() {
  const colord_ = [
    'colord',
    (rgb) => {
      return colord(rgb2hex(rgb)).toHex();
    }
  ];
  const color_ = [
    'color',
    (rgb) => {
      return Color(rgb2hex(rgb)).hex();
    }
  ];
  const convert_ = [
    'color-convert',
    (rgb) => {
      return '#' + convert.rgb.hex(rgb);
    }
  ];
  const custom = ['color-utils', rgb2hex];

  equivalenceTest(custom, colord_, rgbs, isSameHex);
  equivalenceTest(custom, color_, rgbs, isSameHex);
  equivalenceTest(custom, convert_, rgbs, isSameHex);
}

console.log('HEX equivalence and stability.');
hexEquiv();
stabilityTest(rgb2hex, hex2rgb, rgbs);
