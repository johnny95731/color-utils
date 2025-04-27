import { colord } from 'colord';
import convert from 'color-convert';

import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2hsb, hsb2rgb } from '../../dist/index.js';


const { rgbs, colors, colords, length } = SampleGenerator.defaults;

function toHsb() {
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].toHsv();
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].hsv();
    }
  };
  const fn = convert.rgb.hsv.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2hsb(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to HSB',
    [
      ['color-utils',  custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ]
  );
}

function fromHsb() {
  const tempColord = [];
  const tempColor = [];
  const tempArr = [];
  for (let i = 0; i < length; i++) {
    tempColord.push(colords[i].toHsv());
    tempColor.push(colors[i].hsv());
    tempArr.push(rgb2hsb(rgbs[i]));
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
  const fn = convert.hsv.rgb.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(tempArr[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      hsb2rgb(tempArr[i]);
    }
  };
  return performanceTest(
    'HSB to RGB',
    [
      ['color-utils',  custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ]
  );
}


const fns = [
  toHsb,
  fromHsb,
];
for (const fn of fns) {
  await fn();
}
