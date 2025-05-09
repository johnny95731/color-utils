import { colord, extend } from 'colord';
import Color from 'color';
import labPlugin from 'colord/plugins/lab';
import lchPlugin from 'colord/plugins/lch';
import convert from 'color-convert';

import { equivalenceTest, stabilityTest } from '../utilsForTest/color-test.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2lab, lab2rgb, rgb2lchab, lchab2rgb, rgb2hex, setReferenceWhite } from '../../dist/index.js';
import { isSameColor } from '../utilsForTest/helpers.js';


extend([labPlugin, lchPlugin]);

const { rgbs } = SampleGenerator.defaults;

const compFn = (arr1, arr2) => isSameColor(arr1, arr2, 0.1);

function labEquiv() {
  const colord_ = [
    'colord',
    (rgb) => {
      const { l, a, b } = colord(rgb2hex(rgb)).toLab();
      return [l, a, b];
    }
  ];
  const color_ = [
    'color',
    (rgb) => {
      return Color(rgb2hex(rgb)).lab().color;
    }
  ];
  const convert_ = [
    'color-convert',
    (rgb) => {
      return convert.rgb.lab.raw(rgb);
    }
  ];
  const custom = ['color-utils', rgb2lab];

  setReferenceWhite('D50'); // colord use different reference white
  equivalenceTest(custom, colord_, [rgbs], compFn);
  setReferenceWhite('D65');
  equivalenceTest(custom, color_, rgbs, compFn);
  equivalenceTest(custom, convert_, rgbs, compFn);
}

function lchabEquiv() {
  const colord_ = [
    'colord',
    (rgb) => {
      const { l, c, h } = colord(rgb2hex(rgb)).toLch();
      return [l, c, h];
    }
  ];
  const color_ = [
    'color',
    (rgb) => {
      if (rgb2hex(rgb) === '#FFFFFF') return [100,0,0]; // non standard
      return Color(rgb2hex(rgb)).lch().color;
    }
  ];
  const convert_ = [
    'color-convert',
    (rgb) => {
      if (rgb2hex(rgb) === '#FFFFFF') return [100,0,0]; // non standard
      return convert.rgb.lch.raw(rgb);
    }
  ];
  const custom = ['color-utils', rgb2lchab];

  setReferenceWhite('D50'); // colord use different reference white
  equivalenceTest(custom, colord_, rgbs, compFn);
  setReferenceWhite('D65');
  equivalenceTest(custom, color_, rgbs, compFn);
  equivalenceTest(custom, convert_, rgbs, compFn);
}

console.log('CIELAB equivalence and stability.');
labEquiv();
stabilityTest(rgb2lab, lab2rgb, rgbs);

console.log('CIELCH(ab) equivalence and stability.');
lchabEquiv();
stabilityTest(rgb2lchab, lchab2rgb, rgbs);
