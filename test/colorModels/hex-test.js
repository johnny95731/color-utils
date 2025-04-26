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
  const colord_ = (rgb) => {
    return colord(rgb2hex(rgb)).toHex();
  };
  const color_ = (rgb) => {
    return Color(rgb2hex(rgb)).hex();
  };
  const convert_ = (rgb) => {
    return '#' + convert.rgb.hex(rgb);
  };

  equivalenceTest(rgb2hex, colord_, rgbs, isSameHex);
  equivalenceTest(rgb2hex, color_, rgbs, isSameHex);
  equivalenceTest(rgb2hex, convert_, rgbs, isSameHex);
}

console.log('HEX equivalence and stability.');
hexEquiv();
stabilityTest(rgb2hex, hex2rgb, rgbs);
