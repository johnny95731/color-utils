import { colord, extend } from 'colord';
import xyzPlugin from 'colord/plugins/xyz';
import convert from 'color-convert';

import { performanceTest } from '../../../test-utils/perf.js';
import { SampleGenerator } from '../../../test-utils/sample.js';
import { rgb2xyz, xyz2rgb } from '../../../dist/index.js';

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
  const fn = convert.rgb.xyz.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2xyz(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to XYZ',
    [
      ['color-utils',  custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ]
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
  const fn = convert.xyz.rgb.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(tempArr[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      xyz2rgb(tempArr[i]);
    }
  };
  return performanceTest(
    'XYZ to RGB',
    [
      ['color-utils',  custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ]
  );
}

const fns = [
  toXyz,
  fromXyz,
];
for (const fn of fns) {
  await fn();
}
