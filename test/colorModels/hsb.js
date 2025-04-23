import { colord } from 'colord';
import convert from 'color-convert';

import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2hsb, hsb2rgb } from '../../dist/colors.mjs';


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
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.rgb.hsv.raw(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2hsb(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to HSB',
    [colord_, color_, convert_, custom_]
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
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.hsv.rgb.raw(tempArr[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      hsb2rgb(tempArr[i]);
    }
  };
  return performanceTest(
    'HSB to RGB',
    [colord_, color_, convert_, custom_]
  );
}


const fns = [
  toHsb,
  fromHsb,
];
for (const fn of fns) {
  await fn();
}
