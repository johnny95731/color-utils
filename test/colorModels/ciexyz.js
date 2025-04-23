import { colord, extend } from 'colord';
import xyzPlugin from 'colord/plugins/xyz';
import convert from 'color-convert';

import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2xyz, xyz2rgb } from '../../dist/colors.mjs';

extend([xyzPlugin]);

const { rgbs, colors, colords, length } = SampleGenerator.defaults;

function toXyz() {
  const colord_ = () => {
    for (let i = 0; i < length;) {
      colords[i++].toXyz();
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].xyz();
    }
  };
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.rgb.xyz.raw(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2xyz(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to XYZ',
    [colord_, color_, convert_, custom_]
  );
}

function fromXyz() {
  const tempColord = [];
  const tempColor = [];
  const tempArr = [];
  for (let i = 0; i < length; i++) {
    tempColord.push(colords[i].toXyz());
    tempColor.push(colors[i].xyz());
    tempArr.push(rgb2xyz(rgbs[i]));
  }

  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colord(tempColord[i]);
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      tempColor[i].rgb();
    }
  };
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.xyz.rgb.raw(tempArr[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      xyz2rgb(tempArr[i]);
    }
  };
  return performanceTest(
    'XYZ to RGB',
    [colord_, color_, convert_, custom_]
  );
}

const fns = [
  toXyz,
  fromXyz,
];
for (const fn of fns) {
  await fn();
}
