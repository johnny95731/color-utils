import { colord, extend } from 'colord';
import Color from 'color';
import xyzPlugin from 'colord/plugins/xyz';
import convert from 'color-convert';

import { equivalenceTest, stabilityTest } from '../utilsForTest/color-test.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { isSameColor } from '../utilsForTest/helpers.js';
import { rgb2xyz, xyz2rgb, rgb2hex, setReferenceWhite } from '../../dist/index.js';

extend([xyzPlugin]);

const { rgbs } = SampleGenerator.defaults;

function xyzEquiv() {
  const compFn = (arr1, arr2) => isSameColor(arr1, arr2, 0.1);
  const colord_ = (rgb) => {
    const { x, y, z } = colord(rgb2hex(rgb)).toXyz();
    return [x, y, z];
  };
  const color_ = (rgb) => {
    return Color(rgb2hex(rgb)).xyz().color;
  };
  const convert_ = (rgb) => {
    return convert.rgb.xyz.raw(rgb);
  };

  setReferenceWhite('D50'); // colord use different reference white
  equivalenceTest(rgb2xyz, colord_, rgbs, compFn);
  setReferenceWhite('D65');
  equivalenceTest(rgb2xyz, color_, rgbs, compFn);
  equivalenceTest(rgb2xyz, convert_, rgbs, compFn);
}


console.log('CIEXYZ equivalence and stability.');
xyzEquiv();
stabilityTest(rgb2xyz, xyz2rgb, rgbs);
